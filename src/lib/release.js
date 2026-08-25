function stripLeadingV(version) {
  return version.startsWith('v') ? version.slice(1) : version;
}

export function normalizeRelease(payload) {
  const source = payload && typeof payload === 'object' && !Array.isArray(payload) ? payload : {};
  const repo = source.repo && typeof source.repo === 'object' && !Array.isArray(source.repo) ? source.repo : {};
  const brew = source.brew && typeof source.brew === 'object' && !Array.isArray(source.brew) ? source.brew : {};
  const sourceAssets = Array.isArray(source.assets) ? source.assets : [];
  const assets = sourceAssets.map((value) => {
    const asset = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    const name = typeof asset.name === 'string' ? asset.name : '';
    return {
      ...asset,
      ext: name.includes('.') ? name.slice(name.indexOf('.')) : '',
    };
  });
  const tagName = source.tagName ?? source.tag_name;
  const version = stripLeadingV(tagName ?? '0.0.0');

  return {
    schemaVersion: source.schemaVersion,
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
      releaseName: source.releaseName ?? source.name ?? `${repo.name} ${tagName}`,
      publishedAt: source.publishedAt ?? source.published_at ?? null,
      notes: source.notes ?? '',
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
