# Foundation solution notes · saved order, failed notification

[Exercise](exercise/README.md) · [Boundary Lab](advanced/README.md)

The foundation exercise is not implemented. Inject a notification fixture that throws. After `createOrder` rejects, query the injected database: the saved order is still present because storage happened first. Test that evidence before changing the result type.

A richer result should distinguish saved-but-notified from saved-but-notification-unconfirmed, and storage failure from acknowledgement uncertainty when the supplier contract allows it. Do not delete or recreate an order merely because notification failed. A production sender can perform an effect before losing its acknowledgement.

Keep the policy dependent on its required abstractions and let composition select fixtures. The advanced lab demonstrates a separate order/outbox design; it does not silently rewrite the foundation to complete your exercise.
