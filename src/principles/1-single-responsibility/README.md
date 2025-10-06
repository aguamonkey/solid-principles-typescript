# Single Responsibility Principle (SRP)

## Definition
> A class should have only one reason to change.

## Why It Matters

The Single Responsibility Principle ensures that each class or component has a single, well-defined purpose. This makes code:
- **Easier to understand**: Each piece has one clear job
- **Easier to test**: Single responsibility = focused tests
- **Easier to maintain**: Changes affect only one aspect
- **More reusable**: Focused components can be used in different contexts

## Signs of SRP Violation

- A class has multiple reasons to change
- Methods seem unrelated to each other
- The class name contains "and", "or", "manager", "processor"
- Hard to describe what the class does without using "and"

## Example in This Repository

### Bad Example ❌
The `UserProfile` component handles:
- User data display
- API calls
- Form validation
- Local storage management

### Good Example ✅
Responsibilities are separated:
- `UserProfile`: Display only
- `useUserData`: API calls
- `UserValidator`: Validation logic
- `StorageService`: Local storage operations

## Real-World Application

In a React application, SRP often means:
- Components handle presentation
- Hooks handle state and side effects
- Services handle business logic
- Utilities handle pure functions
