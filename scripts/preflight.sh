#!/usr/bin/env bash
# Everything worth checking before a release — run by scripts/release.sh and by the
# release workflow, and safe to run any time.
#
#   scripts/preflight.sh             build, pack, and compile a consumer against the tarball
#   scripts/preflight.sh --release   also: CHANGELOG has a heading for this version
#
# `tsc` passing on the repo proves little about what npm installs: the tarball is shaped
# by the `files` whitelist and `exports`, and a stale dist/ file from a deleted source
# would ship without a sound. So this checks the PACKED tarball, from a consumer's side.
# Builds into throwaway directories, touches no registry, publishes nothing.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
RELEASE=0
[ "${1:-}" = "--release" ] && RELEASE=1

GREEN=$'\033[0;32m'; RED=$'\033[0;31m'; DIM=$'\033[2m'; RESET=$'\033[0m'
ok()   { echo "  ${GREEN}✓${RESET} $1"; }
fail() { echo "  ${RED}✗${RESET} $1" >&2; exit 1; }
step() { echo; echo "${DIM}── $1${RESET}"; }

cd "$ROOT"
NAME="$(node -p "require('./package.json').name")"
VERSION="$(node -p "require('./package.json').version")"

step "1. version"
echo "$VERSION" | grep -Eq '^[0-9]+\.[0-9]+\.[0-9]+(-[0-9A-Za-z.-]+)?$' || fail "package.json version '$VERSION' is not semver"
if [ "$RELEASE" = 1 ]; then
  # The first `## ` heading must be this version: an `## Unreleased` above it means the
  # notes were never given a version, and a release without notes is how 5.3.2-5.3.4 went.
  first="$(grep -m1 '^## ' CHANGELOG.md || true)"
  case "$first" in
    "## $VERSION "*) ok "$NAME@$VERSION — CHANGELOG: $first" ;;
    *) fail "CHANGELOG's first heading is '$first', not '## $VERSION …' — run scripts/release.sh prepare" ;;
  esac
else
  ok "$NAME@$VERSION"
fi

step "2. clean build"
pnpm run -s clean >/dev/null && pnpm run -s build >/dev/null || fail "pnpm run clean && pnpm run build"
ok "dist/ rebuilt from src/ alone"

step "3. the tarball"
npm pack --silent --pack-destination "$WORK" >/dev/null || fail "npm pack"
TARBALL="$(ls "$WORK"/*.tgz)"
tar -tzf "$TARBALL" > "$WORK/contents"
for want in package/package.json package/dist/index.d.ts package/dist/index.js; do
  grep -qx "$want" "$WORK/contents" || fail "the tarball has no $want"
done
bad="$(grep -E '^package/(src|tools|scripts|node_modules|\.github|assets|docs)/|^package/RELEASING\.md$' "$WORK/contents" || true)"
[ -z "$bad" ] || fail "the tarball carries what it should not: $(echo "$bad" | head -3 | tr '\n' ' ')"
ok "$(basename "$TARBALL") — $(wc -l < "$WORK/contents" | tr -d ' ') files, no sources"

step "4. a consumer compiles and runs against it"
# The repo's own tsc, so this needs no network. Two resolutions: node16 is how a CommonJS
# app resolves the package; bundler is how Metro and the Capacitor/Cordova bundlers do.
mkdir -p "$WORK/consumer" && cd "$WORK/consumer"
echo '{"name": "consumer", "private": true}' > package.json
npm install --silent --no-audit --no-fund "$TARBALL" >/dev/null || fail "npm install of the tarball"
cat > index.ts <<'TS'
import { DesiredAccuracy, Event, LogLevel } from "@transistorsoft/background-geolocation-types";
import type { Config, Geofence, Location, State } from "@transistorsoft/background-geolocation-types";

const config: Config = {
  geolocation: { desiredAccuracy: DesiredAccuracy.High, distanceFilter: 10 },
  logger: { logLevel: LogLevel.Verbose },
};
const onLocation = (location: Location): number => location.coords.latitude;
const fence: Geofence = { identifier: "home", radius: 200, latitude: 0, longitude: 0 };
const enabled = (state: State): boolean => state.enabled;
export { config, onLocation, fence, enabled, Event };
TS
for mode in "node16 node16" "esnext bundler"; do
  set -- $mode
  "$ROOT/node_modules/.bin/tsc" --strict --noEmit --skipLibCheck false --module "$1" --moduleResolution "$2" index.ts \
    || fail "a strict consumer does not compile under moduleResolution $2"
done
ok "strict TypeScript compiles under node16 and bundler resolution"
node -e '
  const t = require("@transistorsoft/background-geolocation-types");
  if (t.Event.Location !== "location" || t.DesiredAccuracy.High !== -1 || t.LogLevel.Verbose !== 5) {
    console.error("enum values at runtime:", t.Event && t.Event.Location, t.DesiredAccuracy && t.DesiredAccuracy.High);
    process.exit(1);
  }' || fail "the enums are not there at runtime"
ok "require() returns the enums with their values"

echo
echo "${GREEN}preflight passed${RESET} — $NAME@$VERSION"
