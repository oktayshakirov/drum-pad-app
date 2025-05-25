export const SOUND_PACKS = {
  hiphop: {
    id: 'hiphop',
    name: "Flexin'",
    genre: 'Hip-Hop',
    image: require('../assets/sounds/hiphop/cover.jpeg'),
  },
  edm: {
    id: 'edm',
    name: 'Along Trap',
    genre: 'EDM',
    image: require('../assets/sounds/hiphop/cover.jpeg'),
  },
};

const PAD_COLORS = [
  '#BA55D3', // MediumOrchid - for drums
  '#FFA500', // Orange - for kick and 808
  '#32CD32', // LimeGreen - for melodies
  '#1E90FF', // DodgerBlue - for SFX
];

const generatePadConfig = () => {
  return [
    {id: 1, sound: 'kick', color: PAD_COLORS[1]},
    {id: 2, sound: 'snare', color: PAD_COLORS[0]},
    {id: 3, sound: 'hi_hat', color: PAD_COLORS[0]},
    {id: 4, sound: 'clap', color: PAD_COLORS[0]},
    {id: 5, sound: 'snap', color: PAD_COLORS[0]},
    {id: 6, sound: 'open_hat', color: PAD_COLORS[0]},
    {id: 7, sound: 'melody1', color: PAD_COLORS[2]},
    {id: 8, sound: 'melody2', color: PAD_COLORS[2]},
    {id: 9, sound: 'gun_sfx', color: PAD_COLORS[3]},
    {id: 10, sound: 'adlib1_sfx', color: PAD_COLORS[3]},
    {id: 11, sound: 'adlib2_sfx', color: PAD_COLORS[3]},
    {id: 12, sound: '808', color: PAD_COLORS[1]},
  ];
};

const PAD_CONFIGS = {
  hiphop: generatePadConfig(),
  edm: generatePadConfig(),
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
    kick: require('../assets/sounds/hiphop/hiphop_snare.wav'),
    snare: require('../assets/sounds/hiphop/hiphop_snare.wav'),
    hi_hat: require('../assets/sounds/hiphop/hiphop_snare.wav'),
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
