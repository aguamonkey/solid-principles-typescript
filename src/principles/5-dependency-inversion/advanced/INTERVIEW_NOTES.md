# Interview answer notes

[Prompts](INTERVIEW.md)

1. Injection describes how a dependency arrives. DIP concerns source dependency direction: policy depends on a policy-owned abstraction, and supplier implementations conform to it.
2. `OrderPorts.ts` expresses use-case requirements. It does not import a storage or message SDK. Composition selects adapters separately.
3. An accepted order and a processed receipt are different facts. Separating them keeps valid orders visible during supplier failure and supports explicit retry policy.
4. Install an order and pending receipt together, with replay/conflict semantics. The local map assignment demonstrates installation; a durable adapter needs an appropriate transaction.
5. The recorder may commit and lose its acknowledgement. A thrown call alone cannot prove no state changed. Retry with a stable identity reconciles that ambiguity.
6. Exact identity plus identical recipient/amount returns replayed without another pending intent. Changed content conflicts. This policy applies to acceptance, not every downstream effect.
7. The pending item can remain readable although the supplier already produced a receipt. Retry can produce another effect unless the supplier handles duplicate identities.
8. An outbox stores intent. Sender effects and local acknowledgement are separate operations, and concurrent readers or lost acknowledgements can duplicate effects.
9. Implement the same ports with durable identity constraints and order/outbox transactionality. Translate meaningful results into policy contracts and run the behavioural suite plus integration tests against persistence.
10. Define claim/lease or transactional selection, retry/backoff, limits, conflict reconciliation, observability and supplier idempotency. Explain crash cases; do not assume a UI busy flag coordinates workers.
