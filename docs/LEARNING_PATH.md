# Study one decision at a time

[Repository](../README.md)

1. Start with [Contact desk](../src/principles/1-single-responsibility/README.md). Run it, follow the source, then attempt its form-rule exercise before reading the solution.
2. Explain the owner of each change aloud. Compare form validation with source data shape and display.
3. Continue through the other four connected foundation demos. Their exercises now state a concrete pressure; OCP also includes a separate versioned extension lab; LSP adds a separate scaling contract lab; ISP adds a consumer capability lab; the deeper DIP track remains future work.
4. Use the Practice bench to recall a decision before opening the guide. Implement exercises in your editor and verify them with tests.

## Cross-language study

The Swift reference is [SOLID Principles with Swift](https://github.com/aguamonkey/SOLID-Principles-with-Swift). Keep shared design questions and acceptance behaviours, while using each language’s conventions. TypeScript adds runtime validation and React effect lifetimes; translating Swift classes mechanically is not the objective.

A later Python/Rust series can reuse the challenges. Those repositories are not created by this milestone.

## Track status

- **SRP:** runnable foundation, failure/lifecycle tests, source walkthrough, concrete exercise, solution, decision and interview notes.
- **OCP:** foundation plus [versioned dispatch lab](../src/principles/2-open-closed/advanced/README.md), decision, separate exercise/solution and interview notes.
- **LSP:** foundation plus [geometry contract lab](../src/principles/3-liskov-substitution/advanced/README.md), shared behavioural tests, numeric domain, decision, separate exercise/solution and interview notes.
- **ISP:** foundation plus [workshop capability lab](../src/principles/4-interface-segregation/advanced/README.md), narrow providers, consumer tests, decision, separate audit exercise/solution and interview notes.
- **DIP:** connected source and runnable foundation demos, focused behavioural tests and concrete exercises. Deeper documentation and advanced progressions remain to be built.

The stages are foundation → reliable feature behaviour → system contracts and migration. They describe reasoning scope, not fixed job titles or abstraction counts.
