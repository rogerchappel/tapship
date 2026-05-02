# tapship Task Breakdown

## Core MVP

- [x] Parse local release metadata fixtures with no network access.
- [x] Validate asset URLs, checksums, and naming expectations.
- [x] Generate Homebrew formula and cask drafts.
- [x] Emit README install snippets and a release checklist.
- [x] Keep write behavior opt-in with dry-run default.

## Quality Gates

- [x] Unit tests for parsing, normalization, validation, rendering, and plan writing.
- [x] CLI smoke test with fixture data.
- [x] `scripts/validate.sh` passes with `npm` scripts.

## Follow-on Ideas

- [ ] Support templated taps with custom maintainers.
- [ ] Add fixture schema versioning for future metadata formats.
- [ ] Generate bottle notes when macOS binary matrices grow.
