# Decision · explicit versions, frozen registration

[Lesson](README.md)

## Pressure and choice

Older clients can receive independently introduced channels and payload versions. Useful previews should remain visible without interpreting unfamiliar data using the wrong adapter.

Construct a registry keyed by channel/version, reject duplicate registration, and use one per-record preview loop. Known bad payloads and unsupported schemas have different outcomes. First valid envelope wins identity; this is independent of support availability, but means a bad first payload can block a later valid duplicate. That tradeoff is explicit.

## Alternatives

A closed enum/switch is clearer for a fixed set requiring exhaustive handling. Here independent registration is the exercise’s requirement. Live mutable registration would need update ordering and snapshot rules; this screen only needs composition-time setup.

Version fallback risks accepting incompatible meaning. Register explicit adapters instead. Failing the whole batch can be right for atomic transactions, but removes useful independent previews here. This decision does not establish partial-success delivery semantics.

## Migration

Agree envelope identity and version meaning with producers. Capture representative batches, compare supported/rejected counts, and add adapters before producers rely on them. Measure aggregate schema failures without logging raw messages. Keep a composition rollback path. Unknown-payload persistence and release negotiation require separate decisions and are not implemented.

## Revisit when

Inputs become large, plugins are untrusted, registration changes at runtime, delivery side effects appear, or cross-record consistency is required. Each constraint can change the chosen boundary.
