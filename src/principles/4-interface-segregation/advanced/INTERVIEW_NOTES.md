# Interview answer notes

[Prompts](INTERVIEW.md)

1. A consumer should not depend on operations it does not use. Define the requirement from its workflow, not from every capability of the supplier.
2. A provider may fulfil several ports. Passing it as a narrow port limits the consumer’s compile-time dependency even though runtime methods still exist.
3. The board only displays summaries. Dispatch needs a roster to choose a ready station and a scheduler to issue the assignment; neither is an unrelated dependency.
4. Both support the inspection workflow. A one-method rule would add abstractions without evidence that a client benefits.
5. The audit needs queue reading and has no write responsibility. A new reader supports that real client while the existing desk retains its cohesive combined contract.
6. Objects with the required members satisfy a port, without inheritance. This makes minimal fixtures practical. Structural compatibility does not prove correct behaviour.
7. Use a fixture that lacks the unrelated methods, check structural compatibility in type checking and run behavioural tests. Spies on a broader provider also reveal accidental calls.
8. TypeScript types are erased. Access control needs enforcement at an appropriate runtime boundary; a narrow annotation on a powerful object does not revoke capabilities.
9. A station might become busy after the read. A backend needs conflict handling or an atomic scheduling policy. These synchronous session fixtures do not simulate concurrency.
10. ISP selects operations a client needs. LSP asks whether an implementation honours those operations’ promises. DIP asks which layer owns the abstraction and whether policy depends on it rather than a concrete supplier.
