const PAD_COLORS = {
  DRUMS: '#00FFFF', // Cyan
  BASS: '#FF00FF', // Magenta
  LEAD: '#FFFF00', // Yellow
  FX: '#7FFF00', // Chartreuse
};

export default {
  id: 'edm',
  name: 'Along Trap',
  genre: 'EDM',
  cover: require('../hiphop/cover.jpeg'),
  sounds: {
    kick: require('../hiphop/hiphop_snare.wav'),
    snare: require('../hiphop/hiphop_snare.wav'),
    hi_hat: require('../hiphop/hiphop_snare.wav'),
    clap: require('../hiphop/hiphop_clap.wav'),
    snap: require('../hiphop/hiphop_snap.wav'),
    open_hat: require('../hiphop/hiphop_open_hat.wav'),
    melody1: require('../hiphop/hiphop_melody1.wav'),
    melody2: require('../hiphop/hiphop_melody2.wav'),
    gun_sfx: require('../hiphop/hiphop_gun_sfx.wav'),
    adlib1_sfx: require('../hiphop/hiphop_adlib1_sfx.wav'),
    adlib2_sfx: require('../hiphop/hiphop_adlib2_sfx.wav'),
    808: require('../hiphop/hiphop_808.wav'),
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS},
    {id: 2, sound: 'snare', color: PAD_COLORS.DRUMS},
    {id: 3, sound: 'hi_hat', color: PAD_COLORS.DRUMS},
    {id: 4, sound: 'clap', color: PAD_COLORS.DRUMS},
    {id: 5, sound: 'snap', color: PAD_COLORS.DRUMS},
    {id: 6, sound: 'open_hat', color: PAD_COLORS.DRUMS},
    {id: 7, sound: 'melody1', color: PAD_COLORS.LEAD},
    {id: 8, sound: 'melody2', color: PAD_COLORS.LEAD},
    {id: 9, sound: 'gun_sfx', color: PAD_COLORS.FX},
    {id: 10, sound: 'adlib1_sfx', color: PAD_COLORS.FX},
    {id: 11, sound: 'adlib2_sfx', color: PAD_COLORS.FX},
    {id: 12, sound: '808', color: PAD_COLORS.BASS},
  ],
};
