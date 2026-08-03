import { rubyString } from './ruby.js';

export function renderCask(release, asset) {
  const artifact = asset.pkg ? `  pkg ${rubyString(asset.pkg)}\n` : asset.app ? `  app ${rubyString(asset.app)}\n` : `  binary ${rubyString(asset.binary ?? release.brew.caskBinary)}\n`;
  const uninstall = asset.pkg ? '\n  uninstall pkgutil: []\n' : '';
  return `cask ${rubyString(release.brew.caskToken)} do
  version ${rubyString(release.release.version)}
  sha256 ${rubyString(asset.sha256)}

  url ${rubyString(asset.url)}
  name ${rubyString(release.repo.name)}
  desc ${rubyString(release.repo.description)}
  homepage ${rubyString(release.repo.homepage)}

${artifact}${uninstall}end
`;
}
