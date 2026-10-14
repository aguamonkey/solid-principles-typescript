import { useMemo, useState } from "react";
import { inspectScaling, type MeasuredShape } from "./ScalingContract";
import {
  MeasuredRectangle,
  MeasuredCircle,
  UnavailableShape,
  LinearAreaShape,
} from "./MeasuredShapes";
type Mode = "rectangle" | "circle" | "unavailable" | "broken";
const factories: Record<Mode, () => MeasuredShape> = {
  rectangle: () => new MeasuredRectangle(5, 4),
  circle: () => new MeasuredCircle(2),
  unavailable: () => new UnavailableShape(),
  broken: () => new LinearAreaShape(),
};
export function GeometryContractLab() {
  const [mode, setMode] = useState<Mode>("rectangle");
  const [factor, setFactor] = useState(2);
  const report = useMemo(
    () => inspectScaling(factories[mode](), factor),
    [mode, factor],
  );
  const before = "before" in report ? report.before : undefined;
  const after = "after" in report ? report.after : undefined;
  return (
    <section aria-label="Geometry substitution lab">
      <div className="geometry-masthead">
        <span className="eyebrow">GEOMETRY / CALLER’S PROMISE</span>
        <span className="eyebrow">LAB 03B</span>
      </div>
      <h2>
        Same interface.
        <br />
        Different promises.
      </h2>
      <div className="geometry-rules">
        <span>A × k²</span>
        <span>P × k</span>
        <small>Original remains unchanged.</small>
      </div>
      <div className="geometry-controls">
        <div>
          <label htmlFor="geometry-adapter">Implementation</label>
          <select
            id="geometry-adapter"
            value={mode}
            onChange={(event) => {
              const next = event.target.value;
              if (
                next === "rectangle" ||
                next === "circle" ||
                next === "unavailable" ||
                next === "broken"
              )
                setMode(next);
            }}
          >
            <option value="rectangle">Rectangle</option>
            <option value="circle">Circle</option>
            <option value="unavailable">Measurement-only adapter</option>
            <option value="broken">Broken linear-area adapter</option>
          </select>
        </div>
        <div>
          <label htmlFor="geometry-factor">Scale factor</label>
          <select
            id="geometry-factor"
            value={factor}
            onChange={(event) => setFactor(Number(event.target.value))}
          >
            <option value="2">2 × larger</option>
            <option value="0.5">0.5 × smaller</option>
          </select>
        </div>
      </div>
      <div
        className="geometry-result"
        role="status"
        data-testid="geometry-result"
        data-outcome={report.kind}
      >
        <p className="eyebrow">
          {report.kind === "passed"
            ? "CONTRACT HONOURED"
            : report.kind === "unavailable"
              ? "PERMITTED UNAVAILABILITY"
              : "CONTRACT VIOLATION"}
        </p>
        <p>{report.message}</p>
      </div>
      <div className="geometry-measures">
        <section>
          <p className="eyebrow">ORIGINAL / COPIED MEASUREMENT</p>
          <h3>
            {before ? before.areaCm2.toFixed(2) : "—"} <small>cm²</small>
          </h3>
          <p>Perimeter: {before ? before.perimeterCm.toFixed(2) : "—"} cm</p>
        </section>
        <section>
          <p className="eyebrow">RETURNED SCALED RESULT</p>
          <h3>
            {after ? after.areaCm2.toFixed(2) : "—"} <small>cm²</small>
          </h3>
          <p>Perimeter: {after ? after.perimeterCm.toFixed(2) : "—"} cm</p>
        </section>
      </div>
      <p className="scope-note">
        The same inspector calls every implementation. Each demonstration uses a
        fresh instance. An allowed unavailable result is different from a
        successful result that breaks its promises.
      </p>
    </section>
  );
}
