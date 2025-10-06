# Dependency Inversion Principle (DIP)

## Definition
> High-level modules should not depend on low-level modules. Both should depend on abstractions.
> Abstractions should not depend on details. Details should depend on abstractions.

## Why It Matters

DIP creates flexible, testable architectures:
- **Enables testing**: Can inject mock implementations
- **Reduces coupling**: Changes to implementations don't affect high-level code
- **Improves flexibility**: Easy to swap implementations
- **Facilitates mocking**: Essential for unit testing

## Signs of DIP Violation

- Direct instantiation of dependencies with `new`
- Tight coupling to specific implementations
- Hard-to-test code due to concrete dependencies
- Importing concrete classes instead of interfaces
- Unable to swap implementations easily

## Example in This Repository

### Bad Example ❌
`OrderService` directly creates and depends on `EmailService` and `MySQLDatabase` concrete classes.

### Good Example ✅
`OrderService` depends on `NotificationService` and `Database` interfaces, with implementations injected.

## Real-World Application

Common patterns following DIP:
- Dependency Injection
- Inversion of Control containers
- Repository pattern
- Service interfaces
- Plugin architectures
