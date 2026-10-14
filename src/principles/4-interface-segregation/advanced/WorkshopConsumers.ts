import type {
  RosterReader,
  DispatchPort,
  DispatchResult,
  InspectionDesk,
  ServiceTicket,
} from "./WorkshopPorts";
export function showRoster(reader: RosterReader) {
  return reader.readRoster().map((station) => ({ ...station }));
}
export function dispatchFrameRun(port: DispatchPort): DispatchResult {
  const station = port.readRoster().find((item) => item.state === "ready");
  if (!station)
    return { kind: "idle", reason: "No ready station; no work scheduled." };
  return {
    kind: "scheduled",
    receipt: port.scheduleWork(station.id, "Frame run"),
  };
}
export function inspectNextTicket(desk: InspectionDesk): ServiceTicket | null {
  const ticket = desk.readServiceQueue().find((item) => item.state === "due");
  return ticket ? desk.recordInspection(ticket.id) : null;
}
