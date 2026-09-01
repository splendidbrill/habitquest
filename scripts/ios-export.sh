#!/usr/bin/env bash
#
# One-command iOS build + export for HabitQuest.
#
#   ./scripts/ios-export.sh            # build and export a signed .ipa
#   ./scripts/ios-export.sh --upload   # ...and upload it to TestFlight
#
# Prerequisites on the Mac (see IOS-BUILD.md):
#   - Xcode installed, signed in with your Apple Developer account
#   - .env copied into the repo root (it is gitignored, so it will NOT be cloned)
#   - APPLE_TEAM_ID set (10 characters, from developer.apple.com → Membership)
#
set -euo pipefail

cd "$(dirname "$0")/.."
ROOT="$PWD"
SCHEME="HabitQuest"
IPA_DIR="$ROOT/ios/build/ipa"

step() { printf '\n\033[1;34m==> %s\033[0m\n' "$1"; }
fail() { printf '\n\033[1;31mERROR: %s\033[0m\n' "$1" >&2; exit 1; }

# ── Preflight ────────────────────────────────────────────────────────────────
step "Checking prerequisites"

[ -n "${APPLE_TEAM_ID:-}" ] || fail "APPLE_TEAM_ID is not set.
  Find it at developer.apple.com → Membership (10 characters), then:
    export APPLE_TEAM_ID=XXXXXXXXXX"

[ -f "$ROOT/.env" ] || fail ".env is missing from the repo root.
  It is gitignored, so cloning does not bring it. Copy it from your Windows
  machine — without it the app builds with no Supabase connection and every
  screen fails at runtime."

grep -q "SUPABASE_URL" "$ROOT/.env" || fail ".env exists but has no SUPABASE_URL."

command -v xcodebuild >/dev/null || fail "xcodebuild not found. Install Xcode from the App Store."
command -v pod        >/dev/null || fail "CocoaPods not found. Install it with: sudo gem install cocoapods"

echo "  team id .......... $APPLE_TEAM_ID"
echo "  bundle id ........ uk.habitquest.app"
echo "  xcode ............ $(xcodebuild -version | head -1)"

# ── Dependencies ─────────────────────────────────────────────────────────────
step "Installing JavaScript dependencies"
npm install

step "Installing CocoaPods (first run is slow — 5-15 minutes)"
cd "$ROOT/ios"
pod install

# ── Archive ──────────────────────────────────────────────────────────────────
step "Building archive (10-20 minutes)"
rm -rf "$ROOT/ios/build"
xcodebuild archive \
  -workspace "$SCHEME.xcworkspace" \
  -scheme "$SCHEME" \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -archivePath "$ROOT/ios/build/$SCHEME.xcarchive" \
  DEVELOPMENT_TEAM="$APPLE_TEAM_ID" \
  CODE_SIGN_STYLE=Automatic \
  -allowProvisioningUpdates

# ── Export ───────────────────────────────────────────────────────────────────
step "Exporting signed .ipa"
cat > "$ROOT/ios/build/ExportOptions.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store</string>
    <key>teamID</key>
    <string>$APPLE_TEAM_ID</string>
    <key>uploadSymbols</key>
    <true/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
PLIST

xcodebuild -exportArchive \
  -archivePath "$ROOT/ios/build/$SCHEME.xcarchive" \
  -exportOptionsPlist "$ROOT/ios/build/ExportOptions.plist" \
  -exportPath "$IPA_DIR" \
  -allowProvisioningUpdates

IPA="$(find "$IPA_DIR" -name '*.ipa' | head -1)"
[ -n "$IPA" ] || fail "Export finished but no .ipa was produced."

step "Build complete"
echo "  $IPA"
echo "  $(du -h "$IPA" | cut -f1)"

# ── Optional upload ──────────────────────────────────────────────────────────
if [ "${1:-}" = "--upload" ]; then
  step "Uploading to TestFlight"
  [ -n "${APPLE_ID:-}" ] && [ -n "${APPLE_APP_PASSWORD:-}" ] || fail \
    "Set APPLE_ID and APPLE_APP_PASSWORD (an app-specific password from
  appleid.apple.com → Sign-In and Security → App-Specific Passwords)."

  xcrun altool --upload-app -f "$IPA" -t ios \
    -u "$APPLE_ID" -p "$APPLE_APP_PASSWORD"
  echo "Uploaded. It takes 10-30 minutes to appear in TestFlight."
else
  echo ""
  echo "To upload: ./scripts/ios-export.sh --upload"
  echo "Or drag the .ipa into the Transporter app from the Mac App Store."
fi
