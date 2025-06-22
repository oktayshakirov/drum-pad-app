const PAD_COLORS = {
  // Drums group - Soft Pastel Red shades
  DRUMS_MAIN: '#F7A8A8', // Soft Pastel Red
  DRUMS_ACCENT: '#FADCD9', // Lighter Pastel Red
  // Bass group - Soft Pastel Brown shades
  BASS_MAIN: '#E2CFC3', // Soft Pastel Brown
  BASS_ACCENT: '#F6E2B3', // Lighter Pastel Brown
  // Melody group - Soft Pastel Yellow shades
  MELODY_MAIN: '#FFF2A2', // Soft Pastel Yellow
  MELODY_ACCENT: '#FFF9CC', // Lighter Pastel Yellow
  // SFX group - Soft Pastel Orange shades
  SFX_MAIN: '#FFD8B1', // Soft Pastel Orange
  SFX_ACCENT: '#FFE5B4', // Lighter Pastel Orange
};

export default {
  id: 'locoContigo',
  name: 'Loco Contigo',
  genre: 'R&B',
  bpm: '113',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    drums: require('./samples/drums.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    clap: require('./samples/clap.mp3'),
    snare_roll: require('./samples/snare_roll.mp3'),
    percussion: require('./samples/percussion.mp3'),
    // Bass
    bass_808: require('./samples/808.mp3'),
    // Melodies
    melody_1_1: require('./samples/melody_1_1.mp3'),
    melody_1_2: require('./samples/melody_1_2.mp3'),
    melody_2_1: require('./samples/melody_2_1.mp3'),
    melody_2_2: require('./samples/melody_2_2.mp3'),
    melody_3_1: require('./samples/melody_3_1.mp3'),
    melody_3_2: require('./samples/melody_3_2.mp3'),
  },
  soundGroups: {
    melody_1: ['melody_1_1', 'melody_1_2'],
    melody_2: ['melody_2_1', 'melody_2_2'],
    melody_3: ['melody_3_1', 'melody_3_2'],
  },
  padConfig: [
    {id: 1, sound: 'drums', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'open_hat', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'snare_roll', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'percussion', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'bass_808', color: PAD_COLORS.BASS_MAIN},
    {id: 7, sound: 'melody_1_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 8, sound: 'melody_1_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 9, sound: 'melody_2_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 10, sound: 'melody_2_2', color: PAD_COLORS.MELODY_ACCENT},
    {id: 11, sound: 'melody_3_1', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'melody_3_2', color: PAD_COLORS.MELODY_ACCENT},
  ],
};
