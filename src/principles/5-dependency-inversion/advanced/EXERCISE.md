# Exercise · deduplicating local preview supplier

[Lab](README.md) · [Solution notes](SOLUTION.md)

Implement a `ReceiptSender` decorator that remembers successful local previews by exact order identity. The same identity, recipient and message must return the cached supplier receipt without another underlying preview effect. Reusing the identity with changed content must fail rather than return a receipt for different content.

Store successful results only. When the underlying sender rejects, do not cache success; allow a later retry. For this exercise, callers are sequential: concurrent in-flight deduplication is a separate follow-up. Keep the decorator instance alive across queue-acknowledgement retries in composition.

Test acknowledgement failure followed by retry: one order, one underlying preview, eventually no pending receipt. Also test changed content, independent identities and failure followed by recovery. Do not edit `acceptOrder` or `deliverNextReceipt` to recognise the decorator.

Explain why an in-memory cache does not establish exactly-once effects after a process restart or an effect followed by an exception. A real supplier’s idempotency contract needs its own retention, conflict and acknowledgement semantics.

Run `npm run check`, rebuild and run `npm run test:browser`. The decorator is intentionally not implemented in this milestone.
