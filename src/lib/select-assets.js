function hasFilenameToken(name, token) {
  return new RegExp(`(?:^|[-_.])${token}(?=$|[-_.])`, 'i').test(name);
}

function scoreAsset(asset) {
  let score = 0;
  if (asset.arch === 'arm64' || (!asset.arch && hasFilenameToken(asset.name, 'arm64'))) score += 3;
  if (asset.arch === 'universal' || (!asset.arch && hasFilenameToken(asset.name, 'universal'))) score += 2;
  const macOS = asset.platform === 'macos' || asset.platform === 'darwin'
    || (!asset.platform && (hasFilenameToken(asset.name, 'macos') || hasFilenameToken(asset.name, 'darwin')));
  if (macOS) score += 2;
  if (asset.kind === 'formula' || asset.kind === 'cask') score += 1;
  if (asset.name.includes('.tar.gz')) score += 1;
  return score;
}

export function pickPrimaryAsset(assets) {
  return [...assets].sort((left, right) => scoreAsset(right) - scoreAsset(left) || left.name.localeCompare(right.name))[0] ?? null;
}
