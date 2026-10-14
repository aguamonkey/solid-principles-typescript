// Policy-owned contracts: adapters import these; policy never imports adapters.
export interface OrderRequest {
  readonly id: string;
  readonly customerEmail: string;
  readonly totalPence: number;
}
export interface PendingReceipt {
  readonly orderId: string;
  readonly recipient: string;
  readonly message: string;
}
export type RecordResult =
  { readonly kind: "recorded" | "replayed" } | { readonly kind: "conflict" };
export interface OrderRecorder {
  // Commit an order and one pending receipt together, or neither. Same identity/content replays.
  record(order: OrderRequest): Promise<RecordResult>;
}
export interface ReceiptQueue {
  nextPending(): Promise<PendingReceipt | null>;
  acknowledge(orderId: string): Promise<void>;
}
export interface ReceiptSender {
  send(receipt: PendingReceipt): Promise<string>;
}
export type Acceptance =
  | RecordResult
  | { readonly kind: "invalid" }
  | { readonly kind: "unconfirmed" };
export type Delivery =
  | { readonly kind: "empty" }
  | { readonly kind: "queue-unconfirmed" }
  | { readonly kind: "send-unconfirmed"; readonly orderId: string }
  | {
      readonly kind: "ack-unconfirmed";
      readonly orderId: string;
      readonly receipt: string;
    }
  | {
      readonly kind: "acknowledged";
      readonly orderId: string;
      readonly receipt: string;
    };
