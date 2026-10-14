# 01 · Single Responsibility / Contact desk

[Repository](../../../README.md) · [Exercise](exercise/README.md) · [Decision](DECISION.md) · [Interview prompts](INTERVIEW.md)

A contact desk needs to load a profile, validate edits, retain useful details when its source fails, and display the result. An editor changing the layout should not have to change validation or source access.

Run `npm run dev`, choose **Single Responsibility**, then **Demo**. Edit Morgan’s name or email and save. An invalid email is rejected before the source is called. Select **Sample source offline**, then refresh: the last loaded profile stays visible. Restore the source and refresh to clear the warning.

This is a local fixture. There is no account backend, browser persistence, real email verification or authentication. The demo’s memory snapshot lasts for that component session. Leaving the Demo section and returning starts a new sample session.

## Before: independent decisions meet in the component

The [before profile](bad-example/UserProfile.tsx) contains fetching, browser storage, validation, updates and presentation. Its `/api/user` calls are illustrative; that backend is not provided. It is shown as source, not mounted as a working backend demo.

## Refactored: give changes a home

| Change request | Owner |
| --- | --- |
| Change supplied data or transport | `UserApi` / `SampleUserApi` |
| Change accepted runtime response shape | `parseUser` in `userCodec.ts` |
| Change contact-form rules | `userValidator` |
| Change snapshot storage | `UserStorage` / `MemoryUserStorage` |
| Change loading, failure and publication | `useUserData` |
| Change fields, layout or notices | `UserProfile` and presentation components |

A hook can own several related operations. Loading, cancellation and retaining the last successful result are one publication policy. SRP is not a method-count rule, nor does a name like “manager” prove a violation. The boundary should respond to a concrete source of change.

The hook accepts dependencies. The demo composes them once with React state, so a render does not accidentally replace the source or storage. This matters because dependency replacement restarts the effect. React’s [effect cleanup guidance](https://react.dev/learn/synchronizing-with-effects#fetching-data) discusses aborting work or ignoring obsolete results.

## Behavioural contract

- Form validation runs before updates reach the source. Name must be nonblank; email must satisfy the fixture’s basic format rule.
- Runtime data is `unknown` until decoded. A valid response has string identity, name and email; unrelated fields are discarded. `null` is a successful empty result.
- Loaded data remains visible during refresh. Failure keeps that data and shows a generic notice rather than raw transport details.
- Each operation aborts its predecessor. Request identity and abort checks prevent late content, warnings or storage writes, even if a source ignores cancellation.
- A successful update acknowledgement must identify the edited profile. This does not require the source to return identical fields; normalisation is permitted.
- If snapshot storage fails after a successful response, the received profile remains visible and the notice identifies the storage boundary. It does not pretend the source operation failed.
- Unmount aborts current work. StrictMode’s extra setup/cleanup cycle remains supported.

The memory snapshot is write-only from the hook’s perspective; the baseline does not load cached content before a source request. Cancellation prevents publication, not guaranteed termination of an uncooperative supplier. Client validation is not server authorisation.

## Read the source

1. [User.ts](good-example/types/User.ts): readonly identity and fields.
2. [userCodec.ts](good-example/services/userCodec.ts): runtime boundary checks, independent of future form-specific rules.
3. [userValidator.ts](good-example/services/userValidator.ts): contact-form policy without React or transport.
4. [userApi.ts](good-example/services/userApi.ts): source contract and offline sample.
5. [storageService.ts](good-example/services/storageService.ts): consumer-shaped snapshot interface and memory fixture.
6. [useUserData.ts](good-example/hooks/useUserData.ts): follow the guard after each awaited response.
7. [UserProfile.tsx](good-example/UserProfile.tsx): presentation and explicit demo composition.
8. [Tests](SingleResponsibility.test.tsx): contract evidence, not assertions that abstractions merely exist.

## Study it

Explain where a new email rule belongs, then attempt the [name-rule exercise](exercise/README.md) before reading the [solution](SOLUTION.md). Answer the [interview questions](INTERVIEW.md) aloud.

This foundation adds reliable feature behaviour without claiming a production account system. An advanced progression can add multiple consumers, cache freshness and a migration decision. Those scenarios are not yet implemented here.
