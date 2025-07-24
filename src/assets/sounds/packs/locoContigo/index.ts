import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Orange shades
  DRUMS_MAIN: '#FFB347', // Soft Pastel Orange
  DRUMS_ACCENT: '#FFD700', // Lighter Pastel Orange
  // Bass group - Soft Pastel Yellow shades
  BASS_MAIN: '#F0E68C', // Soft Pastel Yellow
  BASS_ACCENT: '#F5F5DC', // Lighter Pastel Yellow
  // Melody group - Soft Pastel Red shades
  MELODY_MAIN: '#FFB6C1', // Soft Pastel Red
  MELODY_ACCENT: '#FFC0CB', // Lighter Pastel Red
  // SFX group - Soft Pastel Pink shades
  SFX_MAIN: '#FFB6C1', // Soft Pastel Pink
  SFX_ACCENT: '#FFC0CB', // Lighter Pastel Pink
};

const soundPack: SoundPack = {
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
    {id: 1, sound: 'drums', color: PAD_COLORS.DRUMS_MAIN, icon: 'drums'},
    {id: 2, sound: 'open_hat', color: PAD_COLORS.DRUMS_MAIN, icon: 'open_hat'},
    {id: 3, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN, icon: 'clap'},
    {id: 4, sound: 'snare_roll', color: PAD_COLORS.DRUMS_ACCENT, icon: 'snare'},
    {
      id: 5,
      sound: 'percussion',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'percussion',
    },
    {id: 6, sound: 'bass_808', color: PAD_COLORS.BASS_MAIN, icon: 'bass'},
    {
      id: 7,
      sound: 'melody_1_1',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'trumpet',
    },
    {
      id: 8,
      sound: 'melody_1_2',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'trumpet',
    },
    {
      id: 9,
      sound: 'melody_2_1',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'trumpet',
    },
    {
      id: 10,
      sound: 'melody_2_2',
      color: PAD_COLORS.MELODY_ACCENT,
      icon: 'trumpet',
    },
    {
      id: 11,
      sound: 'melody_3_1',
      color: PAD_COLORS.MELODY_ACCENT,
      icon: 'melody',
    },
    {
      id: 12,
      sound: 'melody_3_2',
      color: PAD_COLORS.MELODY_ACCENT,
      icon: 'melody',
    },
  ],
};

export default soundPack;
