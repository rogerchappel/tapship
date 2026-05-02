# Agent Operating Instructions for tapship

## Project Context

- Project: `tapship`
- Repository: `https://github.com/rogerchappel/tapship`
- Primary maintainer: `Roger Chappel`
- Default branch: `main`
- Package manager: `npm`
- Primary verification command: `bash scripts/validate.sh`

## Working norms

- Keep changes local-first and deterministic.
- Treat generated Homebrew files as review artifacts, not publish-ready truth.
- Prefer fixture updates plus tests whenever generation behavior changes.
- Keep dry-run as the default user experience.

## Safe change areas

- CLI parsing and output formatting
- fixture schema extensions
- formula/cask rendering
- tests, docs, and validation scripts

## Ask first before changing

- network behavior
- publish behavior
- credential handling
- destructive file operations outside the chosen output directory

## Review checklist

Before finishing a change, include:

1. verification commands run
2. affected fixtures
3. any behavior changes in generated Homebrew output
4. rollback notes if templates changed
