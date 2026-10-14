# Decision · define ports from consumers

[Lab](README.md)

## Pressure

A shared workshop can read stations, schedule work and handle inspections. A status board should not require a mock scheduler just to display station readiness. A service provider should not manufacture a work roster it never uses.

## Decision

Give the board `RosterReader`. Dispatch composes reading and scheduling as an intersection. Keep the service queue and inspection write in one cohesive `InspectionDesk` interface. Implement separate narrow providers as evidence, alongside a shared workshop that supplies several ports.

The policies accept ports; the React lab chooses providers. They do not import or branch on adapter classes. Local reads return copies and writes validate before assignment. The lab retains each provider’s state while consumers and selections change.

## Alternatives

- One `WorkshopManager` for every consumer: easy to wire, but it forces unrelated operations onto tests and small providers.
- One method per interface everywhere: possible, but separating both inspection operations without a consumer need adds names and wiring without reducing this client’s dependency.
- Optional scheduling/service methods on one interface: moves compatibility questions into runtime checks and lets a dispatcher receive an object that cannot dispatch.
- Give clients concrete classes: exposes supplier details and makes narrow test fixtures harder to use.

## Consequences

Composition owns the choice of providers and knows their capabilities. A broader concrete class remains acceptable wherever it satisfies a narrow port. Type checking establishes structural requirements, while behavioural tests cover actual calls and state. Neither supplies authorisation or concurrency safety.

When a new consumer needs a different subset, start with its use case. Add or compose a port based on that need rather than growing every existing interface or automatically creating a one-method interface.
