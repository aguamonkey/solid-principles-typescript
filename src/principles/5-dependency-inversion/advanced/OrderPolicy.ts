import type {
  OrderRequest,
  OrderRecorder,
  ReceiptQueue,
  ReceiptSender,
  Acceptance,
  Delivery,
} from "./OrderPorts";
function decodeOrder(input: unknown): OrderRequest | null {
  if (typeof input !== "object" || input === null || Array.isArray(input))
    return null;
  const value = input as Record<string, unknown>;
  if (
    typeof value.id !== "string" ||
    !value.id.trim() ||
    typeof value.customerEmail !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.customerEmail) ||
    typeof value.totalPence !== "number" ||
    !Number.isSafeInteger(value.totalPence) ||
    value.totalPence < 0
  )
    return null;
  return Object.freeze({
    id: value.id,
    customerEmail: value.customerEmail,
    totalPence: value.totalPence,
  });
}
export async function acceptOrder(
  input: unknown,
  recorder: OrderRecorder,
): Promise<Acceptance> {
  const order = decodeOrder(input);
  if (!order) return { kind: "invalid" };
  try {
    return await recorder.record(order);
  } catch {
    return { kind: "unconfirmed" };
  } // A thrown acknowledgement cannot prove whether a commit occurred.
}
export async function deliverNextReceipt(
  queue: ReceiptQueue,
  sender: ReceiptSender,
): Promise<Delivery> {
  let pending;
  try {
    pending = await queue.nextPending();
  } catch {
    return { kind: "queue-unconfirmed" };
  }
  if (!pending) return { kind: "empty" };
  // Capture values before crossing an asynchronous supplier boundary.
  const snapshot = Object.freeze({ ...pending });
  let receipt;
  try {
    receipt = await sender.send(snapshot);
  } catch {
    return { kind: "send-unconfirmed", orderId: snapshot.orderId };
  }
  try {
    await queue.acknowledge(snapshot.orderId);
  } catch {
    return { kind: "ack-unconfirmed", orderId: snapshot.orderId, receipt };
  }
  return { kind: "acknowledged", orderId: snapshot.orderId, receipt };
}
