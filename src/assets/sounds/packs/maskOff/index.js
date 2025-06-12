const PAD_COLORS = {
  // Drums group - Dark Gray shades
  DRUMS_MAIN: '#2C2C2C', // Dark Gray
  DRUMS_ACCENT: '#404040', // Lighter Dark Gray
  // Bass group - Deep Purple shades
  BASS_MAIN: '#4B0082', // Indigo
  BASS_ACCENT: '#663399', // RebeccaPurple
  // Melody group - Electric Blue shades
  MELODY_MAIN: '#00BFFF', // Deep Sky Blue
  MELODY_ACCENT: '#1E90FF', // Dodger Blue
  // SFX group - Neon Green shades
  SFX_MAIN: '#32CD32', // Lime Green
  SFX_ACCENT: '#7CFC00', // Lawn Green
};

export default {
  id: 'maskOff',
  name: 'Mask Off',
  genre: 'Hip Hop',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    synth: require('./samples/synth.mp3'),
    // Chants
    chant_1: require('./samples/chant_1.mp3'),
    chant_2: require('./samples/chant_2.mp3'),
    // Drums
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    drums_3: require('./samples/drums_3.mp3'),
    hit_1: require('./samples/hit_1.mp3'),
    hit_2: require('./samples/hit_2.mp3'),
    snare: require('./samples/snare.mp3'),
    // SFX
    sfx_dubstep_filler: require('./samples/sfx_dubstep_filler.mp3'),
  },
  soundGroups: {
    drums: ['drums_1', 'drums_2', 'drums_3'],
    melodies: ['melody_1', 'melody_2'],
  },
  padConfig: [
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'drums_3', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'hit_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'hit_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'snare', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 8, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 9, sound: 'synth', color: PAD_COLORS.MELODY_ACCENT},
    {id: 10, sound: 'chant_1', color: PAD_COLORS.BASS_MAIN},
    {id: 11, sound: 'chant_2', color: PAD_COLORS.BASS_ACCENT},
    {id: 12, sound: 'sfx_dubstep_filler', color: PAD_COLORS.SFX_MAIN},
  ],
};
