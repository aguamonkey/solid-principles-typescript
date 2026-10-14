import { useMemo, useState } from "react";

export interface Order {
  readonly id: string;
  readonly customerEmail: string;
  readonly totalPence: number;
}
export interface NotificationService {
  notify(recipient: string, message: string): string;
}
export interface Database {
  save(order: Order): void;
  find(id: string): Order | undefined;
}
export class EmailNotificationService implements NotificationService {
  notify(recipient: string, message: string): string {
    return `Email receipt for ${recipient}: ${message}`;
  }
}
export class SMSNotificationService implements NotificationService {
  notify(recipient: string, message: string): string {
    return `SMS receipt for ${recipient}: ${message}`;
  }
}
export class MemoryDatabase implements Database {
  private orders = new Map<string, Order>();
  save(order: Order): void {
    this.orders.set(order.id, { ...order });
  }
  find(id: string): Order | undefined {
    const order = this.orders.get(id);
    return order && { ...order };
  }
}
export class OrderService {
  constructor(
    private readonly notifications: NotificationService,
    private readonly database: Database,
  ) {}
  createOrder(order: Order): string {
    if (
      !order.id.trim() ||
      !order.customerEmail.trim() ||
      !Number.isSafeInteger(order.totalPence) ||
      order.totalPence < 0
    ) {
      throw new Error("Invalid order.");
    }
    this.database.save(order);
    return this.notifications.notify(
      order.customerEmail,
      `Order ${order.id} recorded`,
    );
  }
  getOrder(id: string): Order | undefined {
    return this.database.find(id);
  }
}
const sampleNotifications = {
  email: new EmailNotificationService(),
  sms: new SMSNotificationService(),
};
export function OrderManager({
  services = sampleNotifications,
  database,
}: {
  services?: Readonly<Record<"email" | "sms", NotificationService>>;
  database?: Database;
}) {
  const [sessionDatabase] = useState(() => new MemoryDatabase());
  const [channel, setChannel] = useState<"email" | "sms">("email");
  const [status, setStatus] = useState("");
  const service = useMemo(
    () => new OrderService(services[channel], database ?? sessionDatabase),
    [services, channel, database, sessionDatabase],
  );
  return (
    <section>
      <label>
        Notification channel
        <select
          value={channel}
          onChange={(event) =>
            setChannel(event.target.value === "sms" ? "sms" : "email")
          }
        >
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
      </label>
      <button
        onClick={() => {
          try {
            setStatus(
              service.createOrder({
                id: crypto.randomUUID(),
                customerEmail: "member@example.com",
                totalPence: 9999,
              }),
            );
          } catch {
            setStatus("The order could not be completed.");
          }
        }}
      >
        Record sample order
      </button>
      {status && (
        <p role="status" className="notice">
          {status}
        </p>
      )}
      <p className="scope-note">
        In-memory orders and local notification receipts. No database, payment
        or message service is contacted.
      </p>
    </section>
  );
}
