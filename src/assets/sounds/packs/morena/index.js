const PAD_COLORS = {
  // Drums group - Very light Orange shades
  DRUMS_MAIN: '#FFF8F0', // Very Light Orange
  DRUMS_ACCENT: '#FFFCF8', // Extremely Light Orange
  // Melody group - Very light Yellow shades
  MELODY_MAIN: '#FFFEF0', // Very Light Yellow
  MELODY_ACCENT: '#FFFFF8', // Extremely Light Yellow
  // SFX group - Very light Red shades
  SFX_MAIN: '#FFF0F0', // Very Light Red
  SFX_ACCENT: '#FFF8F8', // Extremely Light Red
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
  soundGroups: {
    drums: ['drums_1', 'drums_2'],
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
