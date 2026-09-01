# iOS build — cloud Mac runbook

Everything that could be done from Windows is already done. On the Mac you
run one command.

## Before you rent the Mac (do these on Windows / in a browser)

1. **Apple Developer Program** — enrolled and paid (£79/yr). Enrolment can take
   24-48 hours to approve, so do not leave it to the rental day.
2. **Register the bundle ID** at developer.apple.com → Certificates, Identifiers
   & Profiles → Identifiers → `+`:
   - Bundle ID: `uk.habitquest.app` (explicit, not wildcard)
   - Capabilities: leave default. Do **not** tick Push Notifications for v1.
3. **Create the app** in App Store Connect → My Apps → `+` → New App, using the
   same bundle ID.
4. **Find your Team ID** — developer.apple.com → Membership. 10 characters.
5. **App-specific password** (only if you want the script to upload for you) —
   appleid.apple.com → Sign-In and Security → App-Specific Passwords.

## On the Mac

```bash
git clone https://github.com/splendidbrill/habitquest.git
cd habitquest
```

**Copy `.env` into the repo root.** It is gitignored, so cloning does not bring
it. Without it the app builds fine but has no Supabase connection and every
screen fails at runtime. Transfer it securely — not through the repo.

```bash
export APPLE_TEAM_ID=XXXXXXXXXX
./scripts/ios-export.sh
```

That installs npm packages, runs `pod install`, archives, signs, and exports a
signed `.ipa` to `ios/build/ipa/`. Expect 30-45 minutes on the first run, most
of it CocoaPods and the archive.

To build and upload to TestFlight in one go:

```bash
export APPLE_ID=habitquest247@gmail.com
export APPLE_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx
./scripts/ios-export.sh --upload
```

Otherwise drag the `.ipa` into the **Transporter** app from the Mac App Store.

## What is already configured

| Item | Value |
|---|---|
| Bundle ID | `uk.habitquest.app` (both Debug and Release) |
| Version / build | `1.0` / `1` |
| Deployment target | iOS 15.1 |
| App icons | generated from `assets/icon.png`, opaque, all 8 sizes |
| Camera permission text | set |
| Photo library permission text | set |
| Empty location permission | removed (was an automatic rejection) |

## Known gaps

- **Push notifications are not set up on iOS.** They need an APNs key, the Push
  Notifications capability, and a Firebase iOS config. Notifee will compile and
  the app will run, but remote notifications will not arrive. Ship v1 without
  them unless you have time to spare.
- **No privacy policy URL yet.** Apple requires one, same as Google.
- **Apple's Kids Category rules** may apply, since the app is aimed at children.
  They are stricter than Google's Families policy — read them before submitting.

## If the build fails

- `pod install` errors → `cd ios && pod repo update && pod install`
- Signing errors → open `ios/HabitQuest.xcworkspace` in Xcode, select the
  HabitQuest target → Signing & Capabilities, tick "Automatically manage
  signing", pick your team, then re-run the script.
- Metro/JS bundle errors → `npm start -- --reset-cache` once, then re-run.
