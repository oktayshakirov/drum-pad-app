# Audio Assets Access Guide

## Android

Audio assets are accessed through a native Android module that reads files directly from the APK's assets directory.

**Path**: `android/app/src/main/assets/sounds/`

- **Metronome**: `sounds/metronome/tick.mp3`
- **Sound Packs**: `sounds/packs/{packName}/samples/{soundName}.mp3`
- **Demos**: `sounds/packs/{packName}/demo.mp3`

**How it works**: The `AudioAssetLoader` native module uses Android's `AssetManager.open()` to read audio files as raw bytes, bypassing React Native's fetch limitations.

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
