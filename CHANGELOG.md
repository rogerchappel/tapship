# Changelog

All notable changes to this project will be documented here.

## [Unreleased]

### Changed

- Added a named package smoke script and CI step for npm pack verification.

### Fixed

- Formula fixtures may omit an asset binary and use the configured formula
  binary path, while explicit asset paths continue to override the fallback.

### Added

- Local-first CLI for Homebrew formula/cask draft generation.
- Fixture-driven validation for checksums, URLs, and asset naming.
- README install snippet and release checklist generation.
- Deterministic test, build, smoke, and validation scripts.
