# tapship

Status: ready

## Scorecard

Total: 78/100
Band: promising
Last scored: 2026-04-29
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 16/20 | Useful pain, but scope/daily frequency needs more evidence. |
| Demand signal | 15/20 | Some signal, but needs more external validation. |
| V1 buildability | 18/20 | Small deterministic V1 is feasible. |
| Differentiation | 11/15 | Useful angle, but category has adjacent competition. |
| Agentic workflow leverage | 11/15 | Indirectly useful for agent workflows. |
| Distribution potential | 7/10 | Has demo/content potential. |

## Pitch

A tiny release assistant that turns GitHub releases into a polished Homebrew tap workflow with formula/cask checks, bottle notes, and copy-paste install docs.

## Why It Matters

Roger is spinning up many OSS repos. Distribution and install polish will matter if any tool catches attention. A tap/tooling repo is not viral alone, but it makes every CLI/app easier to install.

## Qualification

Homebrew taps are standard OSS distribution. steipete/homebrew-tap shows active distribution support around multiple tools. Internal demand exists because the sprint is creating many small repos that need frictionless install paths.

Source / adjacent research: Inspired by steipete/homebrew-tap, a Homebrew tap with 81 stars / 22 forks checked 2026-04-29.

Decision: promising

## V1 Scope

- Generate formula/cask stubs from repo metadata
- Validate checksums and release asset naming
- Emit README install block and release checklist
- Support dry-run only by default

## Out of Scope

- Hosting binaries
- Signing/notarization automation
- Private tap management

## Verification

- Unit or fixture tests for core parsing/generation behavior.
- README with install, quickstart, and safety notes.
- Local-first behavior documented clearly.
- No hidden network, credential, or publish behavior.

## Agent Prompt

Build `tapship` as a local-first CLI. It must inspect release metadata, generate Homebrew formula/cask drafts, and never push or publish without explicit flags.
