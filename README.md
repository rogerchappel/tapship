# tapship

`tapship` is a local-first CLI that turns release metadata fixtures into Homebrew formula drafts, cask drafts, README install snippets, and a release checklist.

It is designed for maintainers who already have release asset metadata and want a deterministic packaging draft without granting network or publish access.

## What it does

- reads release metadata from a local JSON fixture
- validates asset URLs, checksums, and naming conventions
- generates Homebrew formula and cask drafts
- emits a copy-paste install block for your README
- emits a release checklist for final human review
- stays in dry-run mode unless you pass `--write`

## Quickstart

```sh
npm install
node bin/tapship.js plan --input fixtures/releases/tapship-cli.json
```

## Commands

### Plan

Generate output previews from a local fixture:

```sh
node bin/tapship.js plan \
  --input fixtures/releases/tapship-cli.json \
  --type all
```

Write generated files to a target directory:

```sh
node bin/tapship.js plan \
  --input fixtures/releases/tapship-cli.json \
  --type auto \
  --write \
  --output .tmp/tapship-preview
```

### Validate

Validate a fixture without generating files:

```sh
node bin/tapship.js validate --input fixtures/releases/tapship-cli.json
```

## Generated output

When `--write` is passed, tapship writes files like:

- `Formula/tapship.rb`
- `Casks/tapship.rb`
- `snippets/install.md`
- `snippets/release-checklist.md`

## Example install block

```sh
brew tap rogerchappel/homebrew-tap
brew install tapship
brew install --cask tapship
```

## Safety notes

- No network calls.
- No GitHub API usage.
- No tap pushes.
- No writes outside the requested output directory.
- Dry-run by default.

## Verification

```sh
npm test
bash scripts/validate.sh
npm run check
npm run build
npm run smoke
```

## Docs

- [PRD](docs/PRD.md)
- [Tasks](docs/TASKS.md)
- [Orchestration](docs/ORCHESTRATION.md)

## License

MIT
