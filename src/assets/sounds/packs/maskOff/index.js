const PAD_COLORS = {
  // Drums group - Soft Pastel Gray shades
  DRUMS_MAIN: '#CFCFCF', // Soft Pastel Gray
  DRUMS_ACCENT: '#E5E5E5', // Lighter Pastel Gray
  // Bass group - Soft Pastel Purple shades
  BASS_MAIN: '#BFA2DB', // Soft Pastel Purple
  BASS_ACCENT: '#D6C1E6', // Lighter Pastel Purple
  // Melody group - Soft Pastel Blue shades
  MELODY_MAIN: '#A7C7E7', // Soft Pastel Blue
  MELODY_ACCENT: '#D0E6FA', // Lighter Pastel Blue
  // SFX group - Soft Pastel Green shades
  SFX_MAIN: '#B7EFC5', // Soft Pastel Green
  SFX_ACCENT: '#D6F5E3', // Lighter Pastel Green
};

export default {
  id: 'maskOff',
  name: 'Mask Off',
  genre: 'Trap',
  bpm: '134',
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
