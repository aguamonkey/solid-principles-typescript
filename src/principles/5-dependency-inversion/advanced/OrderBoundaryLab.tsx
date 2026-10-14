import { useEffect, useRef, useState } from "react";
import {
  MemoryOrderLedger,
  composeOrderLab,
  type Fault,
  type Channel,
  type PreviewEntry,
} from "./OrderAdapters";
import { acceptOrder, deliverNextReceipt } from "./OrderPolicy";
import type { Acceptance, Delivery } from "./OrderPorts";
const sample = {
  id: "order-041",
  customerEmail: "learner@example.com",
  totalPence: 3299,
};
function acceptanceText(result: Acceptance): string {
  switch (result.kind) {
    case "recorded":
      return "Order and pending receipt recorded together.";
    case "replayed":
      return "Same order replayed; no second order or pending receipt created.";
    case "conflict":
      return "Identity conflict: existing order was retained.";
    case "invalid":
      return "Invalid order; recorder was not called.";
    case "unconfirmed":
      return "Recording is unconfirmed. A failed acknowledgement does not prove that nothing was saved.";
  }
}
function deliveryText(result: Delivery): string {
  switch (result.kind) {
    case "empty":
      return "No pending receipts; supplier was not called.";
    case "queue-unconfirmed":
      return "Pending queue could not be read.";
    case "send-unconfirmed":
      return "Preview is unconfirmed; no queue acknowledgement was attempted.";
    case "ack-unconfirmed":
      return "Preview returned, but queue acknowledgement is unconfirmed. A retry can produce another preview.";
    case "acknowledged":
      return `${result.receipt}. Queue acknowledgement recorded.`;
  }
}
export function OrderBoundaryLab() {
  const [ledger] = useState(() => new MemoryOrderLedger());
  const [previews] = useState<PreviewEntry[]>(() => []);
  const [fault, setFault] = useState<Fault>("none");
  const [channel, setChannel] = useState<Channel>("email");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState(
    "Record the sample order, then process its pending receipt.",
  );
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const entries = ledger.snapshot();
  const acknowledged = entries.filter((entry) => entry.acknowledged).length;
  async function run(action: "accept" | "deliver") {
    setBusy(true);
    const ports = composeOrderLab(ledger, previews, fault, channel);
    const text =
      action === "accept"
        ? acceptanceText(await acceptOrder(sample, ports.recorder))
        : deliveryText(await deliverNextReceipt(ports.queue, ports.sender));
    if (alive.current) {
      setStatus(text);
      setBusy(false);
    }
  }
  return (
    <section aria-label="Order dependency boundary lab" aria-busy={busy}>
      <div className="order-masthead">
        <span className="eyebrow">ORDER COUNTER / POLICY & SUPPLIERS</span>
        <span className="eyebrow">LAB 05B</span>
      </div>
      <h2>Recorded is a promise.</h2>
      <p>
        Keep order acceptance separate from receipt processing. Replace
        suppliers at composition; keep the same policy.
      </p>
      <div className="order-slip">
        <span className="eyebrow">ORDER 041 / GBP</span>
        <strong>£32.99</strong>
        <span>learner@example.com</span>
      </div>
      <div className="order-controls">
        <div>
          <label htmlFor="order-supplier">Receipt supplier</label>
          <select
            id="order-supplier"
            disabled={busy}
            value={channel}
            onChange={(event) =>
              setChannel(event.target.value === "print" ? "print" : "email")
            }
          >
            <option value="email">Email preview</option>
            <option value="print">Print preview</option>
          </select>
        </div>
        <div>
          <label htmlFor="order-fault">Supplier scenario</label>
          <select
            id="order-fault"
            disabled={busy}
            value={fault}
            onChange={(event) => {
              const value = event.target.value;
              if (
                value === "none" ||
                value === "record-before" ||
                value === "record-after" ||
                value === "send-before" ||
                value === "ack-before"
              )
                setFault(value);
            }}
          >
            <option value="none">All suppliers available</option>
            <option value="record-before">Storage fails before commit</option>
            <option value="record-after">Commit acknowledgement lost</option>
            <option value="send-before">Preview supplier unavailable</option>
            <option value="ack-before">Queue acknowledgement fails</option>
          </select>
        </div>
      </div>
      <div className="order-stages">
        <div>
          <span className="eyebrow">RECORDED ORDERS</span>
          <strong data-testid="order-count">{entries.length}</strong>
        </div>
        <div>
          <span className="eyebrow">PENDING RECEIPTS</span>
          <strong data-testid="pending-count">
            {entries.length - acknowledged}
          </strong>
        </div>
        <div>
          <span className="eyebrow">LOCAL PREVIEWS</span>
          <strong data-testid="preview-count">{previews.length}</strong>
        </div>
      </div>
      <div className="order-actions">
        <button
          type="button"
          disabled={busy}
          onClick={() => void run("accept")}
        >
          Record sample order
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void run("deliver")}
        >
          Process pending receipt
        </button>
      </div>
      <p role="status" className="order-receipt">
        {status}
      </p>
      <p className="scope-note">
        Same identity and content can be replayed without another order. Receipt
        processing can repeat a supplier effect if acknowledgement fails. All
        storage and previews are local memory; nothing is paid or sent.
      </p>
    </section>
  );
}
