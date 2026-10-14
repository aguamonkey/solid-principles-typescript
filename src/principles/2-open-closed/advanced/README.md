# Dispatch room · extension and compatibility

[Foundation](../README.md) · [Decision](DECISION.md) · [Exercise](EXERCISE.md) · [Interview prompts](INTERVIEW.md)

A saved batch contains a familiar email, a new channel, a future email version and a damaged payload. An older client should retain useful previews without guessing what an unsupported schema means.

Open the OCP lesson’s **Extension Lab**. The base registry supports email v1. **Include webhook extension** composes a new registry: the webhook becomes readable, while email v2 remains unsupported and the damaged email remains rejected. Nothing is sent.

## Progression

| Scope | Question | Evidence |
| --- | --- | --- |
| Foundation | Can I register another strategy without editing dispatch lookup? | Original notification service and a test-only channel |
| Feature ownership | Can one damaged record leave other previews readable? | Ordered, per-record outcomes and accessible controls |
| System ownership | How do releases agree on payload meaning? | Exact channel/version keys, registration rules, compatibility tests and rollout notes |

These are scopes of reasoning, not fixed seniority labels.

## Contract

- Input is an already-parsed array. A non-array fails the document; an empty array succeeds.
- Envelopes require nonblank string identity/channel and a positive safe-integer version. Keys and identities are exact and case-sensitive; no trimming, aliases or version guessing occurs.
- First valid envelope claims its identity, even if its payload is invalid or unsupported. Later duplicates are rejected independently of installed adapters.
- An exact channel/version registration is required. Unknown channels or versions are **unsupported**, and their payloads are not decoded.
- Registered decoders own payload rules. Bad known payloads are **rejected** without hiding valid records.
- Adapter output needs nonblank label, recipient and body. Accepted projections are copied and frozen; the report preserves input order.
- Registration is complete at construction. Duplicate or invalid keys fail composition. The registry exposes lookup but no registration mutation API. The UI composes another registry to demonstrate adding support.

The email v1 adapter expects `to` and `subject`. The webhook v1 adapter expects an HTTPS `endpoint` without embedded credentials and nonblank `text`. URL validation is a preview rule, not a security policy for a production webhook sender.

## Read the source

1. [DispatchRegistry.ts](DispatchRegistry.ts): exact schema lookup and composition-time validation.
2. [DispatchBatch.ts](DispatchBatch.ts): shared envelope, identity policy and per-record recovery.
3. [DispatchComposition.ts](DispatchComposition.ts): separate email/webhook payload rules and the bundled batch.
4. [DispatchLab.tsx](DispatchLab.tsx): one report view independent of concrete adapters.
5. [Dispatch.test.tsx](Dispatch.test.tsx): changed support leaves unrelated outcomes unchanged; a test-only channel extends the same algorithm.

## Where is the boundary closed?

Adding another supported schema changes its adapter and composition. It does not add channel checks to the batch loop or report view. Changes to document policies, such as duplicate reconciliation, can legitimately change the loop. OCP is selective, not a promise that algorithms never evolve.

TypeScript `readonly` describes compile-time intent. Private lookup state and copied projections support this design, but registered functions can still capture mutable state. These are trusted, synchronous adapters, not sandboxed plugins; a nonterminating adapter cannot be interrupted by this importer.

## Limits and evidence

Twenty tests cover registration, exact versions, runtime shape, identity, payloads, copied output and the UI toggle. Production browser tests cover desktop, mobile and dark appearance. Existing foundation tests remain in place.

There is no delivery, queue, network, durable unknown-payload storage, size limit, retry or deduplication across separate batches. Partial recovery fits this preview screen; actual delivery needs a separate policy for side effects and acknowledgements. The bundled input remains available when a new registry is composed. A production workflow would need bounded data, diagnostics and an explicit rollout plan.

[Try email v2](EXERCISE.md) before reading the [solution notes](SOLUTION.md).
