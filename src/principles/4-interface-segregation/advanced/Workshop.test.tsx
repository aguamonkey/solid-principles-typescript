import { describe, it, expect, vi, expectTypeOf } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  showRoster,
  dispatchFrameRun,
  inspectNextTicket,
} from "./WorkshopConsumers";
import {
  SnapshotRoster,
  LocalWorkshop,
  LocalInspectionDesk,
} from "./WorkshopAdapters";
import type {
  RosterReader,
  DispatchPort,
  InspectionDesk,
} from "./WorkshopPorts";
import { WorkshopCapabilityLab } from "./WorkshopCapabilityLab";
describe("consumer-owned workshop ports", () => {
  it("a read-only fixture can supply the board without unrelated methods", () => {
    const reader: RosterReader = {
      readRoster: () => [{ id: "test", name: "Test bench", state: "ready" }],
    };
    expect(showRoster(reader)).toEqual([
      { id: "test", name: "Test bench", state: "ready" },
    ]);
    expect(Object.keys(reader)).toEqual(["readRoster"]);
  });
  it("a snapshot provider is compatible with readers but not dispatch", () => {
    expectTypeOf<SnapshotRoster>().toMatchTypeOf<RosterReader>();
    expectTypeOf<SnapshotRoster>().not.toMatchTypeOf<DispatchPort>();
    expectTypeOf<SnapshotRoster>().not.toMatchTypeOf<InspectionDesk>();
  });
  it("the service-only provider has the cohesive service port", () => {
    expectTypeOf<LocalInspectionDesk>().toMatchTypeOf<InspectionDesk>();
    expectTypeOf<LocalInspectionDesk>().not.toMatchTypeOf<RosterReader>();
    expectTypeOf<LocalInspectionDesk>().not.toMatchTypeOf<DispatchPort>();
  });
  it("board reads do not schedule work or record inspections", () => {
    const workshop = new LocalWorkshop();
    const schedule = vi.spyOn(workshop, "scheduleWork");
    const inspect = vi.spyOn(workshop, "recordInspection");
    showRoster(workshop);
    expect(schedule).not.toHaveBeenCalled();
    expect(inspect).not.toHaveBeenCalled();
  });
  it("the board copies provider-owned records", () => {
    const data = [{ id: "test", name: "Original", state: "ready" as const }];
    const output = showRoster({ readRoster: () => data });
    data[0].name = "Changed";
    expect(output[0].name).toBe("Original");
  });
  it("dispatch can use a fixture with only reading and scheduling", () => {
    const scheduleWork = vi.fn((stationId: string, job: string) => ({
      stationId,
      job,
    }));
    const port: DispatchPort = {
      readRoster: () => [
        { id: "busy", name: "Busy", state: "busy" },
        { id: "ready", name: "Ready", state: "ready" },
      ],
      scheduleWork,
    };
    expect(dispatchFrameRun(port)).toMatchObject({
      kind: "scheduled",
      receipt: { stationId: "ready", job: "Frame run" },
    });
    expect(scheduleWork).toHaveBeenCalledExactlyOnceWith("ready", "Frame run");
  });
  it("dispatch does not require a service operation", () => {
    const workshop = new LocalWorkshop();
    const service = vi.spyOn(workshop, "readServiceQueue");
    dispatchFrameRun(workshop);
    expect(service).not.toHaveBeenCalled();
  });
  it("dispatch preserves busy stations and leaves an unavailable roster idle", () => {
    const workshop = new LocalWorkshop();
    const before = workshop.readRoster()[1];
    expect(dispatchFrameRun(workshop).kind).toBe("scheduled");
    const schedule = vi.spyOn(workshop, "scheduleWork");
    expect(dispatchFrameRun(workshop).kind).toBe("idle");
    expect(schedule).not.toHaveBeenCalled();
    expect(workshop.readRoster()[1]).toEqual(before);
  });
  it("an empty roster does not produce a write", () => {
    const scheduleWork = vi.fn();
    expect(dispatchFrameRun({ readRoster: () => [], scheduleWork }).kind).toBe(
      "idle",
    );
    expect(scheduleWork).not.toHaveBeenCalled();
  });
  it("scheduling validates before mutating the roster", () => {
    const workshop = new LocalWorkshop();
    const before = workshop.readRoster();
    expect(() => workshop.scheduleWork("missing", "Frame")).toThrow("Unknown");
    expect(() => workshop.scheduleWork("press-07", " ")).toThrow("required");
    expect(() => workshop.scheduleWork("lathe-02", "Frame")).toThrow("busy");
    expect(workshop.readRoster()).toEqual(before);
  });
  it("changing returned roster objects cannot edit workshop state", () => {
    const workshop = new LocalWorkshop();
    const snapshot = workshop.readRoster();
    Object.assign(snapshot[0], { state: "busy", name: "Changed" });
    expect(workshop.readRoster()[0]).toMatchObject({
      state: "ready",
      name: "Press 07",
    });
  });
  it("service runs with only its two cohesive operations", () => {
    const ticket = { id: "test", asset: "Safety check", state: "due" as const };
    const recordInspection = vi.fn(() => ({
      ...ticket,
      state: "inspected" as const,
    }));
    expect(
      inspectNextTicket({ readServiceQueue: () => [ticket], recordInspection }),
    ).toMatchObject({ state: "inspected" });
    expect(recordInspection).toHaveBeenCalledExactlyOnceWith("test");
  });
  it("service does not read or schedule the work roster", () => {
    const workshop = new LocalWorkshop();
    const read = vi.spyOn(workshop, "readRoster");
    const schedule = vi.spyOn(workshop, "scheduleWork");
    inspectNextTicket(workshop);
    expect(read).not.toHaveBeenCalled();
    expect(schedule).not.toHaveBeenCalled();
  });
  it("completed inspection is retained and is not recorded again", () => {
    const desk = new LocalInspectionDesk();
    expect(inspectNextTicket(desk)?.state).toBe("inspected");
    const record = vi.spyOn(desk, "recordInspection");
    expect(inspectNextTicket(desk)).toBeNull();
    expect(record).not.toHaveBeenCalled();
    expect(desk.readServiceQueue()[0].state).toBe("inspected");
  });
  it("invalid inspection does not mutate the queue", () => {
    const desk = new LocalInspectionDesk();
    const before = desk.readServiceQueue();
    expect(() => desk.recordInspection("missing")).toThrow("Unknown");
    expect(desk.readServiceQueue()).toEqual(before);
    desk.recordInspection("ticket-14");
    expect(() => desk.recordInspection("ticket-14")).toThrow("already");
  });
  it("queue and receipt copies cannot mutate inspection state", () => {
    const desk = new LocalInspectionDesk();
    Object.assign(desk.readServiceQueue()[0], { state: "inspected" });
    expect(desk.readServiceQueue()[0].state).toBe("due");
    const receipt = desk.recordInspection("ticket-14");
    Object.assign(receipt, { state: "due" });
    expect(desk.readServiceQueue()[0].state).toBe("inspected");
  });
  it("provider instances own independent session state", () => {
    const workshop = new LocalWorkshop();
    const snapshot = new SnapshotRoster();
    const service = new LocalInspectionDesk();
    dispatchFrameRun(workshop);
    inspectNextTicket(workshop);
    expect(snapshot.readRoster()[0].state).toBe("ready");
    expect(service.readServiceQueue()[0].state).toBe("due");
  });
  it("consumer functions do not disguise adapter exceptions as idle results", () => {
    expect(() =>
      dispatchFrameRun({
        readRoster: () => {
          throw new Error("Offline");
        },
        scheduleWork: vi.fn(),
      }),
    ).toThrow("Offline");
    expect(() =>
      inspectNextTicket({
        readServiceQueue: () => {
          throw new Error("Offline");
        },
        recordInspection: vi.fn(),
      }),
    ).toThrow("Offline");
  });
  it("UI keeps provider state when changing consumers and shows narrow dependencies", async () => {
    const user = userEvent.setup();
    render(<WorkshopCapabilityLab />);
    await user.click(screen.getByRole("button", { name: "Read status board" }));
    expect(screen.getByRole("status")).toHaveTextContent("No work scheduled");
    await user.selectOptions(screen.getByLabelText("Consumer"), "dispatch");
    expect(screen.getByTestId("workshop-port")).toHaveTextContent(
      "RosterReader & WorkScheduler",
    );
    await user.click(
      screen.getByRole("button", { name: "Schedule frame run" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent(
      "scheduled at press-07",
    );
    await user.click(
      screen.getByRole("button", { name: "Schedule frame run" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("No ready station");
    await user.selectOptions(screen.getByLabelText("Consumer"), "board");
    expect(screen.getByTestId("workshop-port")).toHaveTextContent(
      "Snapshot provider",
    );
    await user.click(
      screen.getByRole("button", { name: "Use narrow providers" }),
    );
    await user.click(screen.getByRole("button", { name: "Read status board" }));
    expect(screen.getByRole("status")).toHaveTextContent("Press 07 busy");
    await user.selectOptions(screen.getByLabelText("Consumer"), "service");
    await user.click(
      screen.getByRole("button", { name: "Record next inspection" }),
    );
    expect(screen.getByRole("status")).toHaveTextContent("Inspection recorded");
  });
});
