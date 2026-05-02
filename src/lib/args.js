const HELP_TEXT = `tapship

Usage:
  tapship plan --input <release.json> [--type auto|formula|cask|all] [--json] [--write]
  tapship validate --input <release.json> [--json]
  tapship --help
  tapship --version

Defaults:
  - dry-run by default; use --write to write generated files.
  - command defaults to 'plan' when omitted.
`;

export function parseArgs(argv) {
  const args = [...argv];
  const parsed = {
    command: 'plan',
    input: null,
    type: 'all',
    json: false,
    write: false,
    outputDir: 'dist',
    help: false,
    version: false,
    helpText: HELP_TEXT,
  };

  if (args.length === 0) {
    return parsed;
  }

  const first = args[0];
  if (!first.startsWith('-')) {
    parsed.command = args.shift();
  }

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];
    if (token === '--help' || token === '-h') parsed.help = true;
    else if (token === '--version' || token === '-v') parsed.version = true;
    else if (token === '--json') parsed.json = true;
    else if (token === '--write') parsed.write = true;
    else if (token === '--input') parsed.input = args[++index] ?? null;
    else if (token === '--type') parsed.type = args[++index] ?? 'all';
    else if (token === '--output') parsed.outputDir = args[++index] ?? 'dist';
    else throw new Error(`Unknown argument: ${token}`);
  }

  return parsed;
}
