import { buildPlan } from './plan.js';
import { classifyAssets } from './classify.js';
import { readReleaseInput } from './read-input.js';
import { normalizeRelease } from './release.js';
import { validateRelease } from './validate.js';

export async function runPlanCommand(parsed, runtime) {
  const { payload, resolvedPath } = await readReleaseInput(parsed.input, runtime.cwd);
  const release = normalizeRelease(payload);
  const effectiveType = resolveType(parsed.type, release);

  if (parsed.command === 'validate') {
    const validation = validateRelease(release, effectiveType);
    return {
      exitCode: validation.ok ? 0 : 1,
      stdout: parsed.json ? JSON.stringify(validation, null, 2) : renderValidationText(validation),
    };
  }

  if (parsed.command !== 'plan') {
    throw new Error(`Unknown command: ${parsed.command}`);
  }

  const plan = await buildPlan(release, {
    type: effectiveType,
    write: parsed.write,
    outputDir: parsed.outputDir,
    cwd: runtime.cwd,
  });

  plan.summary.input = resolvedPath;
  return {
    exitCode: plan.ok ? 0 : 1,
    stdout: parsed.json ? JSON.stringify(plan, null, 2) : renderPlanText(plan),
  };
}

function resolveType(type, release) {
  if (type !== 'auto') return type;
  const { formulaAssets, caskAssets } = classifyAssets(release);
  if (formulaAssets.length && caskAssets.length) return 'all';
  if (formulaAssets.length) return 'formula';
  if (caskAssets.length) return 'cask';
  return 'all';
}

function renderValidationText(validation) {
  const lines = [`Validation: ${validation.ok ? 'ok' : 'failed'}`];
  if (validation.errors.length) lines.push('Errors:', ...validation.errors.map((error) => `- ${error}`));
  if (validation.warnings.length) lines.push('Warnings:', ...validation.warnings.map((warning) => `- ${warning}`));
  return `${lines.join('\n')}\n`;
}

function renderPlanText(plan) {
  const lines = [
    `Plan: ${plan.ok ? 'ready' : 'blocked'}`,
    `Repo: ${plan.summary.repo}@${plan.summary.version}`,
    `Input: ${plan.summary.input}`,
    `Target: ${plan.summary.target}`,
    `Mode: ${plan.writeMode ? 'write' : 'dry-run'}`
  ];
  for (const output of plan.outputs) {
    lines.push(`- ${output.kind}: ${output.path}`);
  }
  if (plan.validation.warnings.length) {
    lines.push('Warnings:', ...plan.validation.warnings.map((warning) => `- ${warning}`));
  }
  if (plan.validation.errors.length) {
    lines.push('Errors:', ...plan.validation.errors.map((error) => `- ${error}`));
  }
  return `${lines.join('\n')}\n`;
}
