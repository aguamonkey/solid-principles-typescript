# Geometry bench · behavioural contracts

[Foundation](../README.md) · [Decision](DECISION.md) · [Exercise](EXERCISE.md) · [Interview prompts](INTERVIEW.md)

Open the LSP lesson’s **Contract Lab**. Swap a rectangle for a circle, a measurement-only adapter or a deliberately broken adapter. All share the same TypeScript interface. The inspector accepts explicit unavailability, but rejects a successful result whose area scales linearly.

## Progression

| Scope | Question | Evidence |
| --- | --- | --- |
| Foundation | Why can a mutable Square break a Rectangle caller? | Before example and independent area operations |
| Feature ownership | What does a successful scale operation promise? | Area, perimeter, original preservation and visible outcomes |
| System ownership | How can independent implementations stay compatible? | Shared contract suite, numeric domain, copied snapshots and explicit absence |

These describe reasoning scope, not fixed job titles.

## Caller’s contract

- Dimensions and measurements must be finite and positive; units are centimetres and square centimetres. Invalid or unrepresentable construction throws `RangeError` before producing a usable instance.
- A scale factor must be finite and positive. The inspector rejects invalid input before calling the implementation; concrete working adapters also reject it at their own boundary.
- Valid factors return either **scaled** or **unavailable** with a useful reason. This abstraction deliberately does not promise that every shape can scale. Consumers must handle both outcomes.
- A successful result has area `original area × factor × factor` and perimeter `original perimeter × factor`. Its measurements must be finite and positive.
- Repeated measurement is stable, and scaling preserves the original’s measurements, including when unavailable is returned.
- Comparisons allow relative floating-point error of `1e-10`; this is a tolerance policy, not mathematical equality. Unrepresentable successful measurements must instead report unavailable.

A measurement-only adapter is substitutable under **this** contract. It would violate an abstraction that guaranteed successful scaling for every valid factor. Changing an interface’s written promise changes this judgement.

## Follow the source

1. [ScalingContract.ts](ScalingContract.ts): common operation, copied measurements and observable contract checks.
2. [MeasuredShapes.ts](MeasuredShapes.ts): rectangle/circle implementations, allowed absence and intentional counterexample.
3. [GeometryContractLab.tsx](GeometryContractLab.tsx): the same inspector and view for every implementation; a fresh instance per demonstration.
4. [Scaling.test.tsx](Scaling.test.tsx): shared cases for real shapes plus mutation, aliasing, instability, invalid values, exceptions and UI outcomes.

The foundation stays small and leaves dimension validation as its exercise. The advanced types define a separate, explicit domain rather than claiming the foundation already handles every number.

## What the evidence can tell us

Tests run the same caller expectations against each real implementation at enlargement and reduction factors. Negative fixtures demonstrate failures that TypeScript accepts structurally. Production browser tests exercise replacement, absence, broken success and recovery on desktop, mobile and dark appearance.

The inspector detects observed changes in measurements. It cannot prove general purity, detect every hidden mutation or restore an adapter it has mutated. Snapshots are copied/frozen to preserve evidence when an adapter aliases its own output. These trusted synchronous implementations cannot be forcibly interrupted if they never return. Two sampled measurements and finite test cases are evidence, not a universal proof of LSP.

There is no geometry editor, persistence or arbitrary plugin execution. Try the [triangle exercise](EXERCISE.md) before reading the [solution notes](SOLUTION.md).
