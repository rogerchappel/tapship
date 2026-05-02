# Fixture Format

tapship expects a local JSON file with these top-level keys:

- `repo`: owner, name, homepage, description, license, and optional tap metadata
- `tagName`: release tag like `v1.2.3`
- `brew`: optional overrides for formula/cask rendering
- `assets`: array of local release asset metadata

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
