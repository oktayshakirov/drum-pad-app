const PAD_COLORS = {
  // Drums group - Soft Pastel Blue shades
  DRUMS_MAIN: '#A7C7E7', // Soft Pastel Blue
  DRUMS_ACCENT: '#D0E6FA', // Lighter Pastel Blue
  // Bass group - Soft Pastel Purple shades
  BASS_MAIN: '#BFA2DB', // Soft Pastel Purple
  BASS_ACCENT: '#D6C1E6', // Lighter Pastel Purple
  // Melody group - Soft Pastel Gold shades
  MELODY_MAIN: '#FFE5A2', // Soft Pastel Gold
  MELODY_ACCENT: '#FFF2CC', // Lighter Pastel Gold
  // SFX group - Soft Pastel Silver shades
  SFX_MAIN: '#D3D3D3', // Soft Pastel Silver
  SFX_ACCENT: '#E9E9E9', // Lighter Pastel Silver
};

export default {
  id: 'yamaha',
  name: 'Yamaha',
  genre: 'Hip Hop',
  bpm: '140',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Melodies (Choir)
    choir_1: require('./samples/choir_1.mp3'),
    choir_2: require('./samples/choir_2.mp3'),
    choir_3: require('./samples/choir_3.mp3'),
    // Drums
    kick: require('./samples/kick.mp3'),
    snare_1: require('./samples/snare_1.mp3'),
    snare_2: require('./samples/snare_2.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    snap: require('./samples/snap.mp3'),
    // Drum Loops
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    // SFX
    sfx_motorbike: require('./samples/sfx_motorbike.mp3'),
  },
  soundGroups: {
    melodies: ['choir_1', 'choir_2', 'choir_3'],
    drums: ['drums_1', 'drums_2'],
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
    {id: 9, sound: 'hi_hat', color: PAD_COLORS.BASS_ACCENT},
    {id: 10, sound: 'choir_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 11, sound: 'choir_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'choir_3', color: PAD_COLORS.MELODY_ACCENT},
  ],
};
