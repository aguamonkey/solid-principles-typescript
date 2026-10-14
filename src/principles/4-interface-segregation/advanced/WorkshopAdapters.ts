import type {
  StationSummary,
  RosterReader,
  WorkScheduler,
  WorkReceipt,
  InspectionDesk,
  ServiceTicket,
} from "./WorkshopPorts";
const sampleRoster = (): StationSummary[] => [
  { id: "press-07", name: "Press 07", state: "ready" },
  { id: "lathe-02", name: "Lathe 02", state: "busy" },
];
const sampleQueue = (): ServiceTicket[] => [
  { id: "ticket-14", asset: "Press 07 safety check", state: "due" },
];
// A deliberately narrow provider: no scheduling or service operations exist.
export class SnapshotRoster implements RosterReader {
  readRoster(): readonly StationSummary[] {
    return sampleRoster();
  }
}
// This provider owns only the cohesive inspection workflow.
export class LocalInspectionDesk implements InspectionDesk {
  private tickets = sampleQueue();
  readServiceQueue(): readonly ServiceTicket[] {
    return this.tickets.map((ticket) => ({ ...ticket }));
  }
  recordInspection(ticketId: string): ServiceTicket {
    const index = this.tickets.findIndex((ticket) => ticket.id === ticketId);
    if (index < 0) throw new Error("Unknown inspection ticket.");
    if (this.tickets[index].state !== "due")
      throw new Error("Ticket already inspected.");
    const ticket: ServiceTicket = {
      ...this.tickets[index],
      state: "inspected",
    };
    this.tickets[index] = ticket;
    return { ...ticket };
  }
}
// One concrete provider can implement several ports without widening its consumers.
export class LocalWorkshop
  implements RosterReader, WorkScheduler, InspectionDesk
{
  private stations = sampleRoster();
  private readonly service = new LocalInspectionDesk();
  readRoster(): readonly StationSummary[] {
    return this.stations.map((station) => ({ ...station }));
  }
  scheduleWork(stationId: string, job: string): WorkReceipt {
    if (!job.trim()) throw new Error("A job is required.");
    const index = this.stations.findIndex(
      (station) => station.id === stationId,
    );
    if (index < 0) throw new Error("Unknown station.");
    if (this.stations[index].state !== "ready")
      throw new Error("Station is busy.");
    this.stations[index] = { ...this.stations[index], state: "busy" };
    return { stationId, job };
  }
  readServiceQueue(): readonly ServiceTicket[] {
    return this.service.readServiceQueue();
  }
  recordInspection(ticketId: string): ServiceTicket {
    return this.service.recordInspection(ticketId);
  }
}
