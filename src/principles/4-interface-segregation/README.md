# Interface Segregation / Workshop roster

[Repository](../../../README.md) · [Exercise](exercise/README.md) · [Solution notes](SOLUTION.md) · [Capability Lab](advanced/README.md)

Consumers request a capability such as charging rather than every operation in a large Worker interface. A human does not need to pretend to have a battery. Small interfaces are useful because of consumer requirements, not because one method per interface is a universal rule.

## Run the example

Select Demo to see actual work, feeding and charging results returned by the participating implementations. Human, robot and cyborg fixtures share capabilities as appropriate. There is no real automation backend.

## Follow the source

Read the [before example](bad-example/Worker.tsx), then the [refactored example](good-example/Worker.tsx). Open the matching lesson’s Before/Refactored sections to see the actual source rather than a fallback snippet.

The [foundation tests](../../../src/test/foundations.test.tsx) provide focused evidence for the chosen boundary. They do not prove every future implementation satisfies the principle.

## Study pressure and limits

Add an inspection consumer accepting only an Inspectable capability. Use a fixture that exposes only inspection, then decide which existing workers should support it. Keep unrelated charging/feeding functions unchanged.

The [Capability Lab](advanced/README.md) adds a read-only board, a read-and-schedule dispatcher and a cohesive inspection workflow. Compare dedicated providers with a shared workshop, then attempt the separate audit exercise. Decision notes and interview prompts explain when to split or compose requirements.
