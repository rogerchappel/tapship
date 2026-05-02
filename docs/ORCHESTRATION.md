# tapship Orchestration

This repo is intentionally small and local-first. The orchestration model keeps the workflow deterministic.

## Pipeline

1. Read a local JSON release fixture.
2. Normalize repo, version, and brew-specific metadata.
3. Classify formula-compatible and cask-compatible assets.
4. Validate checksum presence, HTTPS URLs, and naming conventions.
5. Render formula, cask, install snippet, and release checklist outputs.
6. Write generated files only when `--write` is passed.

## Safety Defaults

- No network fetches.
- No git pushes.
- No Homebrew publishing.
- No writes outside the requested output directory.

## Human Review Points

- Confirm asset URLs point at the intended release.
- Confirm cask artifact paths match the packaged app or pkg payload.
- Confirm README install instructions match the tap name you actually own.
