const PAD_COLORS = {
  // Drums group - Light Steel Blue shades
  DRUMS_MAIN: '#B0C4DE', // LightSteelBlue
  DRUMS_ACCENT: '#E3F2FD', // Very Light Blue
  // Bass group - Light Silver shades
  BASS_MAIN: '#E0E0E0', // Light Silver
  BASS_ACCENT: '#F5F5F5', // Very Light Silver
  // Melody group - Light Silver shades
  MELODY_MAIN: '#F5F5F5', // Very Light Silver
  MELODY_ACCENT: '#E0E0E0', // Light Silver
  // SFX group - Light Blue shades
  SFX_MAIN: '#B3E5FC', // Light Blue
  SFX_ACCENT: '#E1F5FE', // Very Light Blue
};

export default {
  id: 'katana',
  name: 'Katana',
  genre: 'Trap',
  bpm: '140',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  background: ['#1a1a1a', '#2d2d2d'], // Dark gradient
  sounds: {
    // Drums
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    drums_3: require('./samples/drums_3.mp3'),
    snare: require('./samples/snare.mp3'),
    // Melodies
    melody_1_1: require('./samples/melody_1_1.mp3'),
    melody_1_2: require('./samples/melody_1_2.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    synth: require('./samples/synth.mp3'),
    // SFX
    sfx_sword_1: require('./samples/sfx_sword_1.mp3'),
    sfx_sword_2: require('./samples/sfx_sword_2.mp3'),
    sfx_reverse: require('./samples/sfx_reverse.mp3'),
  },
  soundGroups: {
    drums: ['drums_1', 'drums_2', 'drums_3'],
    melody_1: ['melody_1_1', 'melody_1_2'],
    melody_2and3: ['melody_2', 'melody_3'],
  },
  padConfig: [
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'drums_3', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'snare', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'melody_1_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 6, sound: 'melody_1_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 7, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 8, sound: 'melody_3', color: PAD_COLORS.MELODY_MAIN},
    {id: 9, sound: 'synth', color: PAD_COLORS.MELODY_ACCENT},
    {id: 10, sound: 'sfx_sword_1', color: PAD_COLORS.SFX_MAIN},
    {id: 11, sound: 'sfx_sword_2', color: PAD_COLORS.SFX_MAIN},
    {id: 12, sound: 'sfx_reverse', color: PAD_COLORS.SFX_ACCENT},
  ],
};
