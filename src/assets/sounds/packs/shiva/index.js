const PAD_COLORS = {
  // Drums group - Deep Red shades
  DRUMS_MAIN: '#8B0000', // DarkRed
  DRUMS_ACCENT: '#A52A2A', // Brown
  // Bass group - Deep Orange shades
  BASS_MAIN: '#FF4500', // OrangeRed
  BASS_ACCENT: '#FF8C00', // DarkOrange
  // Melody group - Gold shades
  MELODY_MAIN: '#FFD700', // Gold
  MELODY_ACCENT: '#DAA520', // GoldenRod
  // SFX group - Silver shades
  SFX_MAIN: '#C0C0C0', // Silver
  SFX_ACCENT: '#A9A9A9', // DarkGray
};

export default {
  id: 'shiva',
  name: 'Shiva',
  genre: 'Hip Hop',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    flute: require('./samples/flute.mp3'),
    // Chants
    chant_hey: require('./samples/chant_hey.mp3'),
    // Drums
    drums_1_1: require('./samples/drums_1_1.mp3'),
    drums_1_2: require('./samples/drums_1_2.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    clap: require('./samples/clap.mp3'),
    hit: require('./samples/hit.mp3'),
    shaker: require('./samples/shaker.mp3'),
    // Percussion
    percussion_1: require('./samples/percussion_1.mp3'),
    percussion_2: require('./samples/percussion_2.mp3'),
  },
  padConfig: [
    {id: 1, sound: 'drums_1_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'drums_1_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'clap', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'hit', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'shaker', color: PAD_COLORS.BASS_MAIN},
    {id: 7, sound: 'percussion_1', color: PAD_COLORS.BASS_ACCENT},
    {id: 8, sound: 'percussion_2', color: PAD_COLORS.BASS_ACCENT},
    {id: 9, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 10, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 11, sound: 'flute', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'chant_hey', color: PAD_COLORS.SFX_MAIN},
  ],
};
