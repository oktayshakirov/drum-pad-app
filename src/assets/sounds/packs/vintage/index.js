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
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    melody_4: require('./samples/melody_4.mp3'),
    // Vocals
    vocals_1: require('./samples/vocals_1.mp3'),
    vocals_2: require('./samples/vocals_2.mp3'),
    vocals_3: require('./samples/vocals_3.mp3'),
    // Drums
    kick: require('./samples/kick.mp3'),
    clap: require('./samples/clap.mp3'),
    snap: require('./samples/snap.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    crash: require('./samples/crash.mp3'),
  },
  soundGroups: {
    melodies: ['melody_1', 'melody_2', 'melody_3', 'melody_4'],
    vocals: ['vocals_1', 'vocals_2', 'vocals_3'],
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'snap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'open_hat', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'crash', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 7, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 8, sound: 'melody_3', color: PAD_COLORS.MELODY_MAIN},
    {id: 9, sound: 'melody_4', color: PAD_COLORS.MELODY_MAIN},
    {id: 10, sound: 'vocals_1', color: PAD_COLORS.MELODY_ACCENT},
    {id: 11, sound: 'vocals_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'vocals_3', color: PAD_COLORS.MELODY_ACCENT},
  ],
};
