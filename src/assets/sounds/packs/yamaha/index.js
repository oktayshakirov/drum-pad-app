const PAD_COLORS = {
  // Drums group - Deep Blue shades
  DRUMS_MAIN: '#000080', // Navy
  DRUMS_ACCENT: '#00008B', // DarkBlue
  // Bass group - Deep Purple shades
  BASS_MAIN: '#4B0082', // Indigo
  BASS_ACCENT: '#663399', // RebeccaPurple
  // Melody group - Gold shades
  MELODY_MAIN: '#FFD700', // Gold
  MELODY_ACCENT: '#DAA520', // GoldenRod
  // SFX group - Silver shades
  SFX_MAIN: '#C0C0C0', // Silver
  SFX_ACCENT: '#A9A9A9', // DarkGray
};

export default {
  id: 'yamaha',
  name: 'Yamaha',
  genre: 'Hip Hop',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    kick: require('./samples/kick.mp3'),
    snare_1: require('./samples/snare_1.mp3'),
    snare_2: require('./samples/snare_2.mp3'),
    sfx_motorbike: require('./samples/sfx_motorbike.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    snap: require('./samples/snap.mp3'),
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    percussion: require('./samples/percussion.wav'),
    choir_1: require('./samples/choir_1.mp3'),
    choir_2: require('./samples/choir_2.mp3'),
    choir_3: require('./samples/choir_3.mp3'),
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'snare_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'snare_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'sfx_motorbike', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'open_hat', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'snap', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'drums_1', color: PAD_COLORS.BASS_MAIN},
    {id: 8, sound: 'drums_2', color: PAD_COLORS.BASS_MAIN},
    {id: 9, sound: 'percussion', color: PAD_COLORS.BASS_ACCENT},
    {id: 10, sound: 'choir_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 11, sound: 'choir_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'choir_3', color: PAD_COLORS.MELODY_ACCENT},
  ],
};
