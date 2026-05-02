export function renderInstallBlock(release, requestedType = 'all') {
  const tap = `${release.repo.tapOwner}/${release.repo.tapName}`;
  const commands = [`brew tap ${tap}`];
  if (requestedType === 'formula' || requestedType === 'all') commands.push(`brew install ${release.repo.name}`);
  if (requestedType === 'cask' || requestedType === 'all') commands.push(`brew install --cask ${release.brew.caskToken}`);
  return ['```sh', ...commands, '```'].join('\n');
}

export function renderReleaseChecklist(release, validation) {
  const warningLines = validation.warnings.length === 0 ? ['- [x] Asset names and metadata look consistent.'] : validation.warnings.map((warning) => `- [ ] ${warning}`);
  return [
    `# ${release.repo.name} ${release.release.tagName} release checklist`,
    '',
    '- [x] Metadata captured from local fixture input.',
    '- [x] Homebrew output generated in dry-run mode.',
    '- [ ] Confirm release notes are final.',
    '- [ ] Confirm GitHub release assets match published filenames.',
    ...warningLines,
  ].join('\n');
}
