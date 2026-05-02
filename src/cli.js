import { parseArgs } from './lib/args.js';
import { runPlanCommand } from './lib/commands.js';
import { VERSION } from './lib/version.js';

export async function runCli(argv, runtime) {
  const parsed = parseArgs(argv);

  if (parsed.help) {
    runtime.stdout.write(`${parsed.helpText}\n`);
    return 0;
  }

  if (parsed.version) {
    runtime.stdout.write(`tapship ${VERSION}\n`);
    return 0;
  }

  const result = await runPlanCommand(parsed, runtime);
  if (result.stdout) {
    runtime.stdout.write(result.stdout);
    if (!result.stdout.endsWith('\n')) {
      runtime.stdout.write('\n');
    }
  }
  if (result.stderr) {
    runtime.stderr.write(result.stderr);
    if (!result.stderr.endsWith('\n')) {
      runtime.stderr.write('\n');
    }
  }
  return result.exitCode;
}
