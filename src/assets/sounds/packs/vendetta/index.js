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
  id: 'vendetta',
  name: 'Vendetta',
  genre: 'Dubstep',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    kick: require('./samples/kick.mp3'),
    snare: require('./samples/snare.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    clap_1: require('./samples/clap_1.mp3'),
    clap_2: require('./samples/clap_2.mp3'),
    hit_1: require('./samples/hit_1.mp3'),
    hit_2: require('./samples/hit_2.mp3'),
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    percussion: require('./samples/percussion.mp3'),
    808: require('./samples/808.mp3'),
    melody: require('./samples/melody.mp3'),
    synth_1: require('./samples/synth_1.mp3'),
    synth_2: require('./samples/synth_2.mp3'),
    synth_3: require('./samples/synth_3.mp3'),
    chant_demon: require('./samples/chant_demon.mp3'),
    chant_die: require('./samples/chant_die.mp3'),
    chant_sorry: require('./samples/chant_sorry.mp3'),
    sfx_chains: require('./samples/sfx_chains.mp3'),
    sfx_distortion: require('./samples/sfx_distortion.mp3'),
    sfx_dubstep_drop: require('./samples/sfx_dubstep_drop.mp3'),
    sfx_dubstep_filler: require('./samples/sfx_dubstep_filler.mp3'),
    sfx_glass: require('./samples/sfx_glass.mp3'),
    sfx_reverse: require('./samples/sfx_reverse.mp3'),
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'snare', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'hi_hat', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'clap_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'clap_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'hit_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'hit_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 8, sound: 'drums_1', color: PAD_COLORS.BASS_MAIN},
    {id: 9, sound: 'drums_2', color: PAD_COLORS.BASS_MAIN},
    {id: 10, sound: 'percussion', color: PAD_COLORS.BASS_ACCENT},
    {id: 11, sound: '808', color: PAD_COLORS.BASS_ACCENT},
    {id: 12, sound: 'melody', color: PAD_COLORS.MELODY_MAIN},
    {id: 13, sound: 'synth_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 14, sound: 'synth_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 15, sound: 'synth_3', color: PAD_COLORS.MELODY_ACCENT},
    {id: 16, sound: 'chant_demon', color: PAD_COLORS.MELODY_ACCENT},
    {id: 17, sound: 'chant_die', color: PAD_COLORS.MELODY_ACCENT},
    {id: 18, sound: 'chant_sorry', color: PAD_COLORS.MELODY_ACCENT},
    {id: 19, sound: 'sfx_chains', color: PAD_COLORS.SFX_MAIN},
    {id: 20, sound: 'sfx_distortion', color: PAD_COLORS.SFX_MAIN},
    {id: 21, sound: 'sfx_dubstep_drop', color: PAD_COLORS.SFX_MAIN},
    {id: 22, sound: 'sfx_dubstep_filler', color: PAD_COLORS.SFX_ACCENT},
    {id: 23, sound: 'sfx_glass', color: PAD_COLORS.SFX_ACCENT},
    {id: 24, sound: 'sfx_reverse', color: PAD_COLORS.SFX_ACCENT},
  ],
};
