import Sound from 'react-native-sound';

Sound.setCategory('Playback');

const DEFAULT_VOLUME = 1.0;
const METRONOME_VOLUME = 0.7;
const soundCache = {};

export const preloadSoundPack = async (packName, soundFiles) => {
  if (!packName || !soundFiles?.length) {
    console.warn('Invalid sound pack data provided');
    return;
  }

  console.log(`Preloading sound pack: ${packName}`);
  soundCache[packName] = soundCache[packName] || {};

  const loadPromises = soundFiles.map(async soundFile => {
    if (!soundFile || soundCache[packName][soundFile]) {
      return;
    }

    const soundPath = `${packName.toLowerCase()}/${soundFile}`;
    console.log(`Loading sound: ${soundPath}`);

    try {
      soundCache[packName][soundFile] = await new Promise((resolve, reject) => {
        const sound = new Sound(soundPath, Sound.MAIN_BUNDLE, error => {
          if (error) {
            console.error(`Failed to load sound ${soundPath}:`, error);
            reject(error);
            return;
          }
          sound.setVolume(DEFAULT_VOLUME);
          resolve(sound);
        });
      });
    } catch (error) {
      console.error(`Error loading sound ${soundPath}:`, error);
      delete soundCache[packName][soundFile];
    }
  });

  await Promise.all(loadPromises);
  console.log(`Sound pack ${packName} loaded successfully`);
};

export const playSound = async (packName, soundFile) => {
  if (!packName || !soundFile) {
    console.warn('Invalid sound parameters');
    return;
  }

  try {
    const soundPromise = soundCache[packName]?.[soundFile];
    if (!soundPromise) {
      console.warn(`Sound ${soundFile} not preloaded in ${packName}`);
      return;
    }

    const soundInstance = await soundPromise;
    if (!soundInstance) {
      console.error(`Sound instance not found for ${soundFile}`);
      return;
    }

    soundInstance.stop(() => {
      soundInstance.play(success => {
        if (!success) {
          console.error(`Playback failed for ${soundFile}`);
        }
      });
    });
  } catch (error) {
    console.error(`Error playing sound ${soundFile}:`, error);
  }
};

export const releaseSoundPack = async packName => {
  if (!soundCache[packName]) {
    return;
  }

  try {
    const releasePromises = Object.values(soundCache[packName]).map(
      async soundPromise => {
        try {
          const sound = await soundPromise;
          if (sound?.isPlaying()) {
            sound.stop();
          }
          sound?.release();
        } catch (error) {
          console.warn(`Error releasing sound in ${packName}:`, error);
        }
      },
    );

    await Promise.all(releasePromises);
    delete soundCache[packName];
    console.log(`Released sound pack: ${packName}`);
  } catch (error) {
    console.error(`Error releasing sound pack ${packName}:`, error);
  }
};

let metronomeTickSound = null;

export const loadMetronomeTick = async () => {
  if (metronomeTickSound) {
    return metronomeTickSound;
  }

  try {
    metronomeTickSound = await new Promise((resolve, reject) => {
      const sound = new Sound(
        'metronome_tick.wav',
        Sound.MAIN_BUNDLE,
        error => {
          if (error) {
            console.error('Failed to load metronome tick:', error);
            reject(error);
            return;
          }
          sound.setVolume(METRONOME_VOLUME);
          resolve(sound);
        },
      );
    });
    return metronomeTickSound;
  } catch (error) {
    console.error('Error loading metronome tick:', error);
    metronomeTickSound = null;
    throw error;
  }
};

export const playMetronomeTick = async () => {
  try {
    const tick = await loadMetronomeTick();
    if (!tick) {
      return;
    }

    tick.stop(() => {
      tick.play(success => {
        if (!success) {
          console.error('Metronome tick playback failed');
        }
      });
    });
  } catch (error) {
    console.error('Error playing metronome tick:', error);
  }
};

export const cleanup = async () => {
  try {
    const releasePromises = Object.keys(soundCache).map(packName =>
      releaseSoundPack(packName),
    );
    await Promise.all(releasePromises);

    if (metronomeTickSound) {
      metronomeTickSound.release();
      metronomeTickSound = null;
    }
  } catch (error) {
    console.error('Error during cleanup:', error);
  }
};
