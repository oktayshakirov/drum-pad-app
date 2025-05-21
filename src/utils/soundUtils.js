export const SOUND_PACKS = ['hiphop', 'edm'];

const PAD_CONFIGS = {
  hiphop: [
    {id: 1, sound: 'kick', label: 'Kick'},
    {id: 2, sound: 'snare', label: 'Snare'},
    {id: 3, sound: 'hi_hat', label: 'Hi-Hat'},
    {id: 4, sound: 'clap', label: 'Clap'},
    {id: 5, sound: 'snap', label: 'Snap'},
    {id: 6, sound: 'open_hat', label: 'Open Hat'},
    {id: 7, sound: 'melody1', label: 'Melody 1'},
    {id: 8, sound: 'melody2', label: 'Melody 2'},
    {id: 9, sound: 'gun_sfx', label: 'Gun SFX'},
    {id: 10, sound: 'adlib1_sfx', label: 'Adlib 1'},
    {id: 11, sound: 'adlib2_sfx', label: 'Adlib 2'},
    {id: 12, sound: '808', label: '808'},
  ],
  edm: [
    {id: 1, sound: 'kick', label: 'EDM'},
    {id: 2, sound: 'snare', label: 'Snare'},
    {id: 3, sound: 'hi_hat', label: 'Hi-Hat'},
    {id: 4, sound: 'clap', label: 'Clap'},
    {id: 5, sound: 'snap', label: 'Snap'},
    {id: 6, sound: 'open_hat', label: 'Open Hat'},
    {id: 7, sound: 'melody1', label: 'Melody 1'},
    {id: 8, sound: 'melody2', label: 'Melody 2'},
    {id: 9, sound: 'gun_sfx', label: 'Gun SFX'},
    {id: 10, sound: 'adlib1_sfx', label: 'Adlib 1'},
    {id: 11, sound: 'adlib2_sfx', label: 'Adlib 2'},
    {id: 12, sound: '808', label: '808'},
  ],
};

const SOUND_MODULE_IDS = {
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
  metronome: {
    tick: require('../assets/sounds/metronome_tick.wav'),
  },
};

export const getSoundModuleId = (packName, soundName) => {
  return SOUND_MODULE_IDS[packName]?.[soundName] || null;
};

export const getAvailableSoundNames = packName => {
  if (!SOUND_MODULE_IDS[packName]) {
    return [];
  }
  return Object.keys(SOUND_MODULE_IDS[packName]);
};

export const getPadConfigs = packName => {
  return PAD_CONFIGS[packName] || [];
};
