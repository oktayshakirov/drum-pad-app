// src/services/AudioService.js
import Sound from 'react-native-sound';

// Enable playback in silent mode (iOS)
Sound.setCategory('Playback');

// Object to store loaded sounds to prevent re-loading and manage instances
const soundCache = {};

// Function to preload sounds for a given pack
export const preloadSoundPack = async (packName, soundFiles) => {
  console.log(`Preloading sound pack: ${packName}`);
  soundCache[packName] = soundCache[packName] || {};
  for (const soundFile of soundFiles) {
    if (soundFile && !soundCache[packName][soundFile]) {
      // Construct the path correctly depending on how you bundle assets
      // For bundling in main app bundle (iOS) or raw resources (Android):
      const soundPath = `${packName
        .toLowerCase()
        .replace(' ', '_')}/${soundFile}`;
      console.log(`Preloading sound: ${soundPath}`);

      soundCache[packName][soundFile] = new Promise((resolve, reject) => {
        const sound = new Sound(soundPath, Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.error(`Failed to load sound ${soundPath}`, error);
            // Fallback for Android if not found in MAIN_BUNDLE (assets/raw)
            // This assumes sounds are in android/app/src/main/res/raw
            // You might need to adjust your asset bundling strategy.
            // For this example, we'll primarily rely on Sound.MAIN_BUNDLE.
            // If using `ptomasroos/react-native-sound` assets folder,
            // the path would be `soundFile` directly if configured correctly.
            // For simplicity, we assume files are correctly placed for MAIN_BUNDLE to find.
            // e.g. for Android: android/app/src/main/assets/sounds/[pack_name]/[sound_file]
            // e.g. for iOS: drag the sounds folder into your Xcode project.
            // For this template, we'll assume they are in `android/app/src/main/assets/sounds/...`
            // and correctly linked in Xcode for iOS.

            // More robust path handling might be needed based on final asset setup.
            // For now, let's assume soundPath is correct for Sound.MAIN_BUNDLE.
            return reject(error);
          }
          sound.setVolume(1);
          console.log(`Sound ${soundPath} loaded successfully.`);
          resolve(sound);
        });
      });
      try {
        await soundCache[packName][soundFile]; // Wait for this sound to load
      } catch (error) {
        // Handle individual sound load error if necessary
      }
    }
  }
  console.log(`Sound pack ${packName} preloading initiated.`);
};

export const playSound = async (packName, soundFile) => {
  if (!packName || !soundFile) {
    console.warn('Attempted to play sound with no packName or soundFile');
    return;
  }

  try {
    if (
      soundCache[packName] &&
      soundCache[packName][soundFile] instanceof Promise
    ) {
      const soundInstance = await soundCache[packName][soundFile];
      if (soundInstance) {
        soundInstance.getCurrentTime(isPlayed => {
          // Play from the beginning.
          // For very short sounds, this check might be less relevant,
          // but good for slightly longer ones if retriggered quickly.
          // For drum pads, always playing from start is usually desired.
          soundInstance.stop(() => {
            soundInstance.play(success => {
              if (!success) {
                console.error(`Playback failed for ${soundFile}`);
              }
            });
          });
        });
      } else {
        console.error(
          `Sound instance not found for ${soundFile} in ${packName} after loading.`,
        );
      }
    } else {
      console.warn(
        `Sound ${soundFile} from pack ${packName} not preloaded or load failed.`,
      );
      // Optionally, attempt to load and play on demand (will have latency)
      // For now, we rely on preloading.
    }
  } catch (error) {
    console.error(`Error playing sound ${soundFile}:`, error);
  }
};

// Release all sounds for a pack (e.g., when switching packs to free memory)
// This is a basic implementation. More sophisticated cache management might be needed.
export const releaseSoundPack = packName => {
  if (soundCache[packName]) {
    Object.values(soundCache[packName]).forEach(async soundPromise => {
      try {
        const sound = await soundPromise;
        sound?.release();
      } catch (e) {
        /* ignore errors on release */
      }
    });
    delete soundCache[packName];
    console.log(`Released sound pack: ${packName}`);
  }
};

// Metronome tick sound (simple implementation)
let metronomeTickSound;
export const loadMetronomeTick = async () => {
  return new Promise((resolve, reject) => {
    if (metronomeTickSound) {
      resolve(metronomeTickSound);
      return;
    }
    // Ensure you have a 'metronome_tick.wav' in your main assets bundle
    // e.g., assets/sounds/metronome_tick.wav and link it appropriately.
    // For this demo, we'll assume it's in the root of bundled assets.
    // Or place it in: android/app/src/main/assets/sounds/metronome_tick.wav
    metronomeTickSound = new Sound(
      'metronome_tick.wav',
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          console.error('Failed to load metronome tick sound', error);
          return reject(error);
        }
        metronomeTickSound.setVolume(0.7);
        resolve(metronomeTickSound);
      },
    );
  });
};

export const playMetronomeTick = async () => {
  try {
    const tick = await loadMetronomeTick(); // Ensures it's loaded
    tick?.play(success => {
      if (!success) {
        console.error('Metronome tick playback failed.');
      }
    });
  } catch (error) {
    console.error('Error playing metronome tick:', error);
  }
};

// Call this when the app starts or when sound packs are defined
// preloadSoundPack('hiphop_kit', ['hiphop_kick.wav', ...]);
// preloadSoundPack('edm_kit', ['edm_kick.wav', ...]);
