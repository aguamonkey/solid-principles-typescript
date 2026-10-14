# Interview answer notes

[Prompts](INTERVIEW.md)

## 1. What remains stable when a channel is added?

The lookup, batch policies and report view. Adapter and composition change. A new document-level policy can still require editing the batch boundary.

## 2. Why use channel and version together?

A familiar channel does not imply familiar payload meaning. Exact keys avoid guessing backwards compatibility.

## 3. When is a switch better?

When the set is intentionally closed and exhaustive checking outweighs independent extension. A registry earns its indirection through the actual change pressure.

## 4. Why reject duplicate registrations?

Silent replacement makes configuration order change behaviour. Fail before processing instead.

## 5. Why distinguish unsupported from rejected?

Unsupported means no exact adapter exists for a valid envelope; rejected means known data or adapter output violates the contract. Upgrade and data-quality responses differ.

## 6. Why can one bad record leave other previews intact?

These previews are independent. Atomic operations or delivery dependencies could require a different policy.

## 7. Does readonly make the entire plugin system immutable?

No. Lookup has no mutation API and projections are copied, but functions can capture mutable state. These are trusted adapters, not a sandbox.

## 8. What does first-valid-envelope identity cost?

An unsupported or malformed payload can reserve an ID and block a later valid duplicate. It makes duplicate policy independent of installed support.

## 9. How does this connect to the Swift atlas?

Both require exact version interpretation and isolate unsupported/malformed records. TypeScript must validate unknown runtime shapes; compare the behavioural contract rather than the syntax.

## 10. What changes when previews become actual deliveries?

Define side effects, acknowledgement, retries, idempotency, timeouts and partial failures separately. Preview success is not delivery success.
