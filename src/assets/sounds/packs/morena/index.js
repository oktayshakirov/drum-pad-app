const PAD_COLORS = {
  // Drums group - Warm Orange shades
  DRUMS_MAIN: '#FFA500', // Orange
  DRUMS_ACCENT: '#FFB74D', // Light Orange
  // Melody group - Warm Yellow shades
  MELODY_MAIN: '#FFD700', // Gold
  MELODY_ACCENT: '#FFE082', // Light Gold
  // SFX group - Warm Red shades
  SFX_MAIN: '#FF6B6B', // Light Red
  SFX_ACCENT: '#FF8A80', // Very Light Red
};

export default {
  id: 'morena',
  name: 'Morena',
  genre: 'Balkan Pop',
  bpm: '140',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    clap: require('./samples/clap.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    triangle: require('./samples/triangle.mp3'),
    percussion: require('./samples/percussion.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    melody_4: require('./samples/melody_4.mp3'),
    melody_5: require('./samples/melody_5.mp3'),
    // Chants
    chant_azis: require('./samples/chant_azis.mp3'),
  },
  // Define sound groups for playback control
  soundGroups: {
    // Drum group - only one drum pattern can play at a time
    drums: ['drums_1', 'drums_2'],
    // Melody group - only one melody can play at a time
    melody: ['melody_1', 'melody_2', 'melody_3', 'melody_4', 'melody_5'],
  },
  padConfig: [
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN, group: 'drums'},
    {id: 2, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN, group: 'drums'},
    {id: 3, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'open_hat', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'triangle', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'percussion', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN, group: 'melody'},
    {id: 8, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN, group: 'melody'},
    {id: 9, sound: 'melody_3', color: PAD_COLORS.MELODY_MAIN, group: 'melody'},
    {
      id: 10,
      sound: 'melody_4',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
    },
    {
      id: 11,
      sound: 'melody_5',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
    },
    {id: 12, sound: 'chant_azis', color: PAD_COLORS.SFX_MAIN},
  ],
};
