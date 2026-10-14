# Exercise · tighten the edit rule

[Lesson](../README.md) · [Separate solution](../SOLUTION.md)

The contact-form owner now requires edited names to contain at least two non-whitespace characters. Existing one-character names returned by the source must still be readable.

Before editing, identify the owner and explain why a form rule should not silently redefine the source response contract.

Acceptance criteria:

- Saving `A` or a whitespace-only name produces a useful validation notice and makes no update call.
- `Al` is accepted; leading/trailing whitespace is ignored when counting characters. Do not silently rewrite stored fields.
- Existing one-character names can still load and display.
- Email validation and valid updates keep working.
- Supplier, storage and layout need no changes. Update the validator and add behavioural tests.

Run `npm test` and `npm run check`. Write a short note explaining which boundary stayed stable. The stricter name rule is deliberately not implemented in the baseline.
