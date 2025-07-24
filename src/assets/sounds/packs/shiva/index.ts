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
  id: 'shiva',
  name: 'Shiva',
  genre: 'Indian Trap',
  bpm: '95',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    flute: require('./samples/flute.mp3'),
    // Chants
    chant_hey: require('./samples/chant_hey.mp3'),
    // Drums
    drums_1_1: require('./samples/drums_1_1.mp3'),
    drums_1_2: require('./samples/drums_1_2.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    clap: require('./samples/clap.mp3'),
    hit: require('./samples/hit.mp3'),
    shaker: require('./samples/shaker.mp3'),
    // Percussion
    percussion_1: require('./samples/percussion_1.mp3'),
    percussion_2: require('./samples/percussion_2.mp3'),
  },
  soundGroups: {
    melodies: ['melody_1', 'melody_2'],
    drums: ['drums_1_1', 'drums_1_2', 'drums_2'],
    percussion: ['percussion_1', 'percussion_2'],
  },
  padConfig: [
    {id: 1, sound: 'drums_1_1', color: PAD_COLORS.DRUMS_MAIN, icon: 'drums'},
    {id: 2, sound: 'drums_1_2', color: PAD_COLORS.DRUMS_MAIN, icon: 'drums'},
    {id: 3, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN, icon: 'drums'},
    {id: 4, sound: 'clap', color: PAD_COLORS.DRUMS_ACCENT, icon: 'clap'},
    {id: 5, sound: 'hit', color: PAD_COLORS.DRUMS_ACCENT, icon: 'hit'},
    {id: 6, sound: 'shaker', color: PAD_COLORS.BASS_MAIN, icon: 'shaker'},
    {
      id: 7,
      sound: 'percussion_1',
      color: PAD_COLORS.BASS_ACCENT,
      icon: 'percussion',
    },
    {
      id: 8,
      sound: 'percussion_2',
      color: PAD_COLORS.BASS_ACCENT,
      icon: 'percussion',
    },
    {id: 9, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN, icon: 'melody'},
    {id: 10, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN, icon: 'melody'},
    {id: 11, sound: 'flute', color: PAD_COLORS.MELODY_ACCENT, icon: 'flute'},
    {id: 12, sound: 'chant_hey', color: PAD_COLORS.SFX_MAIN, icon: 'chant'},
  ],
};

export default soundPack;
