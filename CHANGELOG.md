# Changelog

All notable changes to this project will be documented here.

## [Unreleased]

### Changed

- Added a named package smoke script and CI step for npm pack verification.

### Fixed

- Input-file failures (missing file, directory, permission denied, malformed
  JSON, or an omitted `--input`) and unknown commands now exit 1 with a
  single-line actionable message naming the failing path (or the missing option) and the cause instead of leaking
  raw stack traces, and blocked plans still create no output with `--write`.
- Reject blank or syntactically invalid Homebrew renderer overrides before a
  plan can write formula or cask files.
- Formula fixtures may omit an asset binary and use the configured formula
  binary path, while explicit asset paths continue to override the fallback.

### Added

- Local-first CLI for Homebrew formula/cask draft generation.
- Fixture-driven validation for checksums, URLs, and asset naming.
- README install snippet and release checklist generation.
- Deterministic test, build, smoke, and validation scripts.
