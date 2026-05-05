# Release candidate readiness

Generated: 2026-05-05T21:30:08Z
Branch: `rc/release-readiness`
Base: `main`

## Verification

Status: PASS

Note: this follow-up PR keeps an open release-readiness review after the earlier `release-candidate/readiness` PR was merged.

Checks run:
- `npm ci`
- `npm run release:check`
- `bash scripts/validate.sh`
- `node releasebox check .`

## Check output summary

    ## npm ci
    ```
    npm ci
    ```
    ```text
    
    up to date, audited 1 package in 244ms
    
    found 0 vulnerabilities
    ```
    RESULT: 0
    
    ## npm run release:check
    ```
    npm run release:check
    ```
    ```text
    
    > tapship@0.1.0 release:check
    > npm test && npm run check && npm run build && npm run smoke && bash scripts/validate.sh && npm pack --dry-run
    
    
    > tapship@0.1.0 test
    > node --test
    
    ✔ parseArgs keeps plan defaults (3.005959ms)
    ✔ parseArgs supports explicit command and flags (0.086833ms)
    ✔ cli writes formula output when requested (73.036792ms)
    ✔ cli validate returns failure for missing formula asset (58.406417ms)
    ✔ runPlanCommand renders human-readable plan output (7.203084ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (1.113792ms)
    ✔ runPlanCommand can emit json payloads (1.15825ms)
    ✔ buildPlan returns expected outputs in dry-run mode (4.471958ms)
    ✔ buildPlan writes generated files when requested (7.982292ms)
    ✔ normalizeRelease derives version and repo defaults (1.323542ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.383208ms)
    ✔ renderFormula includes install stanza (1.381417ms)
    ✔ renderCask includes url and artifact (0.088208ms)
    ✔ renderInstallBlock emits brew commands (0.065458ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (1.526875ms)
    ✔ validateRelease accepts complete all-target fixture (0.921791ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.273292ms)
    ✔ validateRelease rejects invalid schema version (0.1115ms)
    ✔ VERSION is sourced from package metadata (0.602791ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 250.163875
    
    > tapship@0.1.0 check
    > node scripts/check.js
    
    Static checks passed.
    
    > tapship@0.1.0 build
    > node scripts/build.js
    
    Build artifacts refreshed in dist/
    
    > tapship@0.1.0 smoke
    > node scripts/smoke.js
    
    Smoke test passed.
    Checking tapship required files...
    PASS: required file exists: README.md
    PASS: required file exists: AGENTS.md
    PASS: required file exists: CONTRIBUTING.md
    PASS: required file exists: SECURITY.md
    PASS: required file exists: .github/pull_request_template.md
    PASS: required file exists: scripts/validate.sh
    
    Checking tapship required directories...
    PASS: required directory exists: .github
    PASS: required directory exists: docs
    PASS: required directory exists: scripts
    
    Running local project checks where present...
    NOTE: using package manager: npm
    
    > tapship@0.1.0 check
    > node scripts/check.js
    
    Static checks passed.
    PASS: package script: check
    
    > tapship@0.1.0 test
    > node --test
    
    ✔ parseArgs keeps plan defaults (2.002917ms)
    ✔ parseArgs supports explicit command and flags (0.276166ms)
    ✔ cli writes formula output when requested (80.778333ms)
    ✔ cli validate returns failure for missing formula asset (52.277208ms)
    ✔ runPlanCommand renders human-readable plan output (4.51925ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (0.825917ms)
    ✔ runPlanCommand can emit json payloads (0.624833ms)
    ✔ buildPlan returns expected outputs in dry-run mode (5.019542ms)
    ✔ buildPlan writes generated files when requested (11.05975ms)
    ✔ normalizeRelease derives version and repo defaults (0.645416ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.097708ms)
    ✔ renderFormula includes install stanza (0.641625ms)
    ✔ renderCask includes url and artifact (0.075709ms)
    ✔ renderInstallBlock emits brew commands (0.06425ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (0.593375ms)
    ✔ validateRelease accepts complete all-target fixture (0.791042ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.123375ms)
    ✔ validateRelease rejects invalid schema version (0.074208ms)
    ✔ VERSION is sourced from package metadata (0.614125ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 257.437292
    PASS: package script: test
    
    > tapship@0.1.0 build
    > node scripts/build.js
    
    Build artifacts refreshed in dist/
    PASS: package script: build
    NOTE: agent-qc not installed; skipping optional agent check
    
    Validation passed.
    npm notice
    npm notice package: tapship@0.1.0
    npm notice Tarball Contents
    npm notice 1.1kB LICENSE
    npm notice 1.9kB README.md
    npm notice 325B bin/tapship.js
    npm notice 555B docs/FIXTURES.md
    npm notice 703B docs/orchestration.json
    npm notice 855B docs/ORCHESTRATION.md
    npm notice 2.1kB docs/PRD.md
    npm notice 285B docs/README.md
    npm notice 9.6kB docs/release-candidate.md
    npm notice 735B docs/TASKS.md
    npm notice 1.1kB package.json
    npm notice 786B src/cli.js
    npm notice 78B src/index.js
    npm notice 1.4kB src/lib/args.js
    npm notice 672B src/lib/classify.js
    npm notice 2.5kB src/lib/commands.js
    npm notice 2.3kB src/lib/plan.js
    npm notice 410B src/lib/read-input.js
    npm notice 2.0kB src/lib/release.js
    npm notice 571B src/lib/render-cask.js
    npm notice 1.1kB src/lib/render-docs.js
    npm notice 1.0kB src/lib/render-formula.js
    npm notice 526B src/lib/select-assets.js
    npm notice 2.3kB src/lib/validate.js
    npm notice 97B src/lib/version.js
    npm notice Tarball Details
    npm notice name: tapship
    npm notice version: 0.1.0
    npm notice filename: tapship-0.1.0.tgz
    npm notice package size: 11.1 kB
    npm notice unpacked size: 35.0 kB
    npm notice shasum: 25f87aa5b20411ae80adcd9eab66dee15be651e4
    npm notice integrity: sha512-jY/f4opHm0Upv[...]3DDOJXXWv1JmQ==
    npm notice total files: 25
    npm notice
    tapship-0.1.0.tgz
    ```
    RESULT: 0
    
    ## bash scripts/validate.sh
    ```
    bash scripts/validate.sh
    ```
    ```text
    Checking tapship required files...
    PASS: required file exists: README.md
    PASS: required file exists: AGENTS.md
    PASS: required file exists: CONTRIBUTING.md
    PASS: required file exists: SECURITY.md
    PASS: required file exists: .github/pull_request_template.md
    PASS: required file exists: scripts/validate.sh
    
    Checking tapship required directories...
    PASS: required directory exists: .github
    PASS: required directory exists: docs
    PASS: required directory exists: scripts
    
    Running local project checks where present...
    NOTE: using package manager: npm
    
    > tapship@0.1.0 check
    > node scripts/check.js
    
    Static checks passed.
    PASS: package script: check
    
    > tapship@0.1.0 test
    > node --test
    
    ✔ parseArgs keeps plan defaults (1.74625ms)
    ✔ parseArgs supports explicit command and flags (0.078458ms)
    ✔ cli writes formula output when requested (61.7095ms)
    ✔ cli validate returns failure for missing formula asset (52.852625ms)
    ✔ runPlanCommand renders human-readable plan output (7.182792ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (2.591042ms)
    ✔ runPlanCommand can emit json payloads (1.014084ms)
    ✔ buildPlan returns expected outputs in dry-run mode (1.601ms)
    ✔ buildPlan writes generated files when requested (9.383291ms)
    ✔ normalizeRelease derives version and repo defaults (1.125ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.105042ms)
    ✔ renderFormula includes install stanza (0.645333ms)
    ✔ renderCask includes url and artifact (0.075792ms)
    ✔ renderInstallBlock emits brew commands (0.071792ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (0.656667ms)
    ✔ validateRelease accepts complete all-target fixture (0.872541ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.14075ms)
    ✔ validateRelease rejects invalid schema version (0.081042ms)
    ✔ VERSION is sourced from package metadata (1.373209ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 379.68325
    PASS: package script: test
    
    > tapship@0.1.0 build
    > node scripts/build.js
    
    Build artifacts refreshed in dist/
    PASS: package script: build
    NOTE: agent-qc not installed; skipping optional agent check
    
    Validation passed.
    ```
    RESULT: 0
    
    ## ReleaseBox check
    ```
    node '/Users/roger/Developer/my-opensource/releasebox/bin/releasebox.js' check .
    ```
    ```text
    ✅ releasebox config: node-cli
    ✅ ci workflow: .github/workflows/ci.yml
    ✅ release dry run workflow: .github/workflows/release-dry-run.yml
    ✅ task breakdown: docs/TASKS.md
    ✅ orchestration plan: docs/ORCHESTRATION.md
    ✅ dependabot config: .github/dependabot.yml
    ✅ npm test script: node --test
    ✅ build script: node scripts/build.js
    ✅ smoke script: node scripts/smoke.js
    ✅ bin entry: {"tapship":"./bin/tapship.js"}
    ```
    RESULT: 0
    
