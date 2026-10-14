# Interview answer notes

[Prompts](INTERVIEW.md)

## 1. What gives this type a reason to change?

Identify an independent policy request: form rules, source shape, storage, publication or layout. Method count and class names are weak substitutes for that reasoning.

## 2. Why separate runtime decoding from form validation?

Existing records can remain valid for reading even when new edits face stricter rules. A compile-time interface cannot validate an unknown response.

## 3. Why does the hook own both loading and updating?

They publish one screen’s profile and share cancellation, failure and snapshot policy. Cohesive operations can remain together.

## 4. Why keep dependencies stable across renders?

Replacing a dependency changes effect inputs and restarts loading. Composition gives source/storage a deliberate mounted-session lifetime.

## 5. What protects against a supplier that ignores abort?

The hook checks both the signal and current request identity after awaiting. Tests control completion order without timing sleeps.

## 6. What happens when storage fails after a successful update?

The acknowledged profile remains visible. The notice identifies snapshot failure; a transport failure claim would misrepresent the completed operation.

## 7. How would you move to a real backend?

Define and validate the response contract, implement the adapter, handle authentication/server validation independently, and verify failures and lifecycle behaviour. The fixture does not already provide those guarantees.

## 8. How does this connect to the Swift SRP lesson?

Both give independent changes a home. Swift separates guide wording and loading; this example separates form rules, runtime shape and a React publication lifecycle. Compare decisions rather than syntax.
