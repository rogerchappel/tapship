function stripLeadingV(version) {
  return version.startsWith('v') ? version.slice(1) : version;
}

export function normalizeRelease(payload) {
  const repo = payload.repo ?? {};
  const brew = payload.brew ?? {};
  const assets = (payload.assets ?? []).map((asset) => ({
    ...asset,
    ext: asset.name.includes('.') ? asset.name.slice(asset.name.indexOf('.')) : '',
  }));
  const tagName = payload.tagName ?? payload.tag_name;
  const version = stripLeadingV(tagName ?? '0.0.0');

  return {
    schemaVersion: payload.schemaVersion ?? 1,
    source: payload,
    repo: {
      owner: repo.owner,
      name: repo.name,
      homepage: repo.homepage ?? `https://github.com/${repo.owner}/${repo.name}`,
      description: repo.description ?? `${repo.name} release`,
      license: repo.license ?? 'MIT',
      tapOwner: repo.tap?.owner ?? repo.owner,
      tapName: repo.tap?.name ?? 'homebrew-tap',
    },
    brew: {
      formulaClass: brew.formulaClass ?? classifyFormulaClass(repo.name),
      formulaBinary: brew.formulaBinary ?? repo.name,
      caskToken: brew.caskToken ?? repo.name,
      caskApp: brew.caskApp ?? `${classifyProductName(repo.name)}.app`,
      caskBinary: brew.caskBinary ?? repo.name,
      testCommand: brew.testCommand ?? `${repo.name} --version`,
      livecheck: brew.livecheck ?? null,
      dependencies: brew.dependencies ?? [],
      caveats: brew.caveats ?? null,
    },
    release: {
      tagName,
      version,
      releaseName: payload.releaseName ?? payload.name ?? `${repo.name} ${tagName}`,
      publishedAt: payload.publishedAt ?? payload.published_at ?? null,
      notes: payload.notes ?? '',
    },
    assets,
  };
}

export function classifyFormulaClass(name = '') {
  return name
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

export function classifyProductName(name = '') {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(' ');
}
