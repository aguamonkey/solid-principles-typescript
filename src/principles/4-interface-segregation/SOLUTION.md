# Foundation solution notes · inspection capability

[Exercise](exercise/README.md) · [Capability Lab](advanced/README.md)

The foundation exercise is not implemented. Introduce an `Inspectable` capability for the new inspection consumer and use a fixture with only `inspect()`. That fixture should not need work, eat, charge or sleep stubs.

Choose which workers support inspection from the domain’s requirements, then pass only those implementations into the inspection consumer. Preserve the existing feeding and charging functions and test their original behaviour. Avoid making every worker add a placeholder method to satisfy a larger interface.

The advanced lab’s asset/ticket desk is a separate example with two related operations. Both examples follow client needs; neither establishes a universal rule that every interface must have one method.
