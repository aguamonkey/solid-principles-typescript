# Exercise · a right triangle with the same promise

[Lab](README.md) · [Solution notes](SOLUTION.md)

Implement a `MeasuredRightTriangle` with two immutable, finite positive legs, in centimetres. Its area is `a × b / 2`; perimeter is `a + b + Math.hypot(a, b)`. Reject construction if either leg or a resulting measurement is invalid or unrepresentable.

Scaling creates another triangle with both legs multiplied by the factor. Reject invalid factors at the adapter boundary. Valid factors that produce unrepresentable dimensions or measurements return unavailable with a useful reason.

Add the triangle to the same shared contract cases at factors 2 and 0.5. Check repeated operations, original preservation, invalid construction and overflow/underflow. Add it to the lab’s composition without editing `inspectScaling` or introducing a triangle branch in the report view.

Before coding, explain why merely adding a strategy is an OCP concern, while demonstrating that successful results preserve the caller’s promises is the LSP concern here. Run `npm run check`, rebuild and run `npm run test:browser`.

The triangle is intentionally not implemented in the checked-in lab.
