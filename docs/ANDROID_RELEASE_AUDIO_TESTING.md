# Testing Android audio like production (before Play Store)

Production installs differ from `yarn android` / debug: no Metro, bundled JS, and packaged APK/AAB. Use the steps below to reproduce **release** behavior locally.

## 1. Release APK from the command line

```bash
cd android
./gradlew :app:assembleRelease
```

APK output (with ABI splits): `android/app/build/outputs/apk/release/` — pick the split for your device ABI, or the **universal** APK if present.

Install:

```bash
adb install -r app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

(Uninstall the debug app first if the signature differs.)

## 2. Android Studio

1. **Build → Generate Signed App Bundle or APK** → choose **release** (or a signing config that matches Play if you need identical signing).
2. Install the artifact via Studio or `adb install -r`.

## 3. Match Play closer: minified / bundle

- **AAB**: `./gradlew :app:bundleRelease` → upload to **Internal testing** in Play Console, install from the Play Store tester link.
- Internal testing is the closest to user reports (Play delivery, signing, sometimes extra optimization).

## 4. Cold start (first launch)

To mimic “first open after install”:

```bash
adb uninstall com.shapebeats
adb install -r path/to/release.apk
adb shell am start -n com.shapebeats/.MainActivity
```

Confirm pads and demos play **before** force-stopping the app.

## 5. What we fixed for “no audio until second launch”

- **Sounds must exist under `android/app/src/main/assets/sounds/`** in the built APK (synced from `src/assets/sounds/` on each `preBuild`).
- **Avoid loading large MP3s as per-byte bridge arrays**; use **copy to cache + `fetch(fileUri)`** instead.

If audio fails again, capture logcat: `adb logcat | grep -i shapebeats` (and any `AudioService` / `RevenueCat` noise you care about).
