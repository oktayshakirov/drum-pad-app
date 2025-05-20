export const SOUND_PACKS = ['hiphop', 'edm'];

const SOUND_PATHS = {
  hiphop: {
    kick: require('../assets/sounds/hiphop/hiphop_kick.wav'),
    snare: require('../assets/sounds/hiphop/hiphop_snare.wav'),
    hi_hat: require('../assets/sounds/hiphop/hiphop_hi_hat.wav'),
    clap: require('../assets/sounds/hiphop/hiphop_clap.wav'),
    snap: require('../assets/sounds/hiphop/hiphop_snap.wav'),
    open_hat: require('../assets/sounds/hiphop/hiphop_open_hat.wav'),
    melody1: require('../assets/sounds/hiphop/hiphop_melody1.wav'),
    melody2: require('../assets/sounds/hiphop/hiphop_melody2.wav'),
    gun_sfx: require('../assets/sounds/hiphop/hiphop_gun_sfx.wav'),
    adlib1_sfx: require('../assets/sounds/hiphop/hiphop_adlib1_sfx.wav'),
    adlib2_sfx: require('../assets/sounds/hiphop/hiphop_adlib2_sfx.wav'),
    808: require('../assets/sounds/hiphop/hiphop_808.wav'),
  },
  edm: {
    //add next sound pack here
  },
  metronome: {
    tick: require('../assets/sounds/metronome_tick.wav'),
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
