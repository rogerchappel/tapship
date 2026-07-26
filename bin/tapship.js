#!/usr/bin/env node
import { runCli } from '../src/cli.js';

runCli(process.argv.slice(2), {
  stdout: process.stdout,
  stderr: process.stderr,
  cwd: process.cwd(),
}).then((code) => {
  process.exitCode = code;
}).catch((error) => {
  const diagnostic = error.name === 'ArgumentError' ? error.message : (error.stack || error.message);
  process.stderr.write(`${diagnostic}\n`);
  process.exitCode = 1;
});
