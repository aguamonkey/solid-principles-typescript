import type {
  OrderRequest,
  PendingReceipt,
  RecordResult,
  OrderRecorder,
  ReceiptQueue,
  ReceiptSender,
} from "./OrderPorts";
interface LedgerEntry {
  readonly order: OrderRequest;
  readonly pending: PendingReceipt;
  readonly acknowledged: boolean;
}
export class MemoryOrderLedger implements OrderRecorder, ReceiptQueue {
  private readonly entries = new Map<string, LedgerEntry>();
  async record(order: OrderRequest): Promise<RecordResult> {
    const existing = this.entries.get(order.id);
    if (existing)
      return {
        kind:
          existing.order.customerEmail === order.customerEmail &&
          existing.order.totalPence === order.totalPence
            ? "replayed"
            : "conflict",
      };
    const snapshot = Object.freeze({ ...order });
    const pending = Object.freeze({
      orderId: snapshot.id,
      recipient: snapshot.customerEmail,
      message: `Order ${snapshot.id} recorded`,
    });
    // A single synchronous map assignment installs both records before this Promise resolves.
    this.entries.set(snapshot.id, {
      order: snapshot,
      pending,
      acknowledged: false,
    });
    return { kind: "recorded" };
  }
  async nextPending(): Promise<PendingReceipt | null> {
    const entry = [...this.entries.values()].find((item) => !item.acknowledged);
    return entry ? { ...entry.pending } : null;
  }
  async acknowledge(orderId: string): Promise<void> {
    const entry = this.entries.get(orderId);
    if (!entry) throw new Error("Unknown order.");
    this.entries.set(orderId, { ...entry, acknowledged: true });
  }
  // Demo diagnostics belong to the concrete adapter, not policy ports.
  snapshot() {
    return [...this.entries.values()].map((entry) => ({
      order: { ...entry.order },
      acknowledged: entry.acknowledged,
    }));
  }
}
export type Fault =
  "none" | "record-before" | "record-after" | "send-before" | "ack-before";
export type Channel = "email" | "print";
export interface PreviewEntry {
  readonly orderId: string;
  readonly channel: Channel;
  readonly text: string;
}
export function composeOrderLab(
  ledger: MemoryOrderLedger,
  previews: PreviewEntry[],
  fault: Fault,
  channel: Channel,
): { recorder: OrderRecorder; queue: ReceiptQueue; sender: ReceiptSender } {
  return {
    recorder: {
      async record(order) {
        if (fault === "record-before")
          throw new Error("Storage unavailable before commit.");
        const result = await ledger.record(order);
        if (fault === "record-after")
          throw new Error("Commit acknowledgement lost.");
        return result;
      },
    },
    queue: {
      nextPending: () => ledger.nextPending(),
      async acknowledge(id) {
        if (fault === "ack-before")
          throw new Error("Queue acknowledgement unavailable.");
        await ledger.acknowledge(id);
      },
    },
    sender: {
      async send(pending) {
        if (fault === "send-before")
          throw new Error("Preview supplier unavailable.");
        const text = `${channel === "email" ? "Email" : "Print"} receipt preview for ${pending.recipient}: ${pending.message}`;
        previews.push({ orderId: pending.orderId, channel, text });
        return text;
      },
    },
  };
}
