# Interview · policy, suppliers and uncertain outcomes

[Lab](README.md) · [Answer notes](INTERVIEW_NOTES.md)

Answer aloud before opening the notes.

1. How is DIP different from simply injecting a concrete dependency?
2. Which layer owns the ports here, and why?
3. Why separate order acceptance from receipt processing?
4. What does the combined recorder commit promise?
5. Why does a storage exception yield unconfirmed rather than definitely failed?
6. What makes replaying order acceptance safe in this example?
7. What happens if the supplier succeeds but queue acknowledgement fails?
8. Why does an outbox not imply exactly-once effects?
9. How would you replace the memory ledger with real persistence?
10. What would you add before running several processing workers?

For a short rehearsal: draw the dependency arrows, run a lost-acknowledgement scenario, and explain what a retry can and cannot guarantee.
