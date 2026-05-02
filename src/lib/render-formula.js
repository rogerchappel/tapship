export function renderFormula(release, asset) {
  const dependencies = release.brew.dependencies.map((dependency) => `  depends_on \"${dependency}\"`).join('\n');
  const caveats = release.brew.caveats ? `\n  def caveats\n    <<~EOS\n      ${release.brew.caveats}\n    EOS\n  end\n` : '';
  const livecheck = release.brew.livecheck ? `\n  livecheck do\n    url \"${release.brew.livecheck.url}\"\n    strategy :github_latest\n  end\n` : '';

  return `class ${release.brew.formulaClass} < Formula\n  desc \"${release.repo.description}\"\n  homepage \"${release.repo.homepage}\"\n  url \"${asset.url}\"\n  version \"${release.release.version}\"\n  sha256 \"${asset.sha256}\"\n  license \"${release.repo.license}\"${dependencies ? `\n${dependencies}` : ''}${livecheck}\n\n  def install\n    bin.install \"${asset.binary ?? release.brew.formulaBinary}\" => \"${release.brew.formulaBinary}\"\n  end${caveats}\n  test do\n    output = shell_output("#{bin}/${release.brew.formulaBinary} --version")\n    assert_match version.to_s, output\n  end\nend\n`;
}
