const PAD_COLORS = {
  // Drums group - Deep Gray shades
  DRUMS_MAIN: '#696969', // DimGray
  DRUMS_ACCENT: '#808080', // Gray
  // Bass group - Dark Gray shades
  BASS_MAIN: '#2F4F4F', // DarkSlateGray
  BASS_ACCENT: '#3C3C3C', // DarkGray
  // Melody group - Silver shades
  MELODY_MAIN: '#C0C0C0', // Silver
  MELODY_ACCENT: '#A9A9A9', // DarkGray
  // SFX group - Steel Blue shades
  SFX_MAIN: '#4682B4', // SteelBlue
  SFX_ACCENT: '#5F9EA0', // CadetBlue
};

export default {
  id: 'katana',
  name: 'Katana',
  genre: 'Electronic',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    drums_3: require('./samples/drums_3.mp3'),
    melody_1_1: require('./samples/melody_1_1.mp3'),
    melody_1_2: require('./samples/melody_1_2.mp3'),
    melody_2_1: require('./samples/melody_2_1.mp3'),
    melody_2_2: require('./samples/melody_2_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    synth: require('./samples/synth.mp3'),
    sfx_sword_1: require('./samples/sfx_sword_1.mp3'),
    sfx_sword_2: require('./samples/sfx_sword_2.mp3'),
    sfx_reverse: require('./samples/sfx_reverse.mp3'),
  },
  padConfig: [
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'drums_3', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'melody_1_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 5, sound: 'melody_1_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 6, sound: 'melody_2_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 7, sound: 'melody_2_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 8, sound: 'melody_3', color: PAD_COLORS.MELODY_MAIN},
    {id: 9, sound: 'synth', color: PAD_COLORS.MELODY_ACCENT},
    {id: 10, sound: 'sfx_sword_1', color: PAD_COLORS.SFX_MAIN},
    {id: 11, sound: 'sfx_sword_2', color: PAD_COLORS.SFX_MAIN},
    {id: 12, sound: 'sfx_reverse', color: PAD_COLORS.SFX_ACCENT},
  ],
};
