# Solution notes · an explicit v2 adapter

[Exercise](EXERCISE.md)

Add an extension keyed by `{ channel: 'email', version: 2 }`. Decode `recipient` and `title`, validate the same recipient format and nonblank text, then return the existing `DeliveryPreview` fields. Compose it alongside v1.

Do not rename v1 payload fields, guess a missing version or add an email case to `previewBatch`. The new adapter owns v2 meaning. Test identical v1 output, successful v2, invalid v2, unsupported v3, duplicate registration and unchanged webhook outcomes.

Deploy the client adapter before a producer requires v2 readability. Older clients still report unsupported. If every record must be readable, agree a compatible producer format or minimum client version. A plain numeric/string field can change meaning without changing its TypeScript type.

These notes describe the extension; they are not another runnable implementation.
