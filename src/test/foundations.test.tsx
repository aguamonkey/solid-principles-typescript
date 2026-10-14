import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { lessons, lessonContent } from "../lessons";
import { NotificationService } from "../principles/2-open-closed/good-example/NotificationService";
import {
  Rectangle,
  Square,
  Circle,
  calculateTotalArea,
} from "../principles/3-liskov-substitution/good-example/Shapes";
import {
  Square as MutableSquare,
  resizeRectangle,
} from "../principles/3-liskov-substitution/bad-example/Shapes";
import { chargeWorkers } from "../principles/4-interface-segregation/good-example/Worker";
import {
  OrderService,
  OrderManager,
  MemoryDatabase,
} from "../principles/5-dependency-inversion/good-example/OrderService";

describe("connected foundations", () => {
  it.each(lessons)(
    "has actual guide, exercise and source for $title",
    (lesson) => {
      const content = lessonContent(lesson);
      expect(content.guide.length).toBeGreaterThan(50);
      expect(content.exercise.length).toBeGreaterThan(50);
      expect(content.before).toContain("export");
      expect(content.after).toContain("export");
    },
  );
  it("extends notification delivery without changing the dispatcher", () => {
    const service = new NotificationService();
    service.registerStrategy({
      getType: () => "test-only",
      send: (recipient, message) => `${recipient}: ${message}`,
    });
    expect(service.send("test-only", "reader", "hello")).toBe("reader: hello");
    expect(() => service.send("unknown", "reader", "hello")).toThrow(
      "No strategy",
    );
  });
  it("rejects duplicate registrations instead of silently changing behaviour", () => {
    const service = new NotificationService();
    const strategy = { getType: () => "one", send: () => "receipt" };
    service.registerStrategy(strategy);
    expect(() => service.registerStrategy(strategy)).toThrow("duplicate");
  });
  it("uses supported shapes uniformly", () =>
    expect(
      calculateTotalArea([new Rectangle(5, 4), new Square(3), new Circle(2)]),
    ).toBeCloseTo(29 + 4 * Math.PI));
  it("demonstrates the mutable square breaking the rectangle promise", () =>
    expect(() => resizeRectangle(new MutableSquare())).toThrow(
      "Expected area 20, but got 16",
    ));
  it("charging accepts a fixture with only the required capability", () =>
    expect(chargeWorkers([{ chargeBattery: () => "Charged" }])).toEqual([
      "Charged",
    ]));
  it("records through injected storage and notification dependencies", () => {
    const database = new MemoryDatabase();
    const notify = vi.fn(() => "Local receipt");
    const service = new OrderService({ notify }, database);
    const order = {
      id: "1",
      customerEmail: "reader@example.com",
      totalPence: 100,
    };
    expect(service.createOrder(order)).toBe("Local receipt");
    expect(service.getOrder("1")).toEqual(order);
    expect(notify).toHaveBeenCalledWith(
      order.customerEmail,
      "Order 1 recorded",
    );
  });
  it("invalid orders never reach dependencies", () => {
    const save = vi.fn();
    const notify = vi.fn();
    const service = new OrderService(
      { notify },
      { save, find: () => undefined },
    );
    expect(() =>
      service.createOrder({
        id: "1",
        customerEmail: "reader@example.com",
        totalPence: -1,
      }),
    ).toThrow("Invalid");
    expect(save).not.toHaveBeenCalled();
    expect(notify).not.toHaveBeenCalled();
  });
  it("the channel selector changes the actual dependency call", async () => {
    const email = vi.fn(() => "Email delivered");
    const sms = vi.fn(() => "SMS delivered");
    const user = userEvent.setup();
    render(
      <OrderManager
        services={{ email: { notify: email }, sms: { notify: sms } }}
      />,
    );
    await user.selectOptions(
      screen.getByLabelText("Notification channel"),
      "sms",
    );
    await user.click(
      screen.getByRole("button", { name: "Record sample order" }),
    );
    expect(sms).toHaveBeenCalledOnce();
    expect(email).not.toHaveBeenCalled();
    expect(screen.getByRole("status")).toHaveTextContent("SMS delivered");
  });
});
