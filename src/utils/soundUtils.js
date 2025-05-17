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
    snap: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_snap.wav'),
      android: 'asset:/sounds/hiphop/hiphop_snap.wav',
    }),
    open_hat: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_open_hat.wav'),
      android: 'asset:/sounds/hiphop/hiphop_open_hat.wav',
    }),
    melody1: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_melody1.wav'),
      android: 'asset:/sounds/hiphop/hiphop_melody1.wav',
    }),
    melody2: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_melody2.wav'),
      android: 'asset:/sounds/hiphop/hiphop_melody2.wav',
    }),
    gun_sfx: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_gun_sfx.wav'),
      android: 'asset:/sounds/hiphop/hiphop_gun_sfx.wav',
    }),
    adlib1_sfx: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_adlib1_sfx.wav'),
      android: 'asset:/sounds/hiphop/hiphop_adlib1_sfx.wav',
    }),
    adlib2_sfx: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_adlib2_sfx.wav'),
      android: 'asset:/sounds/hiphop/hiphop_adlib2_sfx.wav',
    }),
    808: Platform.select({
      ios: require('../assets/sounds/hiphop/hiphop_808.wav'),
      android: 'asset:/sounds/hiphop/hiphop_808.wav',
    }),
  },
  edm: {
    //add next sound pack here
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
  if (!SOUND_PATHS[packName]) {
    return [];
  }
  return Object.keys(SOUND_PATHS[packName]).map(sound => ({
    id: `${packName}_${sound}`,
    name: sound,
    path: getSoundPath(packName, sound),
  }));
};
