# Solution notes · local preview deduplication

[Exercise](EXERCISE.md)

These are review notes; the decorator is not implemented.

Implement the policy-owned sender port and wrap another sender. Store the identity’s recipient, message and successful returned receipt. On a sequential replay, compare content and return the previous receipt. Reject a conflict. On first success, cache a copied record; on rejection, leave no success entry.

Create the decorator once in composition, outside individual retry calls. A new instance per attempt would forget earlier effects. Use a failing queue acknowledgement to prove the second processing attempt uses the stored supplier receipt, while the policy remains unchanged.

Do not label this exactly-once delivery. Memory resets, concurrent first attempts can race, and the underlying supplier may have performed an effect before rejecting. Durable provider idempotency and appropriately bounded retention are different requirements. A follow-up can coalesce in-flight attempts by identity/content, but even that does not resolve remote acknowledgement uncertainty.
