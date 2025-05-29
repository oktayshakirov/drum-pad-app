const PAD_COLORS = {
  // Drums group - Light Gold shades
  DRUMS_MAIN: '#FFE082', // Light Gold
  DRUMS_ACCENT: '#FFF8DC', // Cornsilk
  // Bass group - Light Gray shades
  BASS_MAIN: '#E0E0E0', // LightGray
  BASS_ACCENT: '#F5F5F5', // Very LightGray
  // Melody group - Light Yellow shades
  MELODY_MAIN: '#FFF59D', // Light Yellow
  MELODY_ACCENT: '#FFE082', // Light Gold
  // SFX group - Light Silver shades
  SFX_MAIN: '#F5F5F5', // Very Light Silver
  SFX_ACCENT: '#E5E4E2', // Platinum
};

export default {
  id: 'brabus',
  name: 'Brabus',
  genre: 'Electronic',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    drums_1: require('./samples/drums_1.mp3'),
    drums_1_2: require('./samples/drums_1_2.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    drums_2_2: require('./samples/drums_2_2.mp3'),
    drums_2_3: require('./samples/drums_2_3.mp3'),
    snare: require('./samples/snare.mp3'),
    snare_roll_1: require('./samples/snare_roll_1.mp3'),
    snare_roll_2: require('./samples/snare_roll_2.mp3'),
    hit_1: require('./samples/hit_1.mp3'),
    hit_2: require('./samples/hit_2.mp3'),
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    synth_1: require('./samples/synth_1.mp3'),
    synth_2: require('./samples/synth_2.mp3'),
    choir_1: require('./samples/choir_1.mp3'),
    choir_1_2: require('./samples/choir_1_2.mp3'),
    choir_2: require('./samples/choir_2.mp3'),
    choir_3: require('./samples/choir_3.mp3'),
    sfx_sirens_1: require('./samples/sfx_sirens_1.mp3'),
    sfx_sirens_2: require('./samples/sfx_sirens_2.mp3'),
    sfx_money: require('./samples/sfx_money.mp3'),
    chant_fight: require('./samples/chant_fight.mp3'),
    chant_countdown: require('./samples/chant_countdown.mp3'),
  },
  padConfig: [
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'drums_1_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'drums_2_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 5, sound: 'drums_2_3', color: PAD_COLORS.DRUMS_MAIN},
    {id: 6, sound: 'snare', color: PAD_COLORS.DRUMS_MAIN},
    {id: 7, sound: 'snare_roll_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 8, sound: 'snare_roll_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 9, sound: 'hit_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 10, sound: 'hit_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 11, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 12, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 13, sound: 'melody_3', color: PAD_COLORS.MELODY_MAIN},
    {id: 14, sound: 'synth_1', color: PAD_COLORS.MELODY_ACCENT},
    {id: 15, sound: 'synth_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 16, sound: 'choir_1', color: PAD_COLORS.MELODY_ACCENT},
    {id: 17, sound: 'choir_1_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 18, sound: 'choir_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 19, sound: 'choir_3', color: PAD_COLORS.MELODY_ACCENT},
    {id: 20, sound: 'sfx_sirens_1', color: PAD_COLORS.SFX_MAIN},
    {id: 21, sound: 'sfx_sirens_2', color: PAD_COLORS.SFX_MAIN},
    {id: 22, sound: 'sfx_money', color: PAD_COLORS.SFX_ACCENT},
    {id: 23, sound: 'chant_fight', color: PAD_COLORS.SFX_ACCENT},
    {id: 24, sound: 'chant_countdown', color: PAD_COLORS.SFX_ACCENT},
  ],
};
