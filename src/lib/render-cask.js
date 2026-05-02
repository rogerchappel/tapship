export function renderCask(release, asset) {
  const artifact = asset.pkg ? `  pkg \"${asset.pkg}\"\n` : asset.app ? `  app \"${asset.app}\"\n` : `  binary \"${asset.binary ?? release.brew.caskBinary}\"\n`;
  const uninstall = asset.pkg ? '\n  uninstall pkgutil: []\n' : '';
  return `cask \"${release.brew.caskToken}\" do\n  version \"${release.release.version}\"\n  sha256 \"${asset.sha256}\"\n\n  url \"${asset.url}\"\n  name \"${release.repo.name}\"\n  desc \"${release.repo.description}\"\n  homepage \"${release.repo.homepage}\"\n\n${artifact}${uninstall}end\n`;
}
