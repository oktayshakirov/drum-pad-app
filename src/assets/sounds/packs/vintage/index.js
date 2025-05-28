const PAD_COLORS = {
  // Drums group - Warm Brown shades
  DRUMS_MAIN: '#8B4513', // SaddleBrown
  DRUMS_ACCENT: '#A0522D', // Sienna
  // Bass group - Deep Brown shades
  BASS_MAIN: '#654321', // DarkBrown
  BASS_ACCENT: '#8B4513', // SaddleBrown
  // Melody group - Warm Orange shades
  MELODY_MAIN: '#FF7F50', // Coral
  MELODY_ACCENT: '#FF6347', // Tomato
  // SFX group - Turquoise shades
  SFX_MAIN: '#40E0D0', // Turquoise
  SFX_ACCENT: '#48D1CC', // MediumTurquoise
};

export default {
  id: 'vintage',
  name: 'Vintage',
  genre: 'Hip Hop',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    clap: require('./samples/clap.mp3'),
    snap: require('./samples/snap.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    crash: require('./samples/crash.mp3'),
    melody_1_1: require('./samples/melody_1_1.mp3'),
    melody_1_2: require('./samples/melody_1_2.mp3'),
    melody_2_1: require('./samples/melody_2_1.mp3'),
    melody_2_2: require('./samples/melody_2_2.mp3'),
    vocals_1: require('./samples/vocals_1.mp3'),
    vocals_2: require('./samples/vocals_2.mp3'),
  },
  padConfig: [
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'snap', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'open_hat', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'crash', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'melody_1_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 8, sound: 'melody_1_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 9, sound: 'melody_2_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 10, sound: 'melody_2_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 11, sound: 'vocals_1', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'vocals_2', color: PAD_COLORS.MELODY_ACCENT},
  ],
};
