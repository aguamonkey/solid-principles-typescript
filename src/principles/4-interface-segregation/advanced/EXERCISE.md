# Exercise · a service-only audit consumer

[Lab](README.md) · [Solution notes](SOLUTION.md)

Add an inspection audit view that reads completed tickets and never records an inspection. It must work with a provider that exposes only queue reading: no roster, scheduling or inspection write operation.

Derive a `ServiceQueueReader` requirement from the audit consumer. Reuse that requirement inside the existing inspection desk while retaining its record operation. Keep the existing desk’s read-and-record workflow usable as one cohesive port. Add an audit consumer that returns only inspected tickets, preserving queue order and copying its output records.

Use a fixture exposing only the reader to prove the audit is independent of writes. Test a mixed due/inspected queue, an empty queue and copied projections. Keep existing dispatch and board contracts unchanged. Explain why this newly narrower reader is justified by a real client, while splitting every method preemptively was not necessary.

Run `npm run check`, rebuild and run `npm run test:browser`. The audit consumer and queue-reader split are intentionally not implemented in this milestone.
