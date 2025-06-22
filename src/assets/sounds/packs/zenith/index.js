const PAD_COLORS = {
  // Drums group - Very light Lavender shades
  DRUMS_MAIN: '#F8F0FF', // Very Light Lavender
  DRUMS_ACCENT: '#FCF8FF', // Extremely Light Lavender
  // Percussion group - Very light Coral shades
  PERCUSSION_MAIN: '#FFF0F0', // Very Light Coral
  PERCUSSION_ACCENT: '#FFF8F8', // Extremely Light Pink
  // Melody group - Very light Indigo shades
  MELODY_MAIN: '#F0F0FF', // Very Light Indigo
  MELODY_ACCENT: '#F8F8FF', // Extremely Light Lavender
  // SFX group - Very light Blue shades
  SFX_MAIN: '#F0F8FF', // Very Light Blue
  SFX_ACCENT: '#F8FCFF', // Extremely Light Blue
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
