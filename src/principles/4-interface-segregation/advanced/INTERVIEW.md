# Interview · interfaces from the client’s point of view

[Lab](README.md) · [Answer notes](INTERVIEW_NOTES.md)

Explain your answers before opening the notes.

1. State ISP in terms of a consumer’s dependency.
2. Why can one large concrete workshop serve narrow clients?
3. Why does dispatch need two capabilities while the board needs one?
4. Why do inspection reading and recording stay together initially?
5. What makes the audit exercise a good reason to split queue reading?
6. How does TypeScript structural typing affect this design?
7. What evidence shows a client does not require unrelated methods?
8. Why are narrow types not a permission system?
9. What production risk remains in dispatch’s read-then-write sequence?
10. How do ISP, LSP and DIP contribute different reasoning here?

For a short rehearsal: choose a consumer, describe its port, supply a minimal fixture, then explain one limit of that boundary.
