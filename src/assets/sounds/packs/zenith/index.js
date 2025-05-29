const PAD_COLORS = {
  // Drums group - Light Lavender shades
  DRUMS_MAIN: '#B39DDB', // Lavender
  DRUMS_ACCENT: '#D1C4E9', // Light Lavender
  // Bass group - Light Coral shades
  BASS_MAIN: '#FFB6B3', // Light Coral
  BASS_ACCENT: '#FFD1DC', // Very Light Pink
  // Melody group - Light Indigo shades
  MELODY_MAIN: '#B3B6E8', // Light Indigo
  MELODY_ACCENT: '#D6D6F7', // Pale Lavender
  // SFX group - Light Blue shades
  SFX_MAIN: '#90CAF9', // Light Blue
  SFX_ACCENT: '#B3E5FC', // Lighter Blue
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
