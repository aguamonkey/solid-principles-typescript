# Liskov Substitution / Geometry bench

[Repository](../../../README.md) · [Exercise](exercise/README.md)

An implementation must honour behavioural promises, not just method signatures. The before example shows a mutable Square changing the Rectangle setters’ meaning. The refactored caller uses area/perimeter operations without that mutable rectangle contract.

## Run the example

Select Demo and calculate the total area for a 5×4 rectangle, side-3 square and radius-2 circle. The expected total is approximately 41.57. These are local positive-dimension fixtures; the baseline does not yet validate negative, nonfinite or overflowing dimensions.

## Follow the source

Read the [before example](bad-example/Shapes.tsx), then the [refactored example](good-example/Shapes.tsx). Open the matching lesson’s Before/Refactored sections to see the actual source rather than a fallback snippet.

The [foundation tests](../../../src/test/foundations.test.tsx) provide focused evidence for the chosen boundary. They do not prove every future implementation satisfies the principle.

## Study pressure and limits

Specify the supported dimension domain, validate constructors/setters, and add shared contract tests for each shape. Explain which failures happen at construction and why successful shapes remain substitutable.

The advanced track for this lesson is future work. The current goal is a connected, runnable foundation with clear limits, not a complete production service.
