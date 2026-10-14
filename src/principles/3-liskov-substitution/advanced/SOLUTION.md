# Solution notes · right triangle

[Exercise](EXERCISE.md)

These are review notes; the exercise is not implemented.

Keep the legs inside the triangle, measure using the stated units, and check the resulting measurements as well as the legs. Two valid input numbers can still produce an infinite or zero result through floating-point overflow or underflow.

Build the scaled instance before returning a successful outcome. Translate the known representability failure into unavailable; do not silently turn arbitrary programming exceptions into routine absence. Reject an invalid factor before scaling.

Use a triangle factory in the existing shared suite. The same caller should observe area × k², perimeter × k, a stable original and stable returned measurements. Compare using the contract’s relative tolerance. Do not patch the inspector to recognise triangles: that would conceal an adapter failing the abstraction.

For a code review, show one enlargement, one reduction, a boundary failure and preserved original measurements. Discuss the practical numeric domain and whether a production consumer actually needs the weaker contract that allows absence.
