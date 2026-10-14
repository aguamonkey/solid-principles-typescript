# Open/Closed / Dispatch room

[Repository](../../../README.md) · [Exercise](exercise/README.md)

Add a new registered notification strategy without changing the lookup algorithm. Registration and composition are expected to change. A closed enum or switch can be clearer for a deliberately fixed set.

## Run the example

Select Demo and send through Email, SMS, Push or Slack. The visible local receipt is returned by the selected strategy. No real messages are sent. Duplicate/blank registration keys and unknown channel lookup throw.

## Follow the source

Read the [before example](bad-example/NotificationService.tsx), then the [refactored example](good-example/NotificationService.tsx). Open the matching lesson’s Before/Refactored sections to see the actual source rather than a fallback snippet.

The [foundation tests](../../../src/test/foundations.test.tsx) provide focused evidence for the chosen boundary. They do not prove every future implementation satisfies the principle.

## Study pressure and limits

Add a test-only webhook strategy, register it, and expose it in the demo. Keep the dispatcher lookup unchanged; test the receipt, an unknown key and duplicate registration.

The advanced track for this lesson is future work. The current goal is a connected, runnable foundation with clear limits, not a complete production service.
