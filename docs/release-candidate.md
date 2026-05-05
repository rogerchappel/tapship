# Release candidate readiness

Generated: 2026-05-05T21:25:21Z
Branch: `release-candidate/readiness`
Base: `origin/main`

## Verification

Status: PASS

Checks run:
- `npm run release:check`
- `bash scripts/validate.sh`
- `node releasebox check .`

## Check output summary

    > tapship@0.1.0 release:check
    > npm test && npm run check && npm run build && npm run smoke && bash scripts/validate.sh && npm pack --dry-run
    
    
    > tapship@0.1.0 test
    > node --test
    
    ✔ parseArgs keeps plan defaults (1.162375ms)
    ✔ parseArgs supports explicit command and flags (0.070917ms)
    ✔ cli writes formula output when requested (64.533792ms)
    ✔ cli validate returns failure for missing formula asset (49.797708ms)
    ✔ runPlanCommand renders human-readable plan output (7.81675ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (1.14175ms)
    ✔ runPlanCommand can emit json payloads (0.717709ms)
    ✔ buildPlan returns expected outputs in dry-run mode (1.667625ms)
    ✔ buildPlan writes generated files when requested (8.596375ms)
    ✔ normalizeRelease derives version and repo defaults (0.682125ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.280167ms)
    ✔ renderFormula includes install stanza (0.660792ms)
    ✔ renderCask includes url and artifact (0.217333ms)
    ✔ renderInstallBlock emits brew commands (0.181208ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (0.893417ms)
    ✔ validateRelease accepts complete all-target fixture (0.835917ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.129417ms)
    ✔ validateRelease rejects invalid schema version (0.08425ms)
    ✔ VERSION is sourced from package metadata (0.611333ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 234.220292
    
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
    
    ✔ parseArgs keeps plan defaults (2.722583ms)
    ✔ parseArgs supports explicit command and flags (0.184791ms)
    ✔ cli writes formula output when requested (58.611833ms)
    ✔ cli validate returns failure for missing formula asset (50.592708ms)
    ✔ runPlanCommand renders human-readable plan output (8.472625ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (1.744209ms)
    ✔ runPlanCommand can emit json payloads (0.868125ms)
    ✔ buildPlan returns expected outputs in dry-run mode (1.7985ms)
    ✔ buildPlan writes generated files when requested (7.504833ms)
    ✔ normalizeRelease derives version and repo defaults (0.660792ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.092917ms)
    ✔ renderFormula includes install stanza (2.120208ms)
    ✔ renderCask includes url and artifact (0.22575ms)
    ✔ renderInstallBlock emits brew commands (0.218333ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (1.325833ms)
    ✔ validateRelease accepts complete all-target fixture (0.836917ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.174708ms)
    ✔ validateRelease rejects invalid schema version (0.096708ms)
    ✔ VERSION is sourced from package metadata (0.604375ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 228.167
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
    npm notice package size: 9.1 kB
    npm notice unpacked size: 25.4 kB
    npm notice shasum: 09dc785a3d99775761d66df3c826b2df602f0811
    npm notice integrity: sha512-9u1D9ddWls/9b[...]JUH5UEVBwfQLw==
    npm notice total files: 24
    npm notice
    tapship-0.1.0.tgz
    ```
    RESULT: 0 (2s)
    
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
    
    ✔ parseArgs keeps plan defaults (1.201ms)
    ✔ parseArgs supports explicit command and flags (0.071792ms)
    ✔ cli writes formula output when requested (77.991541ms)
    ✔ cli validate returns failure for missing formula asset (52.354416ms)
    ✔ runPlanCommand renders human-readable plan output (9.363708ms)
    ✔ runPlanCommand auto-selects cask-only fixtures (1.698666ms)
    ✔ runPlanCommand can emit json payloads (1.144583ms)
    ✔ buildPlan returns expected outputs in dry-run mode (2.059625ms)
    ✔ buildPlan writes generated files when requested (22.017333ms)
    ✔ normalizeRelease derives version and repo defaults (3.173875ms)
    ✔ classifyFormulaClass converts kebab case to ruby constant (0.13175ms)
    ✔ renderFormula includes install stanza (0.673292ms)
    ✔ renderCask includes url and artifact (0.083ms)
    ✔ renderInstallBlock emits brew commands (0.074ms)
    ✔ pickPrimaryAsset prefers arm64 darwin archives (0.613209ms)
    ✔ validateRelease accepts complete all-target fixture (0.933125ms)
    ✔ validateRelease blocks missing formula asset when formula requested (0.142ms)
    ✔ validateRelease rejects invalid schema version (0.077084ms)
    ✔ VERSION is sourced from package metadata (0.571208ms)
    ℹ tests 19
    ℹ suites 0
    ℹ pass 19
    ℹ fail 0
    ℹ cancelled 0
    ℹ skipped 0
    ℹ todo 0
    ℹ duration_ms 249.624458
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
    
