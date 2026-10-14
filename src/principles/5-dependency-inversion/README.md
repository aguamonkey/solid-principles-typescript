# Dependency Inversion / Order counter

[Repository](../../../README.md) · [Exercise](exercise/README.md) · [Solution notes](SOLUTION.md) · [Boundary Lab](advanced/README.md)

Order policy accepts storage and notification abstractions. The composition boundary selects the actual implementations. A generic service container is unnecessary for this small example.

## Run the example

Select Demo, choose Email or SMS, and record a sample order. The selector changes the actual injected notification dependency, and the resulting receipt is displayed. Records are session-local and amounts use integer GBP pence. No real message, payment or database service is used.

## Follow the source

Read the [before example](bad-example/OrderService.tsx), then the [refactored example](good-example/OrderService.tsx). Open the matching lesson’s Before/Refactored sections to see the actual source rather than a fallback snippet.

The [foundation tests](../../../src/test/foundations.test.tsx) provide focused evidence for the chosen boundary. They do not prove every future implementation satisfies the principle.

## Study pressure and limits

Inject a failing notification fixture and specify the outcome when storage succeeded first. Write a test for that partial failure, then decide whether to return a richer outcome. Do not pretend notification failure rolled back a recorded order.

The [Boundary Lab](advanced/README.md) introduces separate acceptance and processing policies, policy-owned supplier ports, a local order/outbox ledger and acknowledgement failure scenarios. It includes replay/conflict tests, a separate preview deduplication exercise, decision notes and interview prompts. The original foundation remains unchanged so its partial-failure exercise is still yours to implement.
