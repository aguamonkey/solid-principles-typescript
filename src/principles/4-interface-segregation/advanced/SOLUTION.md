# Solution notes · inspection audit

[Exercise](EXERCISE.md)

These are review notes; the exercise is not implemented.

Extract queue reading into `ServiceQueueReader`. Let `InspectionDesk` extend or compose that reader with `recordInspection`. Existing service providers already have the reader structurally, so their behaviour need not change.

Type the audit policy against `ServiceQueueReader` only. Filter completed tickets in existing order and copy output records. Give its test fixture only `readServiceQueue`; it should not need a write stub. Include a type check showing that this fixture can satisfy the audit but cannot supply the full inspection workflow.

Leave dispatch dependent on roster/scheduling and the board dependent on roster reading. Review whether the new port follows an actual client boundary and whether test fixtures became simpler. Avoid declaring success merely because the interface count increased.

A production audit might require history, identities or durable timestamps that these tickets do not contain. Discuss a separate read model for that requirement rather than claiming a current-state list is an audit trail.
