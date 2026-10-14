# Workshop roster · consumer-owned capabilities

[Foundation](../README.md) · [Decision](DECISION.md) · [Exercise](EXERCISE.md) · [Interview prompts](INTERVIEW.md)

Open the ISP lesson’s **Capability Lab**. The status board reads a roster, shift dispatch reads and schedules, and the inspection desk reads and records inspections. The capability map shows exactly which operations belong to each consumer.

**Use narrow providers** starts enabled. The board receives a snapshot reader with no scheduling methods. Inspection receives a dedicated service provider. Dispatch always receives the shared workshop because it needs both roster reading and scheduling. Disable the toggle to supply board and inspection from the shared workshop too. Each provider retains its own session state; swapping providers does not synchronise or reset it.

## Progression

| Scope | Question | Evidence |
| --- | --- | --- |
| Foundation | Why must a robot implement a human’s feeding operation? | Worker before/after and capability-specific consumers |
| Feature ownership | Which operations does this screen or workflow actually use? | Board, dispatch and inspection clients with focused test fixtures |
| System ownership | Can providers evolve without widening every client? | Consumer-owned ports, structural compatibility checks and explicit composition |

These are scopes of reasoning, not fixed job titles.

## Consumer contracts

- **RosterReader:** read station summaries, with exact identifiers and ready/busy state. `showRoster` copies the records returned by its provider. The board needs no write operation.
- **DispatchPort:** compose `RosterReader & WorkScheduler`. Dispatch schedules a frame run on the first ready station in roster order. If none is ready, it returns idle without calling the scheduler. The adapter rejects an unknown/busy station or blank job before mutating local state.
- **InspectionDesk:** read a queue and record an inspection. These two operations serve one coherent workflow, so they stay together. The consumer selects the first due ticket; if none is due, it returns null without recording. The local adapter rejects unknown or already inspected tickets.

One concrete class may supply all three ports. The consumer’s parameter type defines what it depends on; a large provider does not require a large consumer interface. TypeScript’s structural typing lets a fixture satisfy a port without inheritance or an `implements` clause.

## Follow the source

1. [WorkshopPorts.ts](WorkshopPorts.ts): consumer requirements and operation results.
2. [WorkshopConsumers.ts](WorkshopConsumers.ts): policy functions with only their required ports.
3. [WorkshopAdapters.ts](WorkshopAdapters.ts): read-only snapshot, cohesive service provider and shared local workshop.
4. [WorkshopCapabilityLab.tsx](WorkshopCapabilityLab.tsx): composition, capability map and local workflow receipts.
5. [Workshop.test.tsx](Workshop.test.tsx): narrow fixtures, dependency compatibility, unrelated operations, copied data, invalid writes and UI state.

The foundation’s inspection exercise remains separate. The advanced inspection desk is an asset/ticket workflow, not a preimplementation of the foundation’s new `Inspectable` worker capability.

## What ISP does and does not provide

ISP reduces the operations a consumer needs to understand and depend on. It does not require one method per interface. Cohesion and actual consumer needs decide the grouping. It also does not establish behavioural substitutability automatically: the provider must still honour the operations’ promises.

Narrow types are compile-time boundaries, not authentication or permissions. A concrete shared object still contains its other methods at runtime; there is no security boundary here. The dedicated snapshot/service providers actually omit unrelated operations, but their absence does not replace an authorisation policy.

These local synchronous providers are trusted fixtures. There is no backend, persistence, concurrent scheduler, retry or atomic read-and-write transaction. The adapter validates a scheduling write, but a production read-then-write workflow needs a separate concurrency/conflict policy. Unexpected provider exceptions propagate; the UI only composes the bundled successful providers. Copied projections preserve local state ownership, not deep immutability for arbitrary nested models.

Try the [service-only audit exercise](EXERCISE.md) before reading the [solution notes](SOLUTION.md). Browser tests cover desktop, mobile and dark appearance.
