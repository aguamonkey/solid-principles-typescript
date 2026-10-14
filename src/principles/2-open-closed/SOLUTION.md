# Foundation solution · add a local inbox strategy

[Exercise](exercise/README.md) · [Lesson](README.md)

Implement `NotificationStrategy` with an `inbox` key and a local receipt from `send`. Register it at composition and add its button to the demo’s choices. Keep the service lookup unchanged.

Test the new receipt, an unknown key and duplicate registration. The interface does not send anything itself; real infrastructure belongs to a concrete adapter. For payload evolution rather than another synchronous strategy, continue with the separate [advanced lab](advanced/README.md).
