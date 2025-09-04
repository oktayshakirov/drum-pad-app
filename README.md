# ShapeBeats - Drum Pad App

ShapeBeats is a powerful and intuitive drum pad application built with React Native. Create beats, explore multiple sound packs, and unleash your musical creativity with professional-quality audio samples and a sleek, responsive interface.

> Transform your mobile device into a professional drum machine. ShapeBeats combines cutting-edge audio technology with an intuitive user experience to deliver the ultimate beat-making experience.

Whether you're a beginner exploring rhythm for the first time or a seasoned producer looking for a portable beat-making solution, ShapeBeats has you covered. Our app features multiple premium sound packs, real-time audio processing, metronome functionality, and a customizable interface that adapts to your creative workflow.

## Demo

![ShapeBeats Demo](https://oktayshakirov.com/assets/images/projects/shape-beats.jpg 'ShapeBeats Demo')

<p align="center">
  <a href="https://apps.apple.com/us/app/shape-beats/id6751116257"><strong>➥ Download on the App Store</strong></a>
</p>

## Features

- 🎵 **Multiple Sound Packs** - 12+ premium sound packs with unique styles
- 🥁 **Professional Audio** - High-quality samples and real-time processing
- 🎛️ **Customizable Interface** - Drag and drop pad arrangement
- ⏱️ **Built-in Metronome** - Perfect timing for practice and recording
- 🎚️ **Audio Controls** - Volume, equalizer, and audio effects
- 📱 **Cross-Platform** - Native performance on both Android and iOS
- 🎨 **Modern UI** - Sleek design optimized for touch interaction

## ⚙️ Installation

After downloading the project, you have some prerequisites to install. Then you can run it on your localhost or build for production.

### 🔧 Install prerequisites (once for a machine)

- **Node.js:** [Install Node.js](https://nodejs.org/en/download/) [Recommended LTS version]
- **React Native CLI:** `npm install -g @react-native-community/cli`
- **Android Studio:** [Install Android Studio](https://developer.android.com/studio) (for Android development)
- **Xcode:** [Install Xcode](https://developer.apple.com/xcode/) (for iOS development, macOS only)

### 🖥️ Local setup

After successfully installing those dependencies, open this project with any IDE [[VS Code](https://code.visualstudio.com/) recommended], and then open the internal terminal of IDE [vs code shortcut <code>ctrl/cmd+\`</code>]

- Install dependencies

```sh
# Using npm
npm install

# OR using Yarn
yarn install
```

- Start Metro bundler

```sh
# Using npm
npm start

# OR using Yarn
yarn start
```

- Run on Android

```sh
# Using npm
npm run android

# OR using Yarn
yarn android
```

- Run on iOS (macOS only)

```sh
# Install CocoaPods dependencies first
bundle install
bundle exec pod install

# Then run
npm run ios
# OR
yarn ios
```

After that, it will open up the app in your Android Emulator, iOS Simulator, or connected device, watch for changes to source files, and live-reload when changes are saved.

## 🏗️ Production Build

After finishing all the customization, you can create a production build by running these commands.

### Android

```sh
# Generate release APK
cd android
./gradlew assembleRelease

# OR using npm script
npm run build:android
```

### iOS

```sh
# Build for iOS (requires macOS and Xcode)
cd ios
xcodebuild -workspace ShapeBeats.xcworkspace -scheme ShapeBeats -configuration Release -destination generic/platform=iOS -archivePath ShapeBeats.xcarchive archive

# OR using npm script
npm run build:ios
```

## Audio Assets

This app uses a custom audio asset loading system:

- **Android**: Audio files are loaded directly from the APK's assets directory using a native module
- **iOS**: Audio files are bundled by Metro and accessed through React Native's asset resolution

For more details, see [Audio Assets Documentation](./src/assets/sounds/README.md).

## Troubleshooting

If you're having issues getting the above steps to work, see the [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

## License

This project is provided for viewing purposes only. All rights are reserved. No part of this project may be copied, modified, or redistributed without explicit written permission from the author.
