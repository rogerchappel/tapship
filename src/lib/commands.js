export async function runPlanCommand(parsed, runtime) {
  return {
    exitCode: 0,
    stdout: `tapship command '${parsed.command}' is not implemented yet. cwd=${runtime.cwd}`,
  };
}
