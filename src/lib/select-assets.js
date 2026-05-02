function scoreAsset(asset) {
  let score = 0;
  if (asset.arch === 'arm64') score += 3;
  if (asset.arch === 'universal') score += 2;
  if (asset.platform === 'macos' || asset.platform === 'darwin') score += 2;
  if (asset.kind === 'formula' || asset.kind === 'cask') score += 1;
  if (asset.name.includes('.tar.gz')) score += 1;
  return score;
}

export function pickPrimaryAsset(assets) {
  return [...assets].sort((left, right) => scoreAsset(right) - scoreAsset(left) || left.name.localeCompare(right.name))[0] ?? null;
}
