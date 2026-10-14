import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { acceptOrder, deliverNextReceipt } from "./OrderPolicy";
import {
  MemoryOrderLedger,
  composeOrderLab,
  type PreviewEntry,
} from "./OrderAdapters";
import { OrderBoundaryLab } from "./OrderBoundaryLab";
import type { OrderRecorder, PendingReceipt } from "./OrderPorts";
const order = {
  id: "one",
  customerEmail: "reader@example.com",
  totalPence: 3299,
};
function setup() {
  const ledger = new MemoryOrderLedger();
  const previews: PreviewEntry[] = [];
  return {
    ledger,
    previews,
    ports: composeOrderLab(ledger, previews, "none", "email"),
  };
}
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}
describe("policy-owned order and receipt boundaries", () => {
  it("acceptance needs only a recorder, with no sender or queue", async () => {
    const record = vi.fn(async () => ({ kind: "recorded" as const }));
    expect(await acceptOrder(order, { record })).toEqual({ kind: "recorded" });
    expect(record).toHaveBeenCalledExactlyOnceWith(order);
  });
  it("invalid runtime input never reaches storage", async () => {
    const record = vi.fn();
    for (const input of [
      null,
      [],
      {},
      { ...order, id: " " },
      { ...order, customerEmail: "invalid" },
      { ...order, totalPence: -1 },
      { ...order, totalPence: 1.2 },
      { ...order, totalPence: NaN },
      { ...order, totalPence: Infinity },
      { ...order, totalPence: Number.MAX_SAFE_INTEGER + 1 },
    ])
      expect(await acceptOrder(input, { record })).toEqual({ kind: "invalid" });
    expect(record).not.toHaveBeenCalled();
  });
  it("zero pence is valid under the stated order policy", async () => {
    const { ledger } = setup();
    expect((await acceptOrder({ ...order, totalPence: 0 }, ledger)).kind).toBe(
      "recorded",
    );
  });
  it("copies validated input before awaiting storage", async () => {
    const gate = deferred<void>();
    let captured: typeof order | undefined;
    const recorder: OrderRecorder = {
      async record(value) {
        await gate.promise;
        captured = value;
        return { kind: "recorded" };
      },
    };
    const input = { ...order };
    const result = acceptOrder(input, recorder);
    input.totalPence = 1;
    gate.resolve();
    await result;
    expect(captured?.totalPence).toBe(3299);
    expect(Object.isFrozen(captured)).toBe(true);
  });
  it("a recording acknowledgement waits for the recorder result", async () => {
    const gate = deferred<{ kind: "recorded" }>();
    let settled = false;
    const pending = acceptOrder(order, { record: () => gate.promise }).then(
      (result) => {
        settled = true;
        return result;
      },
    );
    await Promise.resolve();
    expect(settled).toBe(false);
    gate.resolve({ kind: "recorded" });
    expect(await pending).toEqual({ kind: "recorded" });
  });
  it("records an order and one pending receipt together", async () => {
    const { ledger } = setup();
    await acceptOrder(order, ledger);
    expect(ledger.snapshot()).toEqual([{ order, acknowledged: false }]);
    expect(await ledger.nextPending()).toEqual({
      orderId: "one",
      recipient: order.customerEmail,
      message: "Order one recorded",
    });
  });
  it("same identity and content replay without another pending receipt", async () => {
    const { ledger } = setup();
    await acceptOrder(order, ledger);
    expect(await acceptOrder({ ...order }, ledger)).toEqual({
      kind: "replayed",
    });
    expect(ledger.snapshot()).toHaveLength(1);
  });
  it("same identity with changed content conflicts and preserves the original", async () => {
    const { ledger } = setup();
    await acceptOrder(order, ledger);
    for (const changes of [
      { totalPence: 1 },
      { customerEmail: "other@example.com" },
    ])
      expect(await acceptOrder({ ...order, ...changes }, ledger)).toEqual({
        kind: "conflict",
      });
    expect(ledger.snapshot()[0].order).toEqual(order);
  });
  it("record failure before commit leaves this adapter empty", async () => {
    const { ledger, previews } = setup();
    const ports = composeOrderLab(ledger, previews, "record-before", "email");
    expect(await acceptOrder(order, ports.recorder)).toEqual({
      kind: "unconfirmed",
    });
    expect(ledger.snapshot()).toEqual([]);
    expect(await ledger.nextPending()).toBeNull();
  });
  it("lost commit acknowledgement remains unconfirmed although data was saved", async () => {
    const { ledger, previews } = setup();
    const ports = composeOrderLab(ledger, previews, "record-after", "email");
    expect(await acceptOrder(order, ports.recorder)).toEqual({
      kind: "unconfirmed",
    });
    expect(ledger.snapshot()).toHaveLength(1);
    expect(await ledger.nextPending()).not.toBeNull();
    expect(await acceptOrder(order, ledger)).toEqual({ kind: "replayed" });
    expect(ledger.snapshot()).toHaveLength(1);
  });
  it("adapter snapshots do not expose stored order or receipt state", async () => {
    const { ledger } = setup();
    await acceptOrder(order, ledger);
    Object.assign(ledger.snapshot()[0].order, { totalPence: 1 });
    const pending = await ledger.nextPending();
    Object.assign(pending ?? {}, { recipient: "changed" });
    expect(ledger.snapshot()[0].order.totalPence).toBe(3299);
    expect((await ledger.nextPending())?.recipient).toBe(order.customerEmail);
  });
  it("an empty queue does not call the supplier or acknowledgement", async () => {
    const acknowledge = vi.fn();
    const send = vi.fn();
    expect(
      await deliverNextReceipt(
        { nextPending: async () => null, acknowledge },
        { send },
      ),
    ).toEqual({ kind: "empty" });
    expect(send).not.toHaveBeenCalled();
    expect(acknowledge).not.toHaveBeenCalled();
  });
  it("a queue read failure does not call the supplier", async () => {
    const send = vi.fn();
    expect(
      await deliverNextReceipt(
        {
          nextPending: async () => {
            throw new Error("Offline");
          },
          acknowledge: vi.fn(),
        },
        { send },
      ),
    ).toEqual({ kind: "queue-unconfirmed" });
    expect(send).not.toHaveBeenCalled();
  });
  it("processing works with test-only ports and no concrete ledger", async () => {
    const acknowledge = vi.fn(async () => undefined);
    const send = vi.fn(async () => "Test preview");
    expect(
      await deliverNextReceipt(
        {
          nextPending: async () => ({
            orderId: "one",
            recipient: "local",
            message: "Ready",
          }),
          acknowledge,
        },
        { send },
      ),
    ).toEqual({
      kind: "acknowledged",
      orderId: "one",
      receipt: "Test preview",
    });
    expect(acknowledge).toHaveBeenCalledExactlyOnceWith("one");
  });
  it("acknowledges only after the supplier resolves", async () => {
    const gate = deferred<string>();
    const acknowledge = vi.fn(async () => undefined);
    const send = vi.fn(() => gate.promise);
    const pending = deliverNextReceipt(
      {
        nextPending: async () => ({
          orderId: "one",
          recipient: "local",
          message: "Ready",
        }),
        acknowledge,
      },
      { send },
    );
    await Promise.resolve();
    expect(send).toHaveBeenCalledOnce();
    expect(acknowledge).not.toHaveBeenCalled();
    gate.resolve("Ready");
    await pending;
    expect(acknowledge).toHaveBeenCalledOnce();
  });
  it("copies aliased queue data before awaiting the supplier", async () => {
    const data: PendingReceipt = {
      orderId: "one",
      recipient: "local",
      message: "Ready",
    };
    const gate = deferred<string>();
    const acknowledge = vi.fn(async () => undefined);
    const result = deliverNextReceipt(
      { nextPending: async () => data, acknowledge },
      { send: () => gate.promise },
    );
    await Promise.resolve();
    Object.assign(data, { orderId: "changed" });
    gate.resolve("Preview");
    await result;
    expect(acknowledge).toHaveBeenCalledExactlyOnceWith("one");
  });
  it("supplier failure leaves the order and pending receipt retained", async () => {
    const { ledger, previews } = setup();
    await acceptOrder(order, ledger);
    const ports = composeOrderLab(ledger, previews, "send-before", "email");
    expect(await deliverNextReceipt(ports.queue, ports.sender)).toEqual({
      kind: "send-unconfirmed",
      orderId: "one",
    });
    expect(ledger.snapshot()[0].acknowledged).toBe(false);
    expect(previews).toEqual([]);
  });
  it("a supplier can perform an effect and then throw; policy cannot prove its absence", async () => {
    const { ledger } = setup();
    await acceptOrder(order, ledger);
    let effects = 0;
    const acknowledge = vi.spyOn(ledger, "acknowledge");
    expect(
      (
        await deliverNextReceipt(ledger, {
          async send() {
            effects++;
            throw new Error("Acknowledgement lost");
          },
        })
      ).kind,
    ).toBe("send-unconfirmed");
    expect(effects).toBe(1);
    expect(acknowledge).not.toHaveBeenCalled();
    expect(await ledger.nextPending()).not.toBeNull();
  });
  it("acknowledgement failure can produce repeated supplier effects on retry", async () => {
    const { ledger, previews, ports } = setup();
    await acceptOrder(order, ledger);
    const fault = composeOrderLab(ledger, previews, "ack-before", "email");
    expect((await deliverNextReceipt(fault.queue, fault.sender)).kind).toBe(
      "ack-unconfirmed",
    );
    expect(previews).toHaveLength(1);
    expect(await ledger.nextPending()).not.toBeNull();
    expect((await deliverNextReceipt(ports.queue, ports.sender)).kind).toBe(
      "acknowledged",
    );
    expect(previews).toHaveLength(2);
    expect(ledger.snapshot()).toHaveLength(1);
  });
  it("changing supplier changes the actual receipt with the same policy", async () => {
    const { ledger, previews } = setup();
    await acceptOrder(order, ledger);
    const print = composeOrderLab(ledger, previews, "none", "print");
    const result = await deliverNextReceipt(print.queue, print.sender);
    expect(result).toMatchObject({
      kind: "acknowledged",
      receipt: expect.stringContaining("Print receipt preview"),
    });
    expect(previews[0].channel).toBe("print");
  });
  it("acknowledged orders stay replayed without another receipt", async () => {
    const { ledger, ports, previews } = setup();
    await acceptOrder(order, ledger);
    await deliverNextReceipt(ports.queue, ports.sender);
    expect(await acceptOrder(order, ledger)).toEqual({ kind: "replayed" });
    expect(await deliverNextReceipt(ports.queue, ports.sender)).toEqual({
      kind: "empty",
    });
    expect(previews).toHaveLength(1);
  });
  it("pending processing follows insertion order", async () => {
    const { ledger, ports } = setup();
    await acceptOrder(order, ledger);
    await acceptOrder({ ...order, id: "two" }, ledger);
    expect(await deliverNextReceipt(ports.queue, ports.sender)).toMatchObject({
      orderId: "one",
    });
    expect((await ledger.nextPending())?.orderId).toBe("two");
  });
  it("acknowledgements are idempotent but cannot create an unknown order", async () => {
    const { ledger } = setup();
    await expect(ledger.acknowledge("missing")).rejects.toThrow("Unknown");
    await acceptOrder(order, ledger);
    await ledger.acknowledge("one");
    await ledger.acknowledge("one");
    expect(await ledger.nextPending()).toBeNull();
  });
  it("concurrent workers can duplicate effects without a claim or supplier deduplication", async () => {
    const { ledger, ports, previews } = setup();
    await acceptOrder(order, ledger);
    const results = await Promise.all([
      deliverNextReceipt(ports.queue, ports.sender),
      deliverNextReceipt(ports.queue, ports.sender),
    ]);
    expect(results.map((result) => result.kind)).toEqual([
      "acknowledged",
      "acknowledged",
    ]);
    expect(previews).toHaveLength(2);
    expect(ledger.snapshot()).toHaveLength(1);
  });
  it("UI shows retained data during supplier failure and supports replay/recovery", async () => {
    const user = userEvent.setup();
    render(<OrderBoundaryLab />);
    await user.selectOptions(
      screen.getByLabelText("Supplier scenario"),
      "record-after",
    );
    await user.click(
      screen.getByRole("button", { name: "Record sample order" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("unconfirmed");
    expect(screen.getByTestId("order-count")).toHaveTextContent("1");
    await user.selectOptions(
      screen.getByLabelText("Supplier scenario"),
      "none",
    );
    await user.click(
      screen.getByRole("button", { name: "Record sample order" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("replayed");
    await user.selectOptions(
      screen.getByLabelText("Supplier scenario"),
      "send-before",
    );
    await user.click(
      screen.getByRole("button", { name: "Process pending receipt" }),
    );
    expect(screen.getByTestId("pending-count")).toHaveTextContent("1");
    await user.selectOptions(
      screen.getByLabelText("Supplier scenario"),
      "none",
    );
    await user.selectOptions(
      screen.getByLabelText("Receipt supplier"),
      "print",
    );
    await user.click(
      screen.getByRole("button", { name: "Process pending receipt" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "Print receipt preview",
    );
    expect(screen.getByTestId("pending-count")).toHaveTextContent("0");
  });
});
