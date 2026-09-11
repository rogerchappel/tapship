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

### Fixture contract

Fixtures are JSON objects with `schemaVersion: 1`, a `repo` object containing
non-empty `owner` and `name` fields, an optional `brew` object, a SemVer
`tagName`, and an `assets` array. Every asset must be an object with a non-empty
`name`, an HTTPS `url`, and a lowercase 64-character `sha256`; packaging fields
such as `binary`, `app`, `pkg`, `kind`, and `platform` are optional.
For a formula asset, omitting `binary` installs the path named by
`brew.formulaBinary`, which defaults to `repo.name`; an asset-level `binary`
selects a different path from inside the archive.

```json
{
  "schemaVersion": 1,
  "repo": { "owner": "example", "name": "tool" },
  "tagName": "v1.2.3",
  "assets": [
    {
      "name": "tool-v1.2.3-darwin-arm64.tar.gz",
      "url": "https://example.com/tool-v1.2.3-darwin-arm64.tar.gz",
      "sha256": "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef"
    }
  ]
}
```

Malformed container shapes and asset entries are reported with field-specific
validation errors before any plan output is generated.

## Generated output

When `--write` is passed and validation succeeds, tapship writes files like:

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
- `--input`, `--type`, and `--output` require values; another option is not accepted as a value.
- Input-file failures (missing file, directory, permission denied, malformed JSON, or an omitted `--input`) and unknown commands exit 1 with a single-line message naming the failing path (or the missing option) and the cause; no stack trace is printed and `--write` creates no output.
- Invalid `--type` values fail before planning; accepted values are `auto`, `formula`, `cask`, and `all`.
- Failed validation never creates the requested output directory or files, even with `--write`.
- Dry-run by default.

## Verification

```sh
npm test
bash scripts/validate.sh
npm run check
npm run build
npm run smoke
npm run package:smoke
```

## Docs

- [PRD](docs/PRD.md)
- [Tasks](docs/TASKS.md)
- [Orchestration](docs/ORCHESTRATION.md)

## License

MIT

## Release check

Before publishing or handing a branch to automation, run:

```bash
npm run release:check
```

This runs the project verification scripts, including an npm package smoke that
installs the tarball and renders a fixture-backed Homebrew plan through the
published CLI.
