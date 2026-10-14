# Decision · acceptance and receipt processing have separate acknowledgements

[Lab](README.md)

## Pressure

Saving an order followed by sending a receipt can leave a valid order recorded while the caller sees a notification failure. Injecting a sender makes it replaceable, but does not explain what was committed or whether retry is safe.

## Decision

Keep the abstractions beside the policy. Acceptance depends on one recorder that commits the order and pending receipt together. Processing depends on a pending queue and a sender. The local ledger implements both storage roles; the composition boundary selects failure fixtures and preview channels.

Return explicit uncertainty instead of claiming that a thrown call rolled back its effects. Replay identity/content at acceptance, preserving one order/outbox entry. Acknowledge a pending receipt only after the sender resolves. Supplier receipts and queue acknowledgements remain separate facts.

## Alternatives

- Save then send as one boolean operation: small, but conflates acceptance with notification and gives callers too little information for retry.
- Let policy import a storage SDK’s interface: still ties policy to supplier-owned semantics, even if construction is injectable. Our ports express what this use case needs.
- Wrap save and network send in a claimed transaction: a local database transaction alone cannot atomically govern an independent remote supplier.
- Claim exactly-once processing from the outbox: an outbox records pending intent, but duplicate effects remain possible without additional provider/worker guarantees.
- Add a generic dependency container: unnecessary for these three explicit ports and makes the dependency graph less visible to a learner.

## Consequences

Production recorders must fulfil the combined commit contract. Production processing needs a considered duplicate-effect policy, bounded retries, observability and durable identities. Those guarantees are not provided by interfaces alone.

The local memory adapter demonstrates atomic installation, not crash durability. The policy can be tested with minimal fixtures; the same functions handle every bundled supplier. The failure scenarios are deterministic, so interviews can discuss known evidence and uncertainty separately.
