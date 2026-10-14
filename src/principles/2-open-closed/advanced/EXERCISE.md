# Exercise · support email version 2

[Lesson](README.md) · [Separate solution](SOLUTION.md)

The producer adds email v2 with `recipient` and `title` instead of `to` and `subject`. Support both versions through the same batch algorithm and display projection.

Acceptance criteria:

- Email v1 produces identical previews.
- A new email v2 adapter validates recipient format and nonblank title.
- Register v1 and v2 together; duplicate v2 registration still fails.
- The existing future-version record becomes ready, while its ID/order are preserved.
- Bad v2 payloads are rejected. Version 3 remains unsupported, even with v1-shaped data.
- Webhook behaviour remains unchanged. Neither the batch loop nor report view gains an email-version branch.
- Add compatibility tests and explain how older clients and producers can deploy independently.

The baseline deliberately supports only email v1. Write down the expected change list before coding.
