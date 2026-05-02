function hasArchiveExtension(asset) {
  return ['.tar.gz', '.zip', '.tgz'].some((ext) => asset.name.endsWith(ext));
}

function hasCaskExtension(asset) {
  return ['.dmg', '.pkg', '.zip'].some((ext) => asset.name.endsWith(ext));
}

export function classifyAssets(release) {
  const formulaAssets = release.assets.filter((asset) => asset.kind === 'formula' || (asset.binary && hasArchiveExtension(asset)));
  const caskAssets = release.assets.filter((asset) => asset.kind === 'cask' || (asset.app || asset.pkg || asset.name.endsWith('.dmg')) || (asset.platform === 'macos' && hasCaskExtension(asset) && !asset.binary));
  return {
    formulaAssets,
    caskAssets,
  };
}
