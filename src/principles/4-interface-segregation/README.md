# Interface Segregation Principle (ISP)

## Definition
> Clients should not be forced to depend on interfaces they do not use.

## Why It Matters

ISP promotes lean, focused interfaces:
- **Reduces coupling**: Clients only depend on what they need
- **Improves clarity**: Interfaces have clear, specific purposes
- **Prevents bloat**: No unnecessary method implementations
- **Enhances flexibility**: Easier to implement and test

## Signs of ISP Violation

- Interfaces with many methods
- Implementing classes with empty/throwing methods
- Interfaces trying to serve multiple client types
- Methods that only some implementations actually use
- "Fat" interfaces that do too much

## Example in This Repository

### Bad Example ❌
`Worker` interface forces all workers to implement methods they don't need (robots don't eat, humans don't need charging).

### Good Example ✅
Segregated interfaces (`Workable`, `Eatable`, `Chargeable`) that can be composed as needed.

## Real-World Application

Common patterns following ISP:
- Role interfaces
- Capability interfaces
- Single-method interfaces
- Interface composition
- Mixin patterns
