# Practise explaining one decision at a time

You do not need to memorise every class. Your aim is to explain a problem, make a useful change, and show why it works.

## Start with a 30-minute session

1. **Read for 10 minutes.** Open the lesson’s Guide, then compare Before and Refactored. Name the problem in one sentence.
2. **Run it for 10 minutes.** Open Demo or the named lab. Change one control and explain the outcome you expected.
3. **Explain for 10 minutes.** Open Study notes and select the interview prompts. Answer aloud before opening answer notes.

Coding exercises deserve a separate session. Take the time needed to implement the change and test it; finishing quickly is not the goal.

## Your first seven sessions

1. **SRP · Change ownership.** Open [Contact desk](../src/principles/1-single-responsibility/README.md). Explain where a new form rule belongs. Try an invalid edit and an offline refresh.
2. **OCP · Extension.** Open [Dispatch room](../src/principles/2-open-closed/README.md). Explain which algorithm stays stable. Add webhook support in Extension Lab and check that email v2 stays unsupported.
3. **LSP · Behavioural promises.** Open [Geometry bench](../src/principles/3-liskov-substitution/README.md). Explain the scaling promise. Compare unavailable and broken successful results in Contract Lab.
4. **ISP · Consumer requirements.** Open [Workshop roster](../src/principles/4-interface-segregation/README.md). Explain the board’s dependency. Use a board provider with no scheduling methods in Capability Lab.
5. **DIP · Dependency direction.** Open [Order counter](../src/principles/5-dependency-inversion/README.md). Explain who owns the supplier contract. Lose a commit acknowledgement in Boundary Lab and inspect the retained order.
6. **Make a change.** Revisit one lesson. Attempt its exercise in your editor, add a behavioural test, and explain which boundary changed.
7. **Rehearse.** Revisit your weakest lesson. Give a five-minute walkthrough without notes, then answer one failure or tradeoff question.

These are sessions, not deadlines. Repeat one before moving on if the reasoning is still unclear. Use the Practice bench for a quick recall check; it does not run coding exercises.

## A useful answer has four parts

- **Problem:** “This consumer relies on a promise that the replacement breaks.”
- **Decision:** “I made the promise explicit and tested the same caller against both implementations.”
- **Evidence:** “Here is the failing example and the behavioural test.”
- **Tradeoff:** “These tests sample behaviour; they do not prove every implementation or input.”

Use your own example and words. You should be able to point to real source and evidence rather than recite the acronym.

## Check your progress

After a session, write three short lines: what changed, what stayed stable, and what risk remains. If you can only repeat the definition, revisit the demo. If you can explain it, attempt a small change. If you can implement and test it, practise defending one alternative.

Keep a personal log outside the reference examples, so your exercises and uncertainty remain visible. There is no automatic score or progress tracking in this workbook.

## For an iOS interview

Repeat the same design question in the [Swift workbook](https://github.com/aguamonkey/SOLID-Principles-with-Swift). Explain how Swift’s type system and concurrency affect the implementation; do not translate TypeScript mechanically.

This repository practises design reasoning. Add separate study sessions for Swift, SwiftUI/UIKit, concurrency, memory management, networking, persistence and real project experience. Completing the workbook does not establish readiness for every mid or senior interview.
