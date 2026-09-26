# Releasing

`@transistorsoft/background-geolocation-types` is published by GitHub Actions
(`.github/workflows/release.yml`) when a version tag is pushed. npm trusts that workflow
through **Trusted Publishing** (OIDC), so no npm token exists anywhere, and every release
carries **provenance**: a signed record of the repository, commit and workflow that built it.

## A release

```bash
pnpm release prepare 5.3.6     # branch chore/release-5.3.6: version, dated CHANGELOG, preflight
# merge chore/release-5.3.6 into master
pnpm release tag 5.3.6         # on master: tag the merge (lightweight, like every earlier tag)
git push origin master 5.3.6   # the tag starts the workflow
```

`pnpm release …` runs `scripts/release.sh …`, and `pnpm preflight [--release]` runs
`scripts/preflight.sh`; with npm, put `--` before the arguments (`npm run release -- tag 5.3.6`).
Never add a `version`, `preversion` or `postversion` script: `release prepare` runs
`npm version`, which would run them.

The workflow checks (the tag equals `package.json`'s version; `scripts/preflight.sh --release`:
a clean build, the packed tarball's contents, a strict consumer compile under node16 and
bundler resolution, the enums at runtime, a CHANGELOG heading for the version), then
publishes. A prerelease such as `5.4.0-beta.1` is published under the `next` dist-tag, so
`latest` only moves to a release.

`pnpm preflight` (without `--release`) is safe to run at any time; it publishes nothing.

## A release that failed

Fix the cause, then re-run from the Actions tab: **release → Run workflow → Use workflow
from → Tags → the version**. The workflow refuses to run on a branch, and skips the publish
if that version is already on npm. A version can be published once, ever: if a bad tag was
pushed, delete it and release the next patch version rather than re-using the number.

## Checking a release

- The package page on npmjs.com shows a provenance badge linking to the workflow run.
- `npm audit signatures`, in a project that depends on the package, verifies it.

## One-time setup

On npmjs.com, the package's **Settings → Trusted Publisher → GitHub Actions**:
organization `transistorsoft`, repository `background-geolocation-types`, workflow
`release.yml`, environment blank (GitHub Environments are not available on this org's
plan, and the registration and the workflow must agree). **Publishing access** is
"Require two-factor authentication and disallow bypass 2fa tokens", which Trusted
Publishing works under. GitHub needs nothing: no secrets, no environment.
