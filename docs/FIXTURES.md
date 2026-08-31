# Fixture Format

tapship expects a local JSON file with these top-level keys:

- `schemaVersion`: must be `1`, the only fixture schema currently implemented
- `repo`: owner, name, homepage, description, license, and optional tap metadata
- `tagName`: a SemVer release tag, optionally prefixed with `v` (for example,
  `1.2.3`, `v1.2.3-rc.1`, or `v1.2.3+build.42`)
- `brew`: optional overrides for formula/cask rendering

## Field types

Renderer inputs are validated before Tapship creates a plan or writes files.
`repo.owner` and `repo.name` are required non-empty strings. When present,
`repo.homepage`, `repo.description`, `repo.license`, `repo.tap.owner`, and
`repo.tap.name` must be strings; `repo.tap` must be an object.

`brew` must be an object when present. Its formula/cask names and commands
(`formulaClass`, `formulaBinary`, `caskToken`, `caskApp`, `caskBinary`, and
`testCommand`) must be strings. `caveats` must also be a string when present.
`dependencies` must be an array of non-empty strings. `livecheck`, when
present, must be an object with a non-empty string `url`.

For formula releases, `brew.testCommand` is the command invoked by the
generated Homebrew `test do` block. Write it as the installed formula binary
followed by any arguments (for example, `tapship doctor --quiet`); Tapship
resolves that binary from Homebrew's `bin` directory. When omitted, the
command defaults to `<repo.name> --version`.
- `assets`: array of local release asset metadata

Prerelease and build identifiers must be non-empty dot-separated SemVer
identifiers. Numeric prerelease identifiers and the major, minor, and patch
versions cannot contain leading zeroes. Build identifiers may contain leading
zeroes, as allowed by SemVer. The `schemaVersion` key must be present. Missing
schema versions and fixture schema versions other than `1` are rejected until
support for a later schema is implemented.

Each asset should include:

- `name`: non-empty string
- `url`: non-empty HTTPS string
- `sha256`: string containing a lowercase SHA-256 digest
- `kind`: non-empty string, normally `formula` or `cask`

Optional asset fields:

- `binary` for formula archives when the executable path inside the archive
  differs from `brew.formulaBinary`; the formula binary defaults to
  `repo.name`, and an explicit asset value overrides that fallback
- `app` for cask app bundles
- `pkg` for cask pkg installers
- `platform` and `arch` for selection hints

Every optional asset field above must be a non-empty string when present.
Malformed fields produce field-specific validation errors for `validate`,
`plan`, and `plan --write`; blocked write plans create no output files.

For cask assets, `platform: "macos"` also marks the generated cask as
macOS-only, so its output includes Homebrew's `depends_on :macos` stanza.
Generated cask descriptions omit a trailing full stop to satisfy Homebrew cask
style; the source fixture description is otherwise preserved.
