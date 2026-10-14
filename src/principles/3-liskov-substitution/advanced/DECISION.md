# Decision · make the successful outcome’s promises explicit

[Lab](README.md)

## Pressure

A caller must scale shapes supplied by different implementations without inspecting concrete classes. TypeScript can verify signatures while accepting a result with incorrect area or a mutating implementation.

## Decision

Use measurement and scaling operations with a discriminated outcome. Successful scaling preserves the original and obeys area/perimeter relationships. Unavailability is an ordinary, documented result. Construction rejects invalid dimensions; valid scale requests that cannot be represented return unavailable. Measurements use fixed units and relative numeric tolerance.

The caller captures copied snapshots before scaling. The shared tests apply identical expectations to rectangles and circles; deliberate negative fixtures show what violates them. The UI displays the inspector’s result without concrete-class branches.

## Alternatives

- Mutable Rectangle/Square inheritance: setter semantics conflict when callers expect independent dimensions. Sharing a mathematical category does not establish behavioural compatibility.
- Promise universal scaling: a stronger interface might be right for another client, but would exclude measurement-only implementations. Returning unavailable would violate that stronger promise.
- Throw for routine absence: this hides an expected outcome in an exception path. Unexpected exceptions still count as violations for valid requests in this lab.
- Absolute numeric epsilon: it can accept proportionally large errors for very small shapes. Relative tolerance reflects the chosen domain, although underflow and overflow still need explicit handling.

## Consequences

Callers must handle unavailable. This makes a weaker guarantee explicit; it is not permission to weaken an existing contract after clients rely on it. Adding a new implementation requires shared behavioural evidence, not only compiling `implements MeasuredShape`.

The inspector reports observable failures but cannot roll them back. A production adapter boundary needs suitable isolation, bounded work and diagnostics. Those are outside this synchronous teaching example.
