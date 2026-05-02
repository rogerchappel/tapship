import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { classifyAssets } from './classify.js';
import { renderFormula } from './render-formula.js';
import { renderCask } from './render-cask.js';
import { renderInstallBlock, renderReleaseChecklist } from './render-docs.js';
import { validateRelease } from './validate.js';

export async function buildPlan(release, options = {}) {
  const requestedType = options.type ?? 'all';
  const validation = validateRelease(release, requestedType);
  const { formulaAssets, caskAssets } = classifyAssets(release);
  const outputs = [];

  if ((requestedType === 'formula' || requestedType === 'all') && formulaAssets[0]) {
    outputs.push({
      kind: 'formula',
      path: `Formula/${release.repo.name}.rb`,
      content: renderFormula(release, formulaAssets[0]),
    });
  }

  if ((requestedType === 'cask' || requestedType === 'all') && caskAssets[0]) {
    outputs.push({
      kind: 'cask',
      path: `Casks/${release.brew.caskToken}.rb`,
      content: renderCask(release, caskAssets[0]),
    });
  }

  outputs.push({
    kind: 'install',
    path: 'snippets/install.md',
    content: renderInstallBlock(release, requestedType),
  });

  outputs.push({
    kind: 'checklist',
    path: 'snippets/release-checklist.md',
    content: renderReleaseChecklist(release, validation),
  });

  const result = {
    ok: validation.ok,
    validation,
    outputs,
    writeMode: Boolean(options.write),
  };

  if (options.write) {
    const baseDir = path.resolve(options.cwd ?? process.cwd(), options.outputDir ?? 'dist');
    for (const output of outputs) {
      const fullPath = path.join(baseDir, output.path);
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(fullPath, output.content, 'utf8');
      output.writtenTo = fullPath;
    }
    result.outputDir = baseDir;
  }

  return result;
}
