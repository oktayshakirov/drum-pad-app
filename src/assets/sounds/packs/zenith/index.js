const PAD_COLORS = {
  // Drums group - Light Lavender shades
  DRUMS_MAIN: '#B39DDB', // Lavender
  DRUMS_ACCENT: '#D1C4E9', // Light Lavender
  // Percussion group - Light Coral shades
  PERCUSSION_MAIN: '#FFB6B3', // Light Coral
  PERCUSSION_ACCENT: '#FFD1DC', // Very Light Pink
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
  genre: 'R&B',
  bpm: '120',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Melodies first
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    // Drums
    kick: require('./samples/kick.mp3'),
    clap: require('./samples/clap.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    crash: require('./samples/crash.mp3'),
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    // Percussion
    percussion_1: require('./samples/percussion_1.mp3'),
    percussion_2: require('./samples/percussion_2.mp3'),
    // Vocals
    vocal: require('./samples/vocal.mp3'),
  },
  soundGroups: {
    melodies: ['melody_1', 'melody_2', 'melody_3'],
    drums: ['drums_1', 'drums_2'],
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'hi_hat', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'crash', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'drums_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'drums_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'percussion_1', color: PAD_COLORS.PERCUSSION_MAIN},
    {id: 8, sound: 'percussion_2', color: PAD_COLORS.PERCUSSION_ACCENT},
    {id: 9, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 10, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 11, sound: 'melody_3', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'vocal', color: PAD_COLORS.MELODY_ACCENT},
  ],
};
