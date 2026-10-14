# Foundation solution notes · dimension invariants

[Exercise](exercise/README.md) · [Contract Lab](advanced/README.md)

The exercise is not implemented in the foundation. Define finite positive dimensions and finite positive area/perimeter before changing the classes. Check computed measurements: positive dimensions alone do not rule out numeric overflow or underflow.

Reject invalid construction before an instance escapes. For a mutable setter, validate the complete proposed next state before assignment so a rejected update leaves previous measurements unchanged. Test this preservation directly.

Do not restore Rectangle/Square inheritance while adding checks: validation does not fix the incompatible setter meanings. Run one shared area/perimeter suite against each valid shape and test each type’s construction boundaries. The advanced lab introduces a different immutable scaling contract; it does not silently complete these foundation changes for you.
