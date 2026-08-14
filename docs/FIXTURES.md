# Fixture Format

tapship expects a local JSON file with these top-level keys:

- `schemaVersion`: must be `1`, the only fixture schema currently implemented
- `repo`: owner, name, homepage, description, license, and optional tap metadata
- `tagName`: a SemVer release tag, optionally prefixed with `v` (for example,
  `1.2.3`, `v1.2.3-rc.1`, or `v1.2.3+build.42`)
- `brew`: optional overrides for formula/cask rendering
- `assets`: array of local release asset metadata

Prerelease and build identifiers must be non-empty dot-separated SemVer
identifiers. Numeric prerelease identifiers and the major, minor, and patch
versions cannot contain leading zeroes. Build identifiers may contain leading
zeroes, as allowed by SemVer. Fixture schema versions other than `1` are
rejected until support for a later schema is implemented.

Each asset should include:

- `name`
- `url`
- `sha256`
- `kind`: `formula` or `cask`

Optional asset fields:

- `binary` for formula archives
- `app` for cask app bundles
- `pkg` for cask pkg installers
- `platform` and `arch` for selection hints

For cask assets, `platform: "macos"` also marks the generated cask as
macOS-only, so its output includes Homebrew's `depends_on :macos` stanza.
Generated cask descriptions omit a trailing full stop to satisfy Homebrew cask
style; the source fixture description is otherwise preserved.
