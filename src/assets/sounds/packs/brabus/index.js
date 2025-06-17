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
  genre: 'Drill',
  bpm: '150',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    drums_3: require('./samples/drums_3.mp3'),
    drums_4: require('./samples/drums_4.mp3'),
    drums_5: require('./samples/drums_5.mp3'),
    drums_6: require('./samples/drums_6.mp3'),
    snare: require('./samples/snare.mp3'),
    snare_roll: require('./samples/snare_roll.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    hit_1: require('./samples/hit_1.mp3'),
    hit_2: require('./samples/hit_2.mp3'),
    hit_3: require('./samples/hit_3.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2_1: require('./samples/melody_2_1.mp3'),
    melody_2_2: require('./samples/melody_2_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    synth_1: require('./samples/synth_1.mp3'),
    synth_2: require('./samples/synth_2.mp3'),
    // Choirs
    choir_1: require('./samples/choir_1.mp3'),
    choir_2: require('./samples/choir_2.mp3'),
    // SFX and Chants
    sfx_sirens: require('./samples/sfx_sirens.mp3'),
    sfx_money: require('./samples/sfx_money.mp3'),
    chant_fight: require('./samples/chant_fight.mp3'),
    chant_countdown: require('./samples/chant_countdown.mp3'),
  },
  soundGroups: {
    drums: ['drums_1', 'drums_2', 'drums_3', 'drums_4', 'drums_5', 'drums_6'],
    melody_1and3: ['melody_1', 'melody_3'],
    melody_2: ['melody_2_1', 'melody_2_2'],
    synth: ['synth_1', 'synth_2'],
    choir: ['choir_1', 'choir_2'],
    chant: ['chant_fight', 'chant_countdown'],
  },
  padConfig: [
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'drums_3', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'drums_4', color: PAD_COLORS.DRUMS_MAIN},
    {id: 5, sound: 'drums_5', color: PAD_COLORS.DRUMS_MAIN},
    {id: 6, sound: 'drums_6', color: PAD_COLORS.DRUMS_MAIN},
    {id: 7, sound: 'snare', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 8, sound: 'snare_roll', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 9, sound: 'hi_hat', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 10, sound: 'hit_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 11, sound: 'hit_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 12, sound: 'hit_3', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 13, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 14, sound: 'melody_2_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 15, sound: 'melody_2_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 16, sound: 'melody_3', color: PAD_COLORS.MELODY_MAIN},
    {id: 17, sound: 'synth_1', color: PAD_COLORS.MELODY_ACCENT},
    {id: 18, sound: 'synth_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 19, sound: 'choir_1', color: PAD_COLORS.MELODY_ACCENT},
    {id: 20, sound: 'choir_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 21, sound: 'sfx_sirens', color: PAD_COLORS.SFX_MAIN},
    {id: 22, sound: 'sfx_money', color: PAD_COLORS.SFX_MAIN},
    {id: 23, sound: 'chant_fight', color: PAD_COLORS.SFX_ACCENT},
    {id: 24, sound: 'chant_countdown', color: PAD_COLORS.SFX_ACCENT},
  ],
};
