# Sound Files Structure

This directory contains all the sound files for the drum pad app. The sounds are organized by pack type and will be automatically bundled with the app for both iOS and Android.

## Directory Structure

```
src/assets/sounds/
├── hiphop/              # Hip Hop sound pack
│   ├── hiphop_kick.wav x
│   ├── hiphop_snare.wav x
│   ├── hiphop_hi_hat.wav x
│   ├── hiphop_tom1.wav
│   ├── hiphop_tom2.wav
│   ├── hiphop_tom3.wav
│   ├── hiphop_clap.wav
│   ├── hiphop_cymbal.wav
│   ├── hiphop_fx1.wav
│   ├── hiphop_fx2.wav
│   ├── hiphop_openhat.wav
│   └── hiphop_perc.wav
│
├── edm/                 # EDM sound pack
│   ├── edm_kick.wav
│   ├── edm_snare.wav
│   ├── edm_hat.wav
│   ├── edm_tom1.wav
│   ├── edm_tom2.wav
│   ├── edm_tom3.wav
│   ├── edm_clap.wav
│   ├── edm_cymbal.wav
│   ├── edm_fx1.wav
│   ├── edm_fx2.wav
│   ├── edm_openhat.wav
│   └── edm_perc.wav
│
└── metronome_tick.wav   # Metronome sound
```

## Setup Instructions

1. Place your sound files in the appropriate directories
2. Update your `metro.config.js` to include the assets:

```javascript
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  resolver: {
    assetExts: ['wav', 'mp3', 'aac'],
  },
};
```

3. For iOS, update your `ios/Podfile`:

```ruby
target 'YourApp' do
  # ... other configurations ...

  pod 'react-native-sound', :path => '../node_modules/react-native-sound'
end
```

4. For Android, update your `android/app/build.gradle`:

```gradle
android {
    // ... other configurations ...

    sourceSets {
        main {
            assets.srcDirs += ['../../src/assets/sounds']
        }
    }
}
```

## Sound File Requirements

1. Format: WAV files (16-bit, 44.1kHz recommended)
2. Duration: Keep samples short (under 2 seconds)
3. File Size: Optimize for mobile (compress if needed)
4. Naming: Use lowercase with underscores
5. Quality: Use high-quality samples for best sound

## Usage in Code

Update your `AudioService.js` to use the new paths:

```javascript
// Example path construction
const soundPath = `${packName.toLowerCase()}/${soundFile}`;
```

## Benefits of This Approach

1. **Centralized Management**: All assets in one place
2. **Better Version Control**: Easier to track changes
3. **Simpler Build Process**: No need to copy files manually
4. **Cross-Platform**: Works the same way on iOS and Android
5. **Easier Updates**: Update sounds without rebuilding native code

## Troubleshooting

If sounds don't play:

1. Verify the file paths in your code
2. Check if files are included in the bundle
3. Verify file permissions
4. Check the debug console for loading errors
5. Make sure the file format is supported
