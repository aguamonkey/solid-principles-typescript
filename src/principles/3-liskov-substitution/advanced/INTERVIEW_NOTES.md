# Interview answer notes

[Prompts](INTERVIEW.md)

1. Types check structure. They do not establish stable measurements, preserved originals or correct numeric relationships.
2. A Rectangle caller can expect independent width and height updates; a Square changes both. The subtype strengthens an invariant while breaking inherited operation semantics.
3. A valid factor is finite and positive. Successful scaling preserves original measurements and yields finite positive area × k² and perimeter × k, within the declared tolerance. Unavailability is explicitly allowed.
4. The interface promises an outcome, not universal successful scaling. A stronger abstraction would exclude the measurement-only adapter.
5. Invalid construction creates no valid instance. A valid scaling request may encounter unavailable capability or unrepresentable results; the consumer handles that documented branch.
6. An adapter might return an alias to its mutable state. A copied, frozen snapshot preserves the original evidence; it does not freeze the adapter.
7. Shared tests provide consistent evidence for sampled implementations and inputs. They cannot prove all inputs, hidden state, arbitrary side effects or termination.
8. A fixed absolute floor can hide a large relative error at tiny magnitudes. Relative tolerance still requires deliberate finite/positive checks and a domain policy.
9. Apply the same contract suite, include boundary inputs and mutation/aliasing cases, then assess isolation and diagnostics separately. Passing structural types is only the first check.
10. OCP concerns extending composition without editing the shared algorithm. LSP concerns the new implementation preserving every promise used by that algorithm. Neither alone guarantees the other.
