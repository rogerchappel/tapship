# Release candidate readiness

Generated: 2026-05-05T21:28:12Z
Branch: `release-candidate/readiness`
Base: `main`

## Verification

Status: PASS

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
    
    up to date, audited 1 package in 107ms
    
    found 0 vulnerabilities
    ```
    RESULT: 0 (0s)
    
    ## npm run release:check
    ```
    npm run release:check
    ```
    ```text
    
    > tapship@0.1.0 release:check
    > npm test && npm run check && npm run build && npm run smoke && bash scripts/validate.sh && npm pack --dry-run
    
    
    > tapship@0.1.0 test
    > node --test
    
    ✔ parseArgs keeps plan defaults (3.577333ms)
    ✔ parseArgs supports explicit command and flags (2.978ms)
    ✔ cli writes formula output when requested (106.455875ms)
    ✔ cli validate returns failure for missing formula asset (70.568ms)
    ✔ runPlanCommand renders human-readable plan output (5.083667ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (1.213875ms)
    ✔ runPlanCommand can emit json payloads (1.972708ms)
    ✔ buildPlan returns expected outputs in dry-run mode (3.37375ms)
    ✔ buildPlan writes generated files when requested (12.938875ms)
    ✔ normalizeRelease derives version and repo defaults (0.780833ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.179292ms)
    ✔ renderFormula includes install stanza (0.739917ms)
    ✔ renderCask includes url and artifact (0.087917ms)
    ✔ renderInstallBlock emits brew commands (0.944375ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (3.648375ms)
    ✔ validateRelease accepts complete all-target fixture (2.772375ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.1845ms)
    ✔ validateRelease rejects invalid schema version (0.086666ms)
    ✔ VERSION is sourced from package metadata (1.578625ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 394.851292
    
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
    
    ✔ parseArgs keeps plan defaults (2.691166ms)
    ✔ parseArgs supports explicit command and flags (0.185416ms)
    ✔ cli writes formula output when requested (82.815334ms)
    ✔ cli validate returns failure for missing formula asset (64.364916ms)
    ✔ runPlanCommand renders human-readable plan output (6.777917ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (0.764292ms)
    ✔ runPlanCommand can emit json payloads (0.91175ms)
    ✔ buildPlan returns expected outputs in dry-run mode (4.955667ms)
    ✔ buildPlan writes generated files when requested (5.554958ms)
    ✔ normalizeRelease derives version and repo defaults (1.769917ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.240208ms)
    ✔ renderFormula includes install stanza (7.091042ms)
    ✔ renderCask includes url and artifact (0.567166ms)
    ✔ renderInstallBlock emits brew commands (0.418667ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (1.430458ms)
    ✔ validateRelease accepts complete all-target fixture (2.011166ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.697708ms)
    ✔ validateRelease rejects invalid schema version (0.480375ms)
    ✔ VERSION is sourced from package metadata (0.866042ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 425.7125
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
    npm notice 9.3kB docs/release-candidate.md
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
    npm notice package size: 11.0 kB
    npm notice unpacked size: 34.7 kB
    npm notice shasum: 6dc34f811e2cb32f7bac9298ca6cf683b4bd14af
    npm notice integrity: sha512-FKTIP9auVruZu[...]hAe+5P+zyiYrQ==
    npm notice total files: 25
    npm notice
    tapship-0.1.0.tgz
    ```
    RESULT: 0 (4s)
    
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
    
    ✔ parseArgs keeps plan defaults (2.511833ms)
    ✔ parseArgs supports explicit command and flags (0.083542ms)
    ✔ cli writes formula output when requested (83.277ms)
    ✔ cli validate returns failure for missing formula asset (67.897292ms)
    ✔ runPlanCommand renders human-readable plan output (5.914ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (1.349125ms)
    ✔ runPlanCommand can emit json payloads (1.629791ms)
    ✔ buildPlan returns expected outputs in dry-run mode (2.36125ms)
    ✔ buildPlan writes generated files when requested (11.393791ms)
    ✔ normalizeRelease derives version and repo defaults (0.658375ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.09475ms)
    ✔ renderFormula includes install stanza (1.525209ms)
    ✔ renderCask includes url and artifact (0.107458ms)
    ✔ renderInstallBlock emits brew commands (0.175875ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (3.014667ms)
    ✔ validateRelease accepts complete all-target fixture (0.844875ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.131792ms)
    ✔ validateRelease rejects invalid schema version (0.08475ms)
    ✔ VERSION is sourced from package metadata (0.575083ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 330.189042
    PASS: package script: test
    
    > tapship@0.1.0 build
    > node scripts/build.js
    
    Build artifacts refreshed in dist/
    PASS: package script: build
    NOTE: agent-qc not installed; skipping optional agent check
    
    Validation passed.
    ```
    RESULT: 0 (1s)
    
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
    RESULT: 0 (0s)
    
