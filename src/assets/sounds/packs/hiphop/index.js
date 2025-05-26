const PAD_COLORS = {
  DRUMS: '#BA55D3', // MediumOrchid
  BASS: '#FFA500', // Orange
  MELODY: '#32CD32', // LimeGreen
  SFX: '#1E90FF', // DodgerBlue
};

export default {
  id: 'hiphop',
  name: "Flexin'",
  genre: 'Hip-Hop',
  cover: require('./cover.jpeg'),
  sounds: {
    kick: require('./hiphop_kick.wav'),
    snare: require('./hiphop_snare.wav'),
    hi_hat: require('./hiphop_hi_hat.wav'),
    clap: require('./hiphop_clap.wav'),
    snap: require('./hiphop_snap.wav'),
    open_hat: require('./hiphop_open_hat.wav'),
    melody1: require('./hiphop_melody1.wav'),
    melody2: require('./hiphop_melody2.wav'),
    gun_sfx: require('./hiphop_gun_sfx.wav'),
    adlib1_sfx: require('./hiphop_adlib1_sfx.wav'),
    adlib2_sfx: require('./hiphop_adlib2_sfx.wav'),
    808: require('./hiphop_808.wav'),
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.BASS},
    {id: 2, sound: 'snare', color: PAD_COLORS.DRUMS},
    {id: 3, sound: 'hi_hat', color: PAD_COLORS.DRUMS},
    {id: 4, sound: 'clap', color: PAD_COLORS.DRUMS},
    {id: 5, sound: 'snap', color: PAD_COLORS.DRUMS},
    {id: 6, sound: 'open_hat', color: PAD_COLORS.DRUMS},
    {id: 7, sound: 'melody1', color: PAD_COLORS.MELODY},
    {id: 8, sound: 'melody2', color: PAD_COLORS.MELODY},
    {id: 9, sound: 'gun_sfx', color: PAD_COLORS.SFX},
    {id: 10, sound: 'adlib1_sfx', color: PAD_COLORS.SFX},
    {id: 11, sound: 'adlib2_sfx', color: PAD_COLORS.SFX},
    {id: 12, sound: '808', color: PAD_COLORS.BASS},
  ],
};
