const PAD_COLORS = {
  // Drums group - Deep Black shades
  DRUMS_MAIN: '#000000', // Black
  DRUMS_ACCENT: '#1A1A1A', // Dark Gray
  // Bass group - Deep Red shades
  BASS_MAIN: '#8B0000', // DarkRed
  BASS_ACCENT: '#A52A2A', // Brown
  // Melody group - Deep Purple shades
  MELODY_MAIN: '#4B0082', // Indigo
  MELODY_ACCENT: '#663399', // RebeccaPurple
  // SFX group - Deep Blue shades
  SFX_MAIN: '#000080', // Navy
  SFX_ACCENT: '#00008B', // DarkBlue
};

export default {
  id: 'zenith',
  name: 'Zenith',
  genre: 'Hip Hop',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    kick: require('./samples/kick.mp3'),
    clap: require('./samples/clap.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    crash: require('./samples/crash.mp3'),
    drums: require('./samples/drums.mp3'),
    shaker: require('./samples/shaker.mp3'),
    percussion_1: require('./samples/percussion_1.mp3'),
    percussion_2: require('./samples/percussion_2.mp3'),
    melody_1: require('./samples/melody_1.mp3'),
    melody_2_1: require('./samples/melody_2_1.mp3'),
    melody_2_2: require('./samples/melody_2_2.mp3'),
    vocal: require('./samples/vocal.mp3'),
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'hi_hat', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'crash', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'drums', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'shaker', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'percussion_1', color: PAD_COLORS.BASS_MAIN},
    {id: 8, sound: 'percussion_2', color: PAD_COLORS.BASS_ACCENT},
    {id: 9, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 10, sound: 'melody_2_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 11, sound: 'melody_2_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'vocal', color: PAD_COLORS.MELODY_ACCENT},
  ],
};
