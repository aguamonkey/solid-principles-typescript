export interface StationSummary {
  readonly id: string;
  readonly name: string;
  readonly state: "ready" | "busy";
}
export interface RosterReader {
  readRoster(): readonly StationSummary[];
}
export interface WorkScheduler {
  scheduleWork(stationId: string, job: string): WorkReceipt;
}
export interface WorkReceipt {
  readonly stationId: string;
  readonly job: string;
}
export interface ServiceTicket {
  readonly id: string;
  readonly asset: string;
  readonly state: "due" | "inspected";
}
// Both operations belong to the service desk's inspection workflow.
export interface InspectionDesk {
  readServiceQueue(): readonly ServiceTicket[];
  recordInspection(ticketId: string): ServiceTicket;
}
export type DispatchPort = RosterReader & WorkScheduler;
export type DispatchResult =
  | { readonly kind: "scheduled"; readonly receipt: WorkReceipt }
  | { readonly kind: "idle"; readonly reason: string };
