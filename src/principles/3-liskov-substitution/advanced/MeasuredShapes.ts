import {
  validFactor,
  type Measurement,
  type MeasuredShape,
  type ScaleOutcome,
} from "./ScalingContract";
function validate(
  measurement: Measurement,
  dimensions: readonly number[],
): void {
  if (
    !dimensions.every(validFactor) ||
    !validFactor(measurement.areaCm2) ||
    !validFactor(measurement.perimeterCm)
  )
    throw new RangeError(
      "Dimensions must produce finite, positive measurements.",
    );
}
function scale(factory: () => MeasuredShape, factor: number): ScaleOutcome {
  if (!validFactor(factor)) throw new RangeError("Invalid scale factor.");
  try {
    return { kind: "scaled", shape: factory() };
  } catch (error) {
    if (error instanceof RangeError)
      return {
        kind: "unavailable",
        reason: "Scaled dimensions cannot be represented.",
      };
    throw error;
  }
}
export class MeasuredRectangle implements MeasuredShape {
  constructor(
    private readonly width: number,
    private readonly height: number,
  ) {
    validate(this.measure(), [width, height]);
  }
  measure(): Measurement {
    return {
      areaCm2: this.width * this.height,
      perimeterCm: 2 * (this.width + this.height),
    };
  }
  scaled(factor: number): ScaleOutcome {
    return scale(
      () => new MeasuredRectangle(this.width * factor, this.height * factor),
      factor,
    );
  }
}
export class MeasuredCircle implements MeasuredShape {
  constructor(private readonly radius: number) {
    validate(this.measure(), [radius]);
  }
  measure(): Measurement {
    return {
      areaCm2: Math.PI * this.radius * this.radius,
      perimeterCm: 2 * Math.PI * this.radius,
    };
  }
  scaled(factor: number): ScaleOutcome {
    return scale(() => new MeasuredCircle(this.radius * factor), factor);
  }
}
// Permitted unavailability is distinct from violating a successful outcome's promise.
export class UnavailableShape implements MeasuredShape {
  measure(): Measurement {
    return { areaCm2: 20, perimeterCm: 18 };
  }
  scaled(factor: number): ScaleOutcome {
    if (!validFactor(factor)) throw new RangeError("Invalid scale factor.");
    return {
      kind: "unavailable",
      reason: "This adapter supports measurement only.",
    };
  }
}
// Deliberate counterexample: signatures match; the successful result breaks area scaling.
export class LinearAreaShape implements MeasuredShape {
  constructor(
    private readonly area = 20,
    private readonly perimeter = 18,
  ) {}
  measure(): Measurement {
    return { areaCm2: this.area, perimeterCm: this.perimeter };
  }
  scaled(factor: number): ScaleOutcome {
    return {
      kind: "scaled",
      shape: new LinearAreaShape(this.area * factor, this.perimeter * factor),
    };
  }
}
