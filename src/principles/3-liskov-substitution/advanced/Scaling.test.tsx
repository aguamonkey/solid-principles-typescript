import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  inspectScaling,
  closeEnough,
  type MeasuredShape,
  type Measurement,
} from "./ScalingContract";
import {
  MeasuredRectangle,
  MeasuredCircle,
  UnavailableShape,
  LinearAreaShape,
} from "./MeasuredShapes";
import { GeometryContractLab } from "./GeometryContractLab";
const measured = (areaCm2 = 20, perimeterCm = 18): Measurement => ({
  areaCm2,
  perimeterCm,
});
const fixed = (value: Measurement): MeasuredShape => ({
  measure: () => value,
  scaled: () => ({ kind: "unavailable", reason: "Measurement only" }),
});
describe("shared scaling promises", () => {
  for (const [name, create] of [
    ["rectangle", () => new MeasuredRectangle(5, 4)],
    ["circle", () => new MeasuredCircle(2)],
  ] as const) {
    for (const factor of [2, 0.5])
      it(`${name} honours the shared contract at factor ${factor}`, () => {
        const shape = create();
        const before = shape.measure();
        const report = inspectScaling(shape, factor);
        expect(report.kind).toBe("passed");
        if (report.kind !== "passed")
          throw new Error("Expected successful scaling");
        expect(report.after.areaCm2).toBeCloseTo(
          before.areaCm2 * factor * factor,
        );
        expect(report.after.perimeterCm).toBeCloseTo(
          before.perimeterCm * factor,
        );
        expect(shape.measure()).toEqual(before);
        expect(inspectScaling(shape, factor)).toEqual(report);
      });
    it(`${name} rejects invalid construction`, () => {
      for (const value of [
        0,
        -1,
        NaN,
        Infinity,
        Number.MAX_VALUE,
        Number.MIN_VALUE,
      ])
        expect(() =>
          name === "rectangle"
            ? new MeasuredRectangle(value, value)
            : new MeasuredCircle(value),
        ).toThrow(RangeError);
    });
    it(`${name} reports unavailable for unrepresentable scaling`, () => {
      const shape = create();
      const before = shape.measure();
      for (const factor of [Number.MAX_VALUE, Number.MIN_VALUE])
        expect(inspectScaling(shape, factor).kind).toBe("unavailable");
      expect(shape.measure()).toEqual(before);
    });
    it(`${name} rejects invalid factors at its own boundary`, () => {
      for (const factor of [0, -1, NaN, Infinity])
        expect(() => create().scaled(factor)).toThrow(RangeError);
    });
  }
  it("rejects invalid caller input before invoking an implementation", () => {
    const shape = { measure: vi.fn(), scaled: vi.fn() };
    for (const factor of [0, -1, NaN, Infinity])
      expect(inspectScaling(shape, factor).kind).toBe("invalid-input");
    expect(shape.measure).not.toHaveBeenCalled();
    expect(shape.scaled).not.toHaveBeenCalled();
  });
  it("accepts explicitly permitted unavailability", () => {
    expect(inspectScaling(new UnavailableShape(), 2)).toMatchObject({
      kind: "unavailable",
      before: measured(),
    });
  });
  it("rejects successful results that scale area linearly", () => {
    for (const factor of [2, 0.5])
      expect(inspectScaling(new LinearAreaShape(), factor)).toMatchObject({
        kind: "violation",
        message: expect.stringContaining("square"),
      });
  });
  it("detects original mutation even when an adapter reports unavailable", () => {
    let area = 20;
    const shape: MeasuredShape = {
      measure: () => measured(area),
      scaled: () => {
        area = 80;
        return { kind: "unavailable", reason: "Stopped" };
      },
    };
    expect(inspectScaling(shape, 2)).toMatchObject({
      kind: "violation",
      message: expect.stringContaining("mutated"),
      before: measured(),
    });
    expect(shape.measure().areaCm2).toBe(80); // Inspection cannot roll back implementation state.
  });
  it("copies aliased measurements before calling scale", () => {
    const value = { areaCm2: 20, perimeterCm: 18 };
    const shape: MeasuredShape = {
      measure: () => value,
      scaled: () => {
        value.areaCm2 = 80;
        return { kind: "scaled", shape: fixed(measured(80, 36)) };
      },
    };
    const report = inspectScaling(shape, 2);
    expect(report).toMatchObject({ kind: "violation", before: measured() });
    if ("before" in report) expect(Object.isFrozen(report.before)).toBe(true);
  });
  it("detects unstable measurements of the original", () => {
    let calls = 0;
    const shape = {
      ...fixed(measured()),
      measure: () => measured(20 + calls++),
    };
    expect(inspectScaling(shape, 2)).toMatchObject({
      kind: "violation",
      message: expect.stringContaining("Repeated measurement"),
    });
  });
  it("detects unstable measurements of a successful result", () => {
    let calls = 0;
    const result = {
      ...fixed(measured()),
      measure: () => measured(80 + calls++, 36),
    };
    const shape: MeasuredShape = {
      ...fixed(measured()),
      scaled: () => ({ kind: "scaled", shape: result }),
    };
    expect(inspectScaling(shape, 2)).toMatchObject({
      kind: "violation",
      message: expect.stringContaining("scaled shape"),
    });
  });
  it("rejects invalid measurement domains", () => {
    for (const value of [0, -1, NaN, Infinity]) {
      expect(inspectScaling(fixed(measured(value)), 2).kind).toBe("violation");
      expect(inspectScaling(fixed(measured(20, value)), 2).kind).toBe(
        "violation",
      );
    }
  });
  it("checks perimeter independently of correct area", () => {
    const shape: MeasuredShape = {
      ...fixed(measured()),
      scaled: () => ({ kind: "scaled", shape: fixed(measured(80, 18)) }),
    };
    expect(inspectScaling(shape, 2)).toMatchObject({
      kind: "violation",
      message: expect.stringContaining("Perimeter"),
    });
  });
  it("requires useful unavailability reasons", () => {
    const shape: MeasuredShape = {
      ...fixed(measured()),
      scaled: () => ({ kind: "unavailable", reason: " " }),
    };
    expect(inspectScaling(shape, 2).kind).toBe("violation");
  });
  it("reports an unexpected implementation exception", () => {
    const shape = {
      ...fixed(measured()),
      scaled: () => {
        throw new Error("Broken adapter");
      },
    };
    expect(inspectScaling(shape, 2).kind).toBe("violation");
  });
  it("rejects claimed success when expected measurements overflow", () => {
    const shape: MeasuredShape = {
      ...fixed(measured()),
      scaled: () => ({ kind: "scaled", shape: fixed(measured()) }),
    };
    expect(inspectScaling(shape, Number.MAX_VALUE)).toMatchObject({
      kind: "violation",
      message: expect.stringContaining("Unrepresentable"),
    });
  });
  it("relative tolerance does not hide large errors at tiny magnitudes", () => {
    expect(closeEnough(1e-20, 2e-20)).toBe(false);
    expect(closeEnough(1e-20, 1e-20 * (1 + 1e-12))).toBe(true);
  });
  it("the UI distinguishes absence from broken success and recovers on replacement", async () => {
    const user = userEvent.setup();
    render(<GeometryContractLab />);
    const result = screen.getByTestId("geometry-result");
    expect(result).toHaveAttribute("data-outcome", "passed");
    await user.selectOptions(
      screen.getByLabelText("Implementation"),
      "unavailable",
    );
    expect(result).toHaveTextContent("PERMITTED UNAVAILABILITY");
    await user.selectOptions(screen.getByLabelText("Implementation"), "broken");
    expect(result).toHaveTextContent("CONTRACT VIOLATION");
    await user.selectOptions(screen.getByLabelText("Implementation"), "circle");
    await user.selectOptions(screen.getByLabelText("Scale factor"), "0.5");
    expect(result).toHaveAttribute("data-outcome", "passed");
  });
});
