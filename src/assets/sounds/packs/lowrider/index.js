const PAD_COLORS = {
  // Drums group - Light Purple shades
  DRUMS_MAIN: '#E1BEE7', // Light Purple
  DRUMS_ACCENT: '#F3E5F5', // Very Light Purple
  // Bass group - Light Blue shades
  BASS_MAIN: '#B3E5FC', // Light Blue
  BASS_ACCENT: '#E1F5FE', // Very Light Blue
  // Melody group - Light Yellow shades
  MELODY_MAIN: '#FFF59D', // Light Yellow
  MELODY_ACCENT: '#FFE082', // Light Gold
  // SFX group - Light Silver shades
  SFX_MAIN: '#F5F5F5', // Very Light Silver
  SFX_ACCENT: '#E5E4E2', // Platinum
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
