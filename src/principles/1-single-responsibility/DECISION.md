# Decision · separate edit rules, data shape and publication

[Lesson](README.md)

## Pressure

Independent requests affect layout, form rules, supplier data and snapshot storage. Failed or obsolete work must not replace useful screen content.

## Decision

Use typed source/storage contracts, a runtime decoder, a pure form validator and a React publication hook. Compose the sample source and memory storage once per mounted demo. Keep rendering in small components.

One protocol per method is not the goal. `useUserData` owns loading and updating together because they share one screen’s publication policy. Its request guard protects both React state and the storage side effect.

## Alternatives

A small all-in-one component can be clearer before independent change pressure exists. Here validation and source replacement provide that pressure. A general service container would add indirection without a demonstrated need; dependencies are passed directly.

A schema library may be useful for larger runtime payloads. A small explicit decoder is adequate for this three-field fixture. The data decoder and form validator remain separate because tightening edit policy must not make old records unreadable.

A browser-storage adapter would need runtime decoding, failure handling and a decision about initial cached reads. The baseline uses memory and does not claim persistent recovery. An async query library could handle richer server-state lifetimes, but is not necessary to explain this small publication boundary.

## Introduction into an existing app

Capture existing output and validation rules first. Extract the pure policy and adapter boundaries without changing behaviour, then test failure and completion order. Decide whether source validation and edit validation share the same requirements. Introduce storage and cached reads separately, with observable failures and a rollback path.

## Provenance

Presentation component scaffolding is reused from the unmerged `final-script` branch (`3ee5588`). Missing hook/source/validation contracts were implemented and verified here. The branch’s completion script and empty lesson entry files were not merged or executed.
