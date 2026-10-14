# Study one decision at a time

[Repository](../README.md) · [Simple interview study plan](INTERVIEW_PREP.md)

1. Start with [Contact desk](../src/principles/1-single-responsibility/README.md). Run it, follow the source, then attempt its form-rule exercise before reading the solution.
2. Explain the owner of each change aloud. Compare form validation with source data shape and display.
3. Continue through the other four connected foundation demos. Their exercises now state a concrete pressure; OCP also includes a separate versioned extension lab; LSP adds a separate scaling contract lab; ISP adds a consumer capability lab; DIP adds an order boundary lab with replay and uncertain acknowledgements.
4. Open Study notes for local decision records, interview prompts and separate answer notes. Use the Study document selector to move between foundation and advanced material.
5. Use the Practice bench to recall a decision before opening the guide. Implement exercises in your editor and verify them with tests.

## Cross-language study

The Swift reference is [SOLID Principles with Swift](https://github.com/aguamonkey/SOLID-Principles-with-Swift). Keep shared design questions and acceptance behaviours, while using each language’s conventions. TypeScript adds runtime validation and React effect lifetimes; translating Swift classes mechanically is not the objective.

A later Python/Rust series can reuse the challenges. Those repositories are not created by this milestone.

## Track status

- **SRP:** runnable foundation, failure/lifecycle tests, source walkthrough, concrete exercise, solution, decision and interview notes.
- **OCP:** foundation plus [versioned dispatch lab](../src/principles/2-open-closed/advanced/README.md), decision, separate exercise/solution and interview notes.
- **LSP:** foundation plus [geometry contract lab](../src/principles/3-liskov-substitution/advanced/README.md), shared behavioural tests, numeric domain, decision, separate exercise/solution and interview notes.
- **ISP:** foundation plus [workshop capability lab](../src/principles/4-interface-segregation/advanced/README.md), narrow providers, consumer tests, decision, separate audit exercise/solution and interview notes.
- **DIP:** foundation plus [order boundary lab](../src/principles/5-dependency-inversion/advanced/README.md), policy-owned ports, local order/outbox records, replay/failure tests, decision, separate exercise/solution and interview notes.

The stages are foundation → reliable feature behaviour → system contracts and migration. They describe reasoning scope, not fixed job titles or abstraction counts.

## A simple interview study session

Pick one lesson. Spend ten minutes following the source, ten minutes making one exercise change, and five minutes explaining it aloud. Answer these three questions: what promise stayed stable, what test demonstrates it, and what limitation still matters? Read the answer notes after your explanation.

Start with SRP change ownership, then OCP extension, LSP behavioural promises, ISP consumer requirements and DIP dependency direction. Revisit a previous lesson without its notes to check recall. These exercises practise design reasoning; they are not a substitute for wider language, platform and interview preparation.
