# Contributing

Thanks for improving `tapship`.

## Ground rules

- Keep changes small and reviewable.
- Preserve local-first behavior.
- Do not add hidden network access or publish flows without explicit documentation.
- Prefer fixture-driven tests over brittle live integration tests.

## Setup

```sh
npm install
npm test
bash scripts/validate.sh
```

## Useful checks

```sh
npm run check
npm run build
npm run smoke
```

## Fixtures

Add or update fixture JSON under `fixtures/releases/` when you change generation behavior. Every new behavior should have a deterministic example fixture or test.

## Pull requests

Include:

- a short summary
- the exact verification commands you ran
- any fixture updates needed to reproduce the change

## Safety

Changes that introduce network access, credentials, or publish behavior need explicit maintainer approval first.
