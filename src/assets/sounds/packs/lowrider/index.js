const PAD_COLORS = {
  // Drums group - Deep Purple shades
  DRUMS_MAIN: '#4B0082', // Indigo
  DRUMS_ACCENT: '#663399', // RebeccaPurple
  // Bass group - Deep Blue shades
  BASS_MAIN: '#000080', // Navy
  BASS_ACCENT: '#00008B', // DarkBlue
  // Melody group - Gold shades
  MELODY_MAIN: '#FFD700', // Gold
  MELODY_ACCENT: '#DAA520', // GoldenRod
  // SFX group - Silver shades
  SFX_MAIN: '#C0C0C0', // Silver
  SFX_ACCENT: '#A9A9A9', // DarkGray
};

export default {
  id: 'lowrider',
  name: 'Lowrider',
  genre: 'Hip Hop',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    kick: require('./samples/kick.mp3'),
    snare: require('./samples/snare.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    clap: require('./samples/clap.mp3'),
    hit: require('./samples/hit.mp3'),
    drums: require('./samples/drums.mp3'),
    percussion: require('./samples/percussion.mp3'),
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    chant_yeah: require('./samples/chant_yeah.mp3'),
    chant_breath: require('./samples/chant_breath.mp3'),
    sfx_gun: require('./samples/sfx_gun.mp3'),
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'snare', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'open_hat', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'clap', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'hit', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'drums', color: PAD_COLORS.BASS_MAIN},
    {id: 7, sound: 'percussion', color: PAD_COLORS.BASS_ACCENT},
    {id: 8, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 9, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 10, sound: 'chant_yeah', color: PAD_COLORS.MELODY_ACCENT},
    {id: 11, sound: 'chant_breath', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'sfx_gun', color: PAD_COLORS.SFX_MAIN},
  ],
};
