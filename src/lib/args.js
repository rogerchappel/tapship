const HELP_TEXT = `tapship

Usage:
  tapship plan --input <release.json> [--type auto|formula|cask|all] [--json] [--write] [--output <directory>]
  tapship validate --input <release.json> [--json]
  tapship --help
  tapship --version

Defaults:
  - dry-run by default; use --write to write generated files.
  - --write creates files only after validation succeeds.
  - --input, --type, and --output require values.
  - command defaults to 'plan' when omitted.
`;

const VALID_TYPES = new Set(['auto', 'formula', 'cask', 'all']);

class ArgumentError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ArgumentError';
  }
}

function takeOptionValue(args, index, option) {
  const value = args[index + 1];
  if (value === undefined || value.startsWith('-')) {
    throw new ArgumentError(`Missing value for ${option}.`);
  }
  return value;
}

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
    else if (token === '--input') parsed.input = takeOptionValue(args, index++, token);
    else if (token === '--type') {
      const type = takeOptionValue(args, index++, token);
      if (!VALID_TYPES.has(type)) {
        throw new ArgumentError(`Invalid --type value: ${type}. Expected auto, formula, cask, or all.`);
      }
      parsed.type = type;
    }
    else if (token === '--output') parsed.outputDir = takeOptionValue(args, index++, token);
    else throw new ArgumentError(`Unknown argument: ${token}`);
  }

  return parsed;
}
