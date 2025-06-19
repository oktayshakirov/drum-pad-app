const PAD_COLORS = {
  // Drums group - Red shades
  DRUMS_MAIN: '#D32F2F', // Red
  DRUMS_ACCENT: '#FFCDD2', // Light Red
  // Percussion group - Green shades
  PERC_MAIN: '#388E3C', // Green
  PERC_ACCENT: '#A5D6A7', // Light Green
  // Melody group - Gold shades
  MELODY_MAIN: '#FFD700', // Gold
  MELODY_ACCENT: '#FFF8DC', // Cornsilk
  // Bells group - Silver/Blue shades
  BELLS_MAIN: '#90CAF9', // Light Blue
  BELLS_ACCENT: '#E1F5FE', // Very Light Blue
  // Chants group - Purple shades
  CHANT_MAIN: '#8E24AA', // Purple
  CHANT_ACCENT: '#CE93D8', // Light Purple
};

export default {
  id: 'xmas',
  name: 'Xmas',
  genre: 'Trap',
  bpm: 120,
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    kick: require('./samples/kick.mp3'),
    snare: require('./samples/snare.mp3'),
    clap: require('./samples/clap.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    // Bells
    bells_1: require('./samples/bells_1.mp3'),
    bells_2: require('./samples/bells_2.mp3'),
    // Chants
    chant_merry_christmas: require('./samples/chant_merry_christmas.mp3'),
    chant_christmas_morning: require('./samples/chant_christmas_morning.mp3'),
  },
  soundGroups: {
    melody: ['melody_1', 'melody_2', 'melody_3'],
    bells: ['bells_1', 'bells_2'],
    chant: ['chant_merry_christmas', 'chant_christmas_morning'],
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'snare', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 3, sound: 'clap', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 4, sound: 'hi_hat', color: PAD_COLORS.PERC_MAIN},
    {id: 5, sound: 'open_hat', color: PAD_COLORS.PERC_ACCENT},
    {id: 6, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN, group: 'melody'},
    {
      id: 7,
      sound: 'melody_2',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
    },
    {
      id: 8,
      sound: 'melody_3',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
    },
    {id: 9, sound: 'bells_1', color: PAD_COLORS.BELLS_MAIN, group: 'bells'},
    {id: 10, sound: 'bells_2', color: PAD_COLORS.BELLS_ACCENT, group: 'bells'},
    {
      id: 11,
      sound: 'chant_merry_christmas',
      color: PAD_COLORS.CHANT_MAIN,
      group: 'chant',
    },
    {
      id: 12,
      sound: 'chant_christmas_morning',
      color: PAD_COLORS.CHANT_ACCENT,
      group: 'chant',
    },
  ],
};
