import { useState } from "react";
import {
  SnapshotRoster,
  LocalWorkshop,
  LocalInspectionDesk,
} from "./WorkshopAdapters";
import {
  showRoster,
  dispatchFrameRun,
  inspectNextTicket,
} from "./WorkshopConsumers";
type Consumer = "board" | "dispatch" | "service";
export function WorkshopCapabilityLab() {
  const [consumer, setConsumer] = useState<Consumer>("board");
  const [providers] = useState(() => ({
    snapshot: new SnapshotRoster(),
    workshop: new LocalWorkshop(),
    service: new LocalInspectionDesk(),
  }));
  const [narrow, setNarrow] = useState(true);
  const [receipt, setReceipt] = useState(
    "Choose a consumer, then run its workflow.",
  );
  const reader = narrow ? providers.snapshot : providers.workshop;
  const roster = consumer === "board" ? showRoster(reader) : [];
  function run() {
    if (consumer === "board")
      setReceipt(
        `Roster read: ${showRoster(reader)
          .map((station) => `${station.name} ${station.state}`)
          .join(" · ")}. No work scheduled.`,
      );
    else if (consumer === "dispatch") {
      const result = dispatchFrameRun(providers.workshop);
      setReceipt(
        result.kind === "scheduled"
          ? `${result.receipt.job} scheduled at ${result.receipt.stationId}.`
          : result.reason,
      );
    } else {
      const result = inspectNextTicket(
        narrow ? providers.service : providers.workshop,
      );
      setReceipt(
        result
          ? `Inspection recorded: ${result.asset}.`
          : "No due inspections; no record written.",
      );
    }
  }
  function choose(value: string) {
    if (value !== "board" && value !== "dispatch" && value !== "service")
      return;
    setConsumer(value);
    setReceipt("Choose a consumer, then run its workflow.");
  }
  return (
    <section aria-label="Workshop capability lab">
      <div className="workshop-masthead">
        <span className="eyebrow">WORKSHOP / CONSUMER REQUIREMENTS</span>
        <span className="eyebrow">LAB 04B</span>
      </div>
      <h2>A desk for every job.</h2>
      <p>
        One workshop can supply several capabilities. Each desk asks for the
        operations its workflow uses.
      </p>
      <div className="workshop-controls">
        <div>
          <label htmlFor="workshop-consumer">Consumer</label>
          <select
            id="workshop-consumer"
            value={consumer}
            onChange={(event) => choose(event.target.value)}
          >
            <option value="board">Status board</option>
            <option value="dispatch">Shift dispatch</option>
            <option value="service">Inspection desk</option>
          </select>
        </div>
        <button
          type="button"
          aria-pressed={narrow}
          onClick={() => {
            setNarrow(!narrow);
            setReceipt(
              "Provider selection changed. State stays with each local provider.",
            );
          }}
        >
          Use narrow providers
        </button>
      </div>
      <div
        className="workshop-matrix"
        role="region"
        aria-label="Consumer capability map"
        tabIndex={0}
      >
        <table>
          <caption>Operations requested by each consumer</caption>
          <thead>
            <tr>
              <th scope="col">Consumer</th>
              <th scope="col">Roster</th>
              <th scope="col">Schedule</th>
              <th scope="col">Inspection</th>
            </tr>
          </thead>
          <tbody>
            <tr data-selected={consumer === "board"}>
              <th scope="row">Status board</th>
              <td>Read</td>
              <td>—</td>
              <td>—</td>
            </tr>
            <tr data-selected={consumer === "dispatch"}>
              <th scope="row">Shift dispatch</th>
              <td>Read</td>
              <td>Write</td>
              <td>—</td>
            </tr>
            <tr data-selected={consumer === "service"}>
              <th scope="row">Inspection desk</th>
              <td>—</td>
              <td>—</td>
              <td>Read + record</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="workshop-port" data-testid="workshop-port">
        <p className="eyebrow">REQUIRED PORT</p>
        <h3>
          {consumer === "board"
            ? "RosterReader"
            : consumer === "dispatch"
              ? "RosterReader & WorkScheduler"
              : "InspectionDesk"}
        </h3>
        <p>
          {consumer === "board"
            ? narrow
              ? "Snapshot provider exposes roster reading only."
              : "Shared workshop supplies the roster reader."
            : consumer === "dispatch"
              ? "Dispatch needs both reading and scheduling. The snapshot provider cannot fulfil this port."
              : narrow
                ? "Dedicated service provider owns both inspection operations."
                : "Shared workshop supplies the inspection workflow."}
        </p>
      </div>
      {consumer === "board" && (
        <ul className="workshop-roster">
          {roster.map((station) => (
            <li key={station.id}>
              <span>{station.name}</span>
              <span className="eyebrow">{station.state}</span>
            </li>
          ))}
        </ul>
      )}
      <button type="button" onClick={run}>
        {consumer === "board"
          ? "Read status board"
          : consumer === "dispatch"
            ? "Schedule frame run"
            : "Record next inspection"}
      </button>
      <p role="status" className="workshop-receipt">
        {receipt}
      </p>
      <p className="scope-note">
        Narrow providers offer only a subset of operations. Dispatch always uses
        the shared workshop. This is a TypeScript dependency boundary, not an
        authorisation system. State lives in this mounted local demo.
      </p>
    </section>
  );
}
