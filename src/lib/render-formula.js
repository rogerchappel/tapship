import { rubyString } from './ruby.js';

export function renderFormula(release, asset) {
  const dependencies = release.brew.dependencies.map((dependency) => `  depends_on ${rubyString(dependency)}`).join('\n');
  const caveats = release.brew.caveats ? `\n  def caveats\n    ${rubyString(release.brew.caveats)}\n  end\n` : '';
  const livecheck = release.brew.livecheck ? `\n  livecheck do\n    url ${rubyString(release.brew.livecheck.url)}\n    strategy :github_latest\n  end\n` : '';
  const formulaBinary = release.brew.formulaBinary;

  return `class ${release.brew.formulaClass} < Formula
  desc ${rubyString(release.repo.description)}
  homepage ${rubyString(release.repo.homepage)}
  url ${rubyString(asset.url)}
  version ${rubyString(release.release.version)}
  sha256 ${rubyString(asset.sha256)}
  license ${rubyString(release.repo.license)}${dependencies ? `\n${dependencies}` : ''}${livecheck}

  def install
    bin.install ${rubyString(asset.binary ?? formulaBinary)} => ${rubyString(formulaBinary)}
  end${caveats}
  test do
    output = shell_output("#{bin}/" + ${rubyString(`${formulaBinary} --version`)})
    assert_match version.to_s, output
  end
end
`;
}
