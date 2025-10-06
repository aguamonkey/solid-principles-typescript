# Liskov Substitution Principle (LSP)

## Definition
> Objects of a superclass should be replaceable with objects of its subclasses without breaking the application.

## Why It Matters

LSP ensures that inheritance hierarchies are semantically correct:
- **Prevents surprises**: Subclasses behave as expected
- **Enables polymorphism**: Can use base class references safely
- **Improves reliability**: No unexpected behavior from substitutions
- **Maintains contracts**: Subclasses honor parent class promises

## Signs of LSP Violation

- Subclass throws exceptions for inherited methods
- Empty method implementations in subclasses
- Type checking before calling methods
- Subclass strengthens preconditions or weakens postconditions
- "Is-a" relationship doesn't truly hold

## Example in This Repository

### Bad Example ❌
`Square` extends `Rectangle` but violates LSP because changing width also changes height, breaking rectangle's expected behavior.

### Good Example ✅
Uses `Shape` interface with proper implementations that maintain expected behaviors for each shape type.

## Real-World Application

Common LSP violations to avoid:
- Square/Rectangle problem
- Birds that can't fly
- Read-only collections throwing on write operations
- Employees that don't fit all employee behaviors
