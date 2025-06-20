const PAD_COLORS = {
  // Drums group - Electric Blue shades
  DRUMS_MAIN: '#1976D2', // Blue
  DRUMS_ACCENT: '#64B5F6', // Light Blue
  // Percussion group - Green shades
  PERC_MAIN: '#43A047', // Green
  PERC_ACCENT: '#A5D6A7', // Light Green
  // Melody group - Orange shades
  MELODY_MAIN: '#FFB300', // Vivid Orange
  MELODY_ACCENT: '#FFD54F', // Light Orange
  // Brass group - Gold shades
  BRASS_MAIN: '#FFD700', // Gold
  BRASS_ACCENT: '#FFF8DC', // Cornsilk
  // SFX/Chant group - Red shades
  SFX_MAIN: '#E53935', // Red
  SFX_ACCENT: '#FF8A80', // Light Red
};

export default {
  id: 'outtaControl',
  name: 'Outta Control',
  genre: 'Trap',
  bpm: 160,
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  background: ['#1a1a1a', '#2d2d2d'], // Dark gradient
  sounds: {
    // Drums
    drums: require('./samples/drums.mp3'),
    snare: require('./samples/snare.mp3'),
    kick: require('./samples/kick.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    // Synths
    synth_1: require('./samples/synth_1.mp3'),
    synth_2: require('./samples/synth_2.mp3'),
    // Brass
    brass_1: require('./samples/brass_1.mp3'),
    brass_2: require('./samples/brass_2.mp3'),
    // Chants
    chant_shyah: require('./samples/chant_shyah.mp3'),
  },
  soundGroups: {
    melody: ['melody_1', 'melody_2', 'melody_3'],
    synth: ['synth_1', 'synth_2'],
    brass: ['brass_1', 'brass_2'],
  },
  padConfig: [
    {id: 1, sound: 'drums', color: PAD_COLORS.DRUMS_MAIN, group: 'drums'},
    {id: 2, sound: 'snare', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 3, sound: 'kick', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 4, sound: 'hi_hat', color: PAD_COLORS.PERC_MAIN},
    {id: 5, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN, group: 'melody'},
    {id: 6, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN, group: 'melody'},
    {
      id: 7,
      sound: 'melody_3',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
    },
    {id: 8, sound: 'synth_1', color: PAD_COLORS.PERC_ACCENT, group: 'synth'},
    {id: 9, sound: 'synth_2', color: PAD_COLORS.PERC_ACCENT, group: 'synth'},
    {id: 10, sound: 'brass_1', color: PAD_COLORS.BRASS_MAIN, group: 'brass'},
    {id: 11, sound: 'brass_2', color: PAD_COLORS.BRASS_ACCENT, group: 'brass'},
    {id: 12, sound: 'chant_shyah', color: PAD_COLORS.SFX_MAIN},
  ],
};
