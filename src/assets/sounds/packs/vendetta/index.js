const PAD_COLORS = {
  // Drums group - Light Sky Blue shades
  DRUMS_MAIN: '#81D4FA', // Sky Blue
  DRUMS_ACCENT: '#B3E5FC', // Lighter Sky Blue
  // Bass group - Light Salmon shades
  BASS_MAIN: '#FFAB91', // Light Salmon
  BASS_ACCENT: '#FFD180', // Light Orange
  // Melody group - Light Purple shades
  MELODY_MAIN: '#CE93D8', // Light Purple
  MELODY_ACCENT: '#E1BEE7', // Lighter Purple
  // SFX group - Light Green shades
  SFX_MAIN: '#A5D6A7', // Light Green
  SFX_ACCENT: '#C8E6C9', // Lighter Green
};

export default {
  id: 'vendetta',
  name: 'Vendetta',
  genre: 'Trap',
  bpm: '100',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    melody_4: require('./samples/melody_4.mp3'),
    // Synths
    synth_1: require('./samples/synth_1.mp3'),
    synth_2: require('./samples/synth_2.mp3'),
    // Chants
    chant_demon: require('./samples/chant_demon.mp3'),
    chant_die: require('./samples/chant_die.mp3'),
    chant_sorry: require('./samples/chant_sorry.mp3'),
    // Drums
    snare: require('./samples/snare.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    clap_1: require('./samples/clap_1.mp3'),
    clap_2: require('./samples/clap_2.mp3'),
    hit_1: require('./samples/hit_1.mp3'),
    hit_2: require('./samples/hit_2.mp3'),
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    percussion: require('./samples/percussion.mp3'),
    bass_808: require('./samples/808.mp3'),
    // SFX
    sfx_chains: require('./samples/sfx_chains.mp3'),
    sfx_distortion: require('./samples/sfx_distortion.mp3'),
    sfx_dubstep_drop: require('./samples/sfx_dubstep_drop.mp3'),
    sfx_dubstep_filler: require('./samples/sfx_dubstep_filler.mp3'),
    sfx_glass: require('./samples/sfx_glass.mp3'),
  },
  soundGroups: {
    melodies: ['melody_1', 'melody_2', 'melody_3', 'melody_4'],
    sfx: [
      'sfx_chains',
      'sfx_distortion',
      'sfx_dubstep_drop',
      'sfx_dubstep_filler',
      'sfx_glass',
    ],
    chants: ['chant_demon', 'chant_die', 'chant_sorry'],
    drums: ['drums_1', 'drums_2'],
  },
  padConfig: [
    {id: 1, sound: 'snare', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'hi_hat', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'clap_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'clap_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'hit_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'hit_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'drums_1', color: PAD_COLORS.BASS_MAIN},
    {id: 8, sound: 'drums_2', color: PAD_COLORS.BASS_MAIN},
    {id: 9, sound: 'percussion', color: PAD_COLORS.BASS_ACCENT},
    {id: 10, sound: 'bass_808', color: PAD_COLORS.BASS_ACCENT},
    {id: 11, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 12, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 13, sound: 'melody_3', color: PAD_COLORS.MELODY_MAIN},
    {id: 14, sound: 'melody_4', color: PAD_COLORS.MELODY_MAIN},
    {id: 15, sound: 'synth_1', color: PAD_COLORS.MELODY_ACCENT},
    {id: 16, sound: 'synth_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 17, sound: 'chant_demon', color: PAD_COLORS.MELODY_ACCENT},
    {id: 18, sound: 'chant_die', color: PAD_COLORS.MELODY_ACCENT},
    {id: 19, sound: 'chant_sorry', color: PAD_COLORS.MELODY_ACCENT},
    {id: 20, sound: 'sfx_chains', color: PAD_COLORS.SFX_MAIN},
    {id: 21, sound: 'sfx_distortion', color: PAD_COLORS.SFX_MAIN},
    {id: 22, sound: 'sfx_dubstep_drop', color: PAD_COLORS.SFX_MAIN},
    {id: 23, sound: 'sfx_dubstep_filler', color: PAD_COLORS.SFX_ACCENT},
    {id: 24, sound: 'sfx_glass', color: PAD_COLORS.SFX_ACCENT},
  ],
};
