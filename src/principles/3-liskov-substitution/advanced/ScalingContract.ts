export interface Measurement {
  readonly areaCm2: number;
  readonly perimeterCm: number;
}
export interface MeasuredShape {
  measure(): Measurement;
  scaled(factor: number): ScaleOutcome;
}
export type ScaleOutcome =
  | { readonly kind: "scaled"; readonly shape: MeasuredShape }
  | { readonly kind: "unavailable"; readonly reason: string };
export type ScalingReport =
  | { readonly kind: "invalid-input"; readonly message: string }
  | {
      readonly kind: "violation";
      readonly message: string;
      readonly before?: Measurement;
      readonly after?: Measurement;
    }
  | {
      readonly kind: "unavailable";
      readonly message: string;
      readonly before: Measurement;
    }
  | {
      readonly kind: "passed";
      readonly message: string;
      readonly before: Measurement;
      readonly after: Measurement;
    };
export function validFactor(factor: number): boolean {
  return Number.isFinite(factor) && factor > 0;
}
function snapshot(shape: MeasuredShape): Measurement {
  const value = shape.measure();
  if (
    !value ||
    !Number.isFinite(value.areaCm2) ||
    value.areaCm2 <= 0 ||
    !Number.isFinite(value.perimeterCm) ||
    value.perimeterCm <= 0
  )
    throw new Error("Measurement must be finite and positive.");
  return Object.freeze({
    areaCm2: value.areaCm2,
    perimeterCm: value.perimeterCm,
  });
}
// Floating-point comparisons are relative to magnitude, not an absolute epsilon.
export function closeEnough(a: number, b: number): boolean {
  return (
    a === b || Math.abs(a - b) <= 1e-10 * Math.max(Math.abs(a), Math.abs(b))
  );
}
function same(a: Measurement, b: Measurement): boolean {
  return (
    closeEnough(a.areaCm2, b.areaCm2) &&
    closeEnough(a.perimeterCm, b.perimeterCm)
  );
}
export function inspectScaling(
  shape: MeasuredShape,
  factor: number,
): ScalingReport {
  if (!validFactor(factor))
    return {
      kind: "invalid-input",
      message: "Use a finite, positive scale factor.",
    };
  let before: Measurement | undefined;
  let after: Measurement | undefined;
  try {
    before = snapshot(shape);
    if (!same(before, snapshot(shape)))
      return {
        kind: "violation",
        message: "Repeated measurement changed the original.",
        before,
      };
    const outcome = shape.scaled(factor);
    if (!same(before, snapshot(shape)))
      return {
        kind: "violation",
        message: "Scaling mutated the original shape.",
        before,
      };
    if (outcome.kind === "unavailable") {
      if (typeof outcome.reason !== "string" || !outcome.reason.trim())
        return {
          kind: "violation",
          message: "Unavailability needs a useful reason.",
          before,
        };
      return { kind: "unavailable", message: outcome.reason, before };
    }
    if (outcome.kind !== "scaled")
      return { kind: "violation", message: "Unknown scale outcome.", before };
    after = snapshot(outcome.shape);
    if (!same(after, snapshot(outcome.shape)))
      return {
        kind: "violation",
        message: "Repeated measurement changed the scaled shape.",
        before,
        after,
      };
    const expectedArea = before.areaCm2 * factor * factor;
    const expectedPerimeter = before.perimeterCm * factor;
    if (!validFactor(expectedArea) || !validFactor(expectedPerimeter))
      return {
        kind: "violation",
        message: "Unrepresentable scaling must report unavailable.",
        before,
        after,
      };
    if (!closeEnough(after.areaCm2, expectedArea))
      return {
        kind: "violation",
        message: "Area must change by the square of the factor.",
        before,
        after,
      };
    if (!closeEnough(after.perimeterCm, expectedPerimeter))
      return {
        kind: "violation",
        message: "Perimeter must change by the factor.",
        before,
        after,
      };
    return {
      kind: "passed",
      message:
        "Scaling preserves the original and honours both measurement rules.",
      before,
      after,
    };
  } catch {
    return {
      kind: "violation",
      message: "The implementation threw or returned an invalid measurement.",
      before,
      after,
    };
  }
}
