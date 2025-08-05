import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Pink shades
  DRUMS_MAIN: '#FFB6C1', // Soft Pastel Pink
  DRUMS_ACCENT: '#FFC0CB', // Lighter Pastel Pink
  // Bass group - Soft Pastel Rose shades
  BASS_MAIN: '#FFB6C1', // Soft Pastel Rose
  BASS_ACCENT: '#FFC0CB', // Lighter Pastel Rose
  // Melody group - Soft Pastel Coral shades
  MELODY_MAIN: '#FF7F50', // Soft Pastel Coral
  MELODY_ACCENT: '#FFA07A', // Lighter Pastel Coral
  // SFX group - Soft Pastel Peach shades
  SFX_MAIN: '#FFDAB9', // Soft Pastel Peach
  SFX_ACCENT: '#FFE4B5', // Lighter Pastel Peach
};

const soundPack: SoundPack = {
  id: 'morena',
  name: 'Morena',
  genre: 'Balkan Pop',
  bpm: '140',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    clap: require('./samples/clap.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    triangle: require('./samples/triangle.mp3'),
    percussion: require('./samples/percussion.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    melody_4: require('./samples/melody_4.mp3'),
    melody_5: require('./samples/melody_5.mp3'),
    // Chants
    chant_azis: require('./samples/chant_azis.mp3'),
  },
  soundGroups: {
    drums: ['drums_1', 'drums_2'],
    melody: ['melody_1', 'melody_2', 'melody_3', 'melody_4', 'melody_5'],
  },
  padConfig: [
    {
      id: 1,
      sound: 'drums_1',
      color: PAD_COLORS.DRUMS_MAIN,
      group: 'drums',
      icon: 'drums',
      title: 'Drums I',
    },
    {
      id: 2,
      sound: 'drums_2',
      color: PAD_COLORS.DRUMS_MAIN,
      group: 'drums',
      icon: 'drums',
      title: 'Drums II',
    },
    {
      id: 3,
      sound: 'clap',
      color: PAD_COLORS.DRUMS_MAIN,
      icon: 'clap',
      title: 'Clap',
    },
    {
      id: 4,
      sound: 'open_hat',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'open_hat',
      title: 'Open Hat',
    },
    {
      id: 5,
      sound: 'triangle',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'triangle',
      title: 'Triangle',
    },
    {
      id: 6,
      sound: 'percussion',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'percussion',
      title: 'Percussion',
    },
    {
      id: 7,
      sound: 'melody_1',
      color: PAD_COLORS.MELODY_MAIN,
      group: 'melody',
      icon: 'melody',
      title: 'Melody I',
    },
    {
      id: 8,
      sound: 'melody_2',
      color: PAD_COLORS.MELODY_MAIN,
      group: 'melody',
      icon: 'melody',
      title: 'Melody II',
    },
    {
      id: 9,
      sound: 'melody_3',
      color: PAD_COLORS.MELODY_MAIN,
      group: 'melody',
      icon: 'melody',
      title: 'Melody III',
    },
    {
      id: 10,
      sound: 'melody_4',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
      icon: 'melody',
      title: 'Melody IV',
    },
    {
      id: 11,
      sound: 'melody_5',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
      icon: 'melody',
      title: 'Melody V',
    },
    {
      id: 12,
      sound: 'chant_azis',
      color: PAD_COLORS.SFX_MAIN,
      icon: 'chant',
      title: 'Azis Chant',
    },
  ],
};

export default soundPack;
