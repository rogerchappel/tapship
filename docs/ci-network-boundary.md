# CI package and network boundary

Pull-request and `main` CI runs on GitHub-hosted runners. The workflow uses `npm ci` to install the project's lockfile dependencies and runs `npm run release:check`, which includes `npm pack --dry-run` and `npm run package:smoke`. The package smoke test creates a tarball and runs `npm install <local-tarball>` in a temporary directory; npm may contact a registry to resolve/install dependencies if required. These operations are not an offline guarantee or an explicit network allowlist.

CI grants the workflow `contents: read`; it does not grant repository write permissions or run the tag-triggered release workflow. Do not treat read-only GitHub permissions as an npm network restriction. For a strict network policy, enforce egress restrictions at the runner or organization level and verify registry access is limited there.

The package smoke helper reports the failing command and its captured diagnostic so a blocked registry/network operation can be distinguished from package-content or CLI assertion failures. Run `npm run release:check` to exercise it locally; command failures are expected to retain their original nonzero exit status.

## Dependency lifecycle scripts

`npm ci` does not disable dependency lifecycle scripts: npm can run install-related scripts declared by installed dependencies (including `preinstall`, `install`, and `postinstall`) during the CI install. The package smoke step's `npm install <local-tarball>` can likewise run lifecycle scripts from the package and its dependencies. These scripts execute with the permissions of the CI job and may make network requests; the workflow does not impose an egress allowlist. The `contents: read` token permission limits GitHub API/repository access, not process privileges or outbound network access.

Treat dependency and package lifecycle code as executable, untrusted input when reviewing changes. Mitigations include reviewing and pinning dependency changes via the lockfile, minimizing workflow permissions, and using runner- or organization-level egress controls where required. Do not assume npm installation or read-only token permissions provide network isolation.
