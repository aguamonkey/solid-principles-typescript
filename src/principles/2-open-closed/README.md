# Open/Closed Principle (OCP)

## Definition
> Software entities should be open for extension, but closed for modification.

## Why It Matters

The Open/Closed Principle allows systems to grow without breaking existing functionality:
- **Reduces risk**: New features don't modify tested code
- **Improves maintainability**: Existing code remains untouched
- **Enables scalability**: Easy to add new variations
- **Promotes abstraction**: Forces thinking about interfaces

## Signs of OCP Violation

- Adding new features requires modifying existing classes
- Switch statements or if-else chains checking types
- Frequent changes to core business logic
- Copy-pasting code with slight variations

## Example in This Repository

### Bad Example ❌
The `NotificationService` uses switch statements to handle different notification types. Adding a new type requires modifying the existing class.

### Good Example ✅
Uses strategy pattern with `NotificationStrategy` interface. New notification types can be added by creating new classes without modifying existing code.

## Real-World Application

Common patterns that follow OCP:
- Strategy Pattern
- Template Method Pattern
- Observer Pattern
- Decorator Pattern
- Plugin architectures
