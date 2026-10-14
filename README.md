# SOLID principles · TypeScript & React

A workbook for practising five design questions through source, local demonstrations and small changes. Start with a lesson, run its demo, then attempt the exercise before reading a solution.

| Lesson | Setting | Design question |
| --- | --- | --- |
| [01 · Single Responsibility](src/principles/1-single-responsibility/README.md) | Contact desk | Where should this change belong? |
| [02 · Open/Closed](src/principles/2-open-closed/README.md) | Dispatch room | Which algorithm stays stable when we add a channel? |
| [03 · Liskov Substitution](src/principles/3-liskov-substitution/README.md) | Geometry bench | Does the replacement keep the caller’s promise? |
| [04 · Interface Segregation](src/principles/4-interface-segregation/README.md) | Workshop roster | What does this consumer actually need? |
| [05 · Dependency Inversion](src/principles/5-dependency-inversion/README.md) | Order counter | Can the supplier change independently of the policy? |

## Run locally

Use Node.js **22.12 or newer** and npm. CI uses Node 22. The Vite 7 toolchain no longer supports the original README’s Node 16 requirement.

```bash
git clone https://github.com/aguamonkey/solid-principles-typescript.git
cd solid-principles-typescript
npm ci
npm run dev
```

Open the URL printed by Vite. Production assets use `/solid-principles-typescript/`; hash routing keeps direct lesson links working on static hosting. This milestone does not deploy a website.

## Contact desk

<img src="docs/images/contact-desk.png" alt="The running Contact desk lesson, with a loaded profile, editable fields and source controls." width="620">
<img src="docs/images/contact-desk-mobile.png" alt="Contact desk on a narrow mobile viewport." width="230">
<img src="docs/images/contact-desk-dark.png" alt="Contact desk in dark appearance." width="620">

Actual Chromium screenshots from production browser tests. The workbook uses ruled paper, serif headings and an indexed navigation rather than generic marketing cards.

## Dispatch room · extension contracts

<img src="docs/images/dispatch-lab-desktop.png" alt="The versioned dispatch lab after adding webhook support, showing ready, unsupported and rejected outcomes." width="620">
<img src="docs/images/dispatch-lab-dark.png" alt="The dispatch compatibility lab in dark appearance." width="620">

The Extension Lab previews a bundled batch through exact channel/version registrations. No email or webhook request is sent. Desktop, mobile and dark behaviour is covered by browser tests.

## Geometry bench · substitution contracts

<img src="docs/images/geometry-lab-desktop.png" alt="The geometry lab catches a structurally valid adapter returning incorrect scaled area." width="620">
<img src="docs/images/geometry-lab-mobile.png" alt="The geometry contract lab on a narrow mobile viewport." width="230">
<img src="docs/images/geometry-lab-dark.png" alt="The geometry contract lab showing the broken adapter in dark appearance." width="620">

The Contract Lab distinguishes a successful replacement, permitted unavailability and broken behaviour. The same caller checks every implementation; no class-specific judgement is added to the inspector.

## Workshop roster · consumer capabilities

<img src="docs/images/workshop-lab-desktop.png" alt="The workshop lab maps each consumer to its required operations and records an inspection." width="620">
<img src="docs/images/workshop-lab-mobile.png" alt="The workshop capability lab on a narrow mobile viewport." width="230">
<img src="docs/images/workshop-lab-dark.png" alt="The workshop capability lab in dark appearance." width="620">

The Capability Lab compares a read-only board, shift dispatch and a cohesive inspection desk. Dedicated providers demonstrate that unrelated operations are not required. Narrow types describe dependencies; they do not enforce permissions.

## Order counter · supplier boundaries

<img src="docs/images/order-lab-desktop.png" alt="The order lab retains a recorded order and pending receipt after queue acknowledgement fails." width="620">
<img src="docs/images/order-lab-mobile.png" alt="The order boundary lab on a narrow mobile viewport." width="230">
<img src="docs/images/order-lab-dark.png" alt="The order boundary lab in dark appearance." width="620">

The Boundary Lab separates order acceptance from receipt processing. Replay avoids another order; a lost processing acknowledgement can still repeat a supplier effect. All previews and storage remain local memory.

## How to study

Start with the [simple interview study plan](docs/INTERVIEW_PREP.md), available in the app’s **Study plan** page. Follow the [learning path](docs/LEARNING_PATH.md). SRP now includes a concrete exercise, separate solution, decision record and interview prompts. OCP adds a [versioned dispatch lab](src/principles/2-open-closed/advanced/README.md), separate compatibility exercise/solution and decision/interview notes. LSP adds a [geometry contract lab](src/principles/3-liskov-substitution/advanced/README.md) with shared behavioural tests, decision notes and a separate triangle exercise. ISP adds a [workshop capability lab](src/principles/4-interface-segregation/advanced/README.md), narrow provider tests, an audit exercise and interview notes. DIP adds an [order boundary lab](src/principles/5-dependency-inversion/advanced/README.md), replay and acknowledgement-failure tests, a deduplication exercise and interview notes. All five lessons now include a documented study progression.

The **Study notes** section keeps each lesson’s guides, decisions, exercises, solutions and interview prompts inside the app. Links between study documents open the corresponding notes; source-code and heading-fragment links still open GitHub. The Before and Refactored sections display actual checked-in source. The Demo section mounts the local implementation. The Practice bench provides recall questions and links to exercises; it does **not** compile or execute arbitrary TypeScript. Use your editor and repository tests for coding exercises.

The examples use different settings from the [Swift series](https://github.com/aguamonkey/SOLID-Principles-with-Swift), while sharing design questions. More interfaces or classes do not automatically make a design better.

## Verification

```bash
npm run check          # Types, enforced lint, docs, unit/component tests, production build
npx playwright install chromium
npm run test:browser   # Production build must already exist
```

The focused suites contain **128 unit/component tests, four documentation-tooling tests and twenty-eight Chromium browser tests**. Browser checks cover all five demos, direct lesson reloads, guided practice, a narrow viewport and dark appearance. SRP tests include validation, runtime decoding, failure retention, obsolete work, unmounting, storage failure and StrictMode cleanup.

CI repeats these checks with Node 22 and uploads browser results on failure. No test claims to prove SOLID compliance in every context. The documentation checker covers local inline links, images and Markdown heading fragments; it does not check external URL availability or reference-style links. See [contributing](CONTRIBUTING.md) for screenshot and review expectations.

## Scope

These are local teaching fixtures. There are no real account, payment, notification or database services. SRP snapshot storage is session memory. The examples and browser tests do not constitute a security review, a full accessibility audit or support for every browser. The intentionally coupled Before examples retain unsafe patterns for comparison; lint exceptions are restricted to those files.

## Licence

[MIT](LICENSE)
