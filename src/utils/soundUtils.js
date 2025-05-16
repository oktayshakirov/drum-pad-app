import {Platform} from 'react-native';

export const SOUND_PACKS = ['hiphop', 'edm'];

const SOUND_PATHS = {
  hiphop: {
    kick: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_kick.wav'),
      android: 'asset:/sounds/hiphop/hiphop_kick.wav',
    }),
    snare: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_snare.wav'),
      android: 'asset:/sounds/hiphop/hiphop_snare.wav',
    }),
    hi_hat: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_hi_hat.wav'),
      android: 'asset:/sounds/hiphop/hiphop_hi_hat.wav',
    }),
    clap: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_clap.wav'),
      android: 'asset:/sounds/hiphop/hiphop_clap.wav',
    }),
  },
  edm: {
    kick: Platform.select({
      ios: require('../assets/sounds/edm/edm_kick.wav'),
      android: 'asset:/sounds/edm/edm_kick.wav',
    }),
    snare: Platform.select({
      ios: require('../assets/sounds/edm/edm_snare.wav'),
      android: 'asset:/sounds/edm/edm_snare.wav',
    }),
    hi_hat: Platform.select({
      ios: require('../assets/sounds/edm/edm_hi_hat.wav'),
      android: 'asset:/sounds/edm/edm_hi_hat.wav',
    }),
    clap: Platform.select({
      ios: require('../assets/sounds/edm/edm_clap.wav'),
      android: 'asset:/sounds/edm/edm_clap.wav',
    }),
  },
  metronome: {
    tick: Platform.select({
      ios: require('../assets/sounds/metronome_tick.wav'),
      android: 'asset:/sounds/metronome_tick.wav',
    }),
  },
};

export const getSoundPath = (packName, soundName) => {
  return SOUND_PATHS[packName]?.[soundName] || null;
};

export const getAvailableSounds = packName => {
  const sounds = ['kick', 'snare', 'hi_hat', 'clap'];
  return sounds.map(sound => ({
    id: `${packName}_${sound}`,
    name: sound,
    path: getSoundPath(packName, sound),
  }));
};
