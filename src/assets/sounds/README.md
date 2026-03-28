# Audio Assets Access Guide

## Android

Audio assets are accessed through a native Android module that reads files from the APK's assets directory.

**Source of truth**: `src/assets/sounds/` (same tree as `require()` in JS).

**APK copy**: Gradle task `copyBundledSoundsToAndroidAssets` runs on `preBuild` and copies everything under `src/assets/sounds/` into `android/app/src/main/assets/sounds/` (excluding `*.ts`, `*.tsx`, `*.md`). That folder is gitignored so binaries are not duplicated in git.

**Path inside the APK**: `sounds/packs/...`, `sounds/metronome/...`

- **Metronome**: `sounds/metronome/tick.mp3`
- **Sound Packs**: `sounds/packs/{packName}/samples/{soundName}.mp3`
- **Demos**: `sounds/packs/{packName}/demo.mp3`

**How it works**: `AudioAssetLoader.copyAudioAssetToCache()` copies the asset to app cache and returns a `file://` URI; JS uses `fetch(uri)` then `decodeAudioData`. This avoids pushing multi‑MB byte arrays over the JS bridge (which can fail on cold start / Play installs).

## iOS

Audio assets are accessed through Metro bundler using `require()` statements and `Image.resolveAssetSource()`.

**Path**: `src/assets/sounds/` (source files)

- **Metronome**: `require('./metronome/tick.mp3')`
- **Sound Packs**: `require('./packs/{packName}/samples/{soundName}.mp3')`
- **Demos**: `require('./packs/{packName}/demo.mp3')`

**How it works**: Metro bundles the audio files and provides accessible URIs through React Native's asset resolution system.

## Key Differences

- **Android**: Native module + direct asset access
- **iOS**: Metro bundler + React Native asset resolution
- **Android**: Files copied to `android/app/src/main/assets/`
- **iOS**: Files remain in `src/assets/sounds/`
