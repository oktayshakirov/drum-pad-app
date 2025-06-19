const PAD_COLORS = {
  // Drums group - Electric Green shades
  DRUMS_MAIN: '#00E676', // Material Green
  DRUMS_ACCENT: '#69F0AE', // Light Green
  // Percussion group - Blue shades
  PERC_MAIN: '#2196F3', // Blue
  PERC_ACCENT: '#64B5F6', // Light Blue
  // Melody group - Purple shades
  MELODY_MAIN: '#9C27B0', // Purple
  MELODY_ACCENT: '#BA68C8', // Light Purple
  // Synth group - Orange shades
  SYNTH_MAIN: '#FF9800', // Orange
  SYNTH_ACCENT: '#FFB74D', // Light Orange
  // SFX group - Red shades
  SFX_MAIN: '#F44336', // Red
  SFX_ACCENT: '#EF5350', // Light Red
};

export default {
  id: 'energy',
  name: 'Energy',
  genre: 'Hip Hop',
  bpm: 140,
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    kick: require('./samples/kick.mp3'),
    clap: require('./samples/clap.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    hi_hat_roll: require('./samples/hi_hat_roll.mp3'),
    hit: require('./samples/hit.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    // Synths
    synth_1: require('./samples/synth_1.mp3'),
    synth_2: require('./samples/synth_2.mp3'),
    // SFX and Chants
    sfx_walkie_talkie: require('./samples/sfx_walkie_talkie.mp3'),
    chant_female: require('./samples/chant_female.mp3'),
  },
  soundGroups: {
    // Only one melody can play at a time
    melody: ['melody_1', 'melody_2'],
    // Only one synth can play at a time
    synth: ['synth_1', 'synth_2'],
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'hi_hat', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 4, sound: 'open_hat', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'hi_hat_roll', color: PAD_COLORS.PERC_MAIN},
    {id: 6, sound: 'hit', color: PAD_COLORS.PERC_ACCENT},
    {id: 7, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN, group: 'melody'},
    {
      id: 8,
      sound: 'melody_2',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
    },
    {id: 9, sound: 'synth_1', color: PAD_COLORS.SYNTH_MAIN, group: 'synth'},
    {id: 10, sound: 'synth_2', color: PAD_COLORS.SYNTH_ACCENT, group: 'synth'},
    {id: 11, sound: 'sfx_walkie_talkie', color: PAD_COLORS.SFX_MAIN},
    {id: 12, sound: 'chant_female', color: PAD_COLORS.SFX_ACCENT},
  ],
};
