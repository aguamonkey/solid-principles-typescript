import { useMemo, useState } from "react";
import { composeDispatch, sampleBatch } from "./DispatchComposition";
import { previewBatch } from "./DispatchBatch";
export function DispatchLab() {
  const [includeWebhook, setIncludeWebhook] = useState(false);
  const rows = useMemo(
    () => previewBatch(sampleBatch, composeDispatch(includeWebhook)),
    [includeWebhook],
  );
  const ready = rows.filter((row) => row.outcome.kind === "ready").length;
  return (
    <section className="dispatch-lab" aria-label="Dispatch compatibility lab">
      <div className="dispatch-masthead">
        <p className="eyebrow">INCOMING / LOCAL PREVIEW</p>
        <span className="eyebrow">LAB 02B</span>
      </div>
      <h2>
        New channel.
        <br />
        Same dispatch.
      </h2>
      <p>Four envelopes. Each keeps its own outcome.</p>
      <div className="dispatch-summary" aria-live="polite">
        <strong>{ready}</strong>
        <span>of {rows.length} previews ready</span>
      </div>
      <button
        onClick={() => setIncludeWebhook((value) => !value)}
        aria-pressed={includeWebhook}
      >
        Include webhook extension
      </button>
      <p className="eyebrow">
        {includeWebhook ? "EMAIL V1 + WEBHOOK V1" : "EMAIL V1 ONLY"}
      </p>
      <ol className="dispatch-register">
        {rows.map((row) => (
          <li key={row.index} data-testid={`dispatch-row-${row.index}`}>
            <span className="folio">0{row.index + 1}</span>
            <div>
              <p className={`eyebrow outcome-${row.outcome.kind}`}>
                {row.outcome.kind === "ready"
                  ? "READY TO PREVIEW"
                  : row.outcome.kind.toUpperCase()}
              </p>
              {row.outcome.kind === "rejected" ? (
                <h3>{row.outcome.reason}</h3>
              ) : (
                <>
                  <h3>
                    {row.outcome.kind === "ready"
                      ? row.outcome.preview.label
                      : "No compatible adapter"}
                  </h3>
                  <p className="dispatch-schema">
                    {row.outcome.schema.channel} / version{" "}
                    {row.outcome.schema.version} / {row.outcome.id}
                  </p>
                  {row.outcome.kind === "ready" && (
                    <>
                      <p>{row.outcome.preview.recipient}</p>
                      <p>{row.outcome.preview.body}</p>
                    </>
                  )}
                </>
              )}
            </div>
          </li>
        ))}
      </ol>
      <p className="scope-note">
        This composes a new registry and reinterprets bundled data. No emails or
        webhook requests are sent. Unsupported payloads are not decoded.
      </p>
    </section>
  );
}
