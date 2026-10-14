import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DispatchRegistry, type ChannelExtension } from "./DispatchRegistry";
import { previewBatch } from "./DispatchBatch";
import {
  composeDispatch,
  emailV1,
  webhookV1,
  sampleBatch,
} from "./DispatchComposition";
import { DispatchLab } from "./DispatchLab";
const message = (changes: Record<string, unknown> = {}) => ({
  id: "one",
  channel: "email",
  version: 1,
  payload: { to: "reader@example.com", subject: "Ready" },
  ...changes,
});
const run = (input: unknown) => previewBatch(input, composeDispatch(false));

describe("dispatch extension and compatibility contract", () => {
  it("keeps valid, unsupported and damaged records distinct in input order", () => {
    const rows = run(sampleBatch);
    expect(rows.map((row) => row.index)).toEqual([0, 1, 2, 3]);
    expect(rows.map((row) => row.outcome.kind)).toEqual([
      "ready",
      "unsupported",
      "unsupported",
      "rejected",
    ]);
    expect(rows[3].outcome).toEqual({
      kind: "rejected",
      reason: "Invalid payload",
    });
  });
  it("a new registration changes only its own supported record", () => {
    const before = run(sampleBatch);
    const after = previewBatch(sampleBatch, composeDispatch(true));
    for (const index of [0, 2, 3]) expect(after[index]).toEqual(before[index]);
    expect(after[1].outcome.kind).toBe("ready");
  });
  it("a test-only channel uses the same unchanged dispatch algorithm", () => {
    const extension: ChannelExtension = {
      schema: { channel: "test-only", version: 1 },
      decode: () => ({ label: "Test", recipient: "Local", body: "Receipt" }),
    };
    const rows = previewBatch(
      [message({ channel: "test-only" })],
      new DispatchRegistry([extension]),
    );
    expect(rows[0].outcome.kind).toBe("ready");
  });
  it("duplicate registrations fail instead of overwriting a decoder", () => {
    expect(() => new DispatchRegistry([emailV1, emailV1])).toThrow("Duplicate");
  });
  it("invalid registration keys fail at composition", () => {
    for (const schema of [
      { channel: " ", version: 1 },
      { channel: "email", version: 0 },
      { channel: "email", version: 1.5 },
      { channel: "email", version: NaN },
    ])
      expect(() => new DispatchRegistry([{ ...emailV1, schema }])).toThrow(
        "Invalid",
      );
  });
  it("registration input mutation cannot change the captured lookup", () => {
    const extensions = [emailV1];
    const registry = new DispatchRegistry(extensions);
    extensions.push(webhookV1);
    expect(registry.decoder(webhookV1.schema)).toBeUndefined();
    expect(registry.decoder(emailV1.schema)).toBe(emailV1.decode);
  });
  it("distinct versions coexist without replacement", () => {
    const v2: ChannelExtension = {
      schema: { channel: "email", version: 2 },
      decode: () => ({ label: "V2", recipient: "Local", body: "Ready" }),
    };
    const rows = previewBatch(
      [message({ version: 2 })],
      new DispatchRegistry([emailV1, v2]),
    );
    expect(rows[0].outcome.kind).toBe("ready");
  });
  it("unknown channels report unsupported even with a malformed payload", () => {
    expect(
      run([message({ channel: "future", payload: null })])[0].outcome.kind,
    ).toBe("unsupported");
  });
  it("future versions never fall back to a supported version", () => {
    expect(run([message({ version: 2 })])[0].outcome).toEqual({
      kind: "unsupported",
      id: "one",
      schema: { channel: "email", version: 2 },
    });
  });
  it("lookup is exact and case-sensitive", () => {
    for (const channel of ["Email", " email", "email "])
      expect(run([message({ channel })])[0].outcome.kind).toBe("unsupported");
  });
  it("invalid envelopes are isolated before decoder selection", () => {
    for (const input of [
      null,
      3,
      {},
      message({ id: " " }),
      message({ channel: "" }),
      message({ version: "1" }),
      message({ version: -1 }),
      message({ version: 1.5 }),
    ])
      expect(run([input])[0].outcome).toEqual({
        kind: "rejected",
        reason: "Invalid envelope",
      });
  });
  it("duplicate identity is rejected even after an unsupported record", () => {
    expect(run([message({ channel: "future" }), message()])[1].outcome).toEqual(
      { kind: "rejected", reason: "Duplicate message ID" },
    );
  });
  it("a malformed payload still claims its valid envelope identity", () => {
    expect(run([message({ payload: null }), message()])[1].outcome).toEqual({
      kind: "rejected",
      reason: "Duplicate message ID",
    });
  });
  it("a damaged record does not prevent later valid previews", () => {
    const rows = run([message({ payload: null }), message({ id: "two" })]);
    expect(rows[0].outcome.kind).toBe("rejected");
    expect(rows[1].outcome.kind).toBe("ready");
  });
  it("adapter output must have useful strings", () => {
    for (const value of [
      { label: "", recipient: "Local", body: "Body" },
      { label: "Label", recipient: " ", body: "Body" },
      { label: "Label", recipient: "Local", body: "" },
    ]) {
      const registry = new DispatchRegistry([
        { ...emailV1, decode: () => value },
      ]);
      expect(previewBatch([message()], registry)[0].outcome).toEqual({
        kind: "rejected",
        reason: "Invalid adapter output",
      });
    }
  });
  it("copies and freezes accepted projections instead of keeping adapter-owned objects", () => {
    const value = { label: "Label", recipient: "Local", body: "Original" };
    const registry = new DispatchRegistry([
      { ...emailV1, decode: () => value },
    ]);
    const outcome = previewBatch([message()], registry)[0].outcome;
    value.body = "Changed";
    if (outcome.kind !== "ready") throw new Error("Expected preview");
    expect(outcome.preview.body).toBe("Original");
    expect(Object.isFrozen(outcome.preview)).toBe(true);
    expect(Object.isFrozen(outcome.schema)).toBe(true);
  });
  it("valid empty documents succeed but non-arrays fail as documents", () => {
    expect(run([])).toEqual([]);
    for (const input of [{}, null, "[]"])
      expect(() => run(input)).toThrow("Expected a message array");
  });
  it("email adapter validates its own required payload fields", () => {
    for (const payload of [
      null,
      {},
      { to: "bad", subject: "Title" },
      { to: "reader@example.com", subject: " " },
    ])
      expect(run([message({ payload })])[0].outcome.kind).toBe("rejected");
  });
  it("webhook adapter permits only the documented HTTPS preview payload", () => {
    expect(
      webhookV1.decode({ endpoint: "https://example.com/hooks", text: "Ready" })
        .recipient,
    ).toBe("example.com");
    for (const endpoint of [
      "http://example.com",
      "not a url",
      "https://user:password@example.com",
    ])
      expect(() => webhookV1.decode({ endpoint, text: "Ready" })).toThrow();
    expect(() =>
      webhookV1.decode({ endpoint: "https://example.com", text: "" }),
    ).toThrow();
  });
  it("the UI toggles support without hiding future versions or damaged records", async () => {
    const user = userEvent.setup();
    render(<DispatchLab />);
    expect(screen.getByTestId("dispatch-row-1")).toHaveTextContent(
      "UNSUPPORTED",
    );
    await user.click(
      screen.getByRole("button", { name: "Include webhook extension" }),
    );
    expect(screen.getByTestId("dispatch-row-1")).toHaveTextContent(
      "Webhook preview",
    );
    expect(screen.getByTestId("dispatch-row-2")).toHaveTextContent(
      "UNSUPPORTED",
    );
    expect(screen.getByTestId("dispatch-row-3")).toHaveTextContent(
      "Invalid payload",
    );
    await user.click(
      screen.getByRole("button", { name: "Include webhook extension" }),
    );
    expect(screen.getByTestId("dispatch-row-1")).toHaveTextContent(
      "UNSUPPORTED",
    );
  });
});
