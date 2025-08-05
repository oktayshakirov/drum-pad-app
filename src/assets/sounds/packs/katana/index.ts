import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Dark Red/Brown with bright red icons
  DRUMS_MAIN: '#2d1b1b', // Dark Red-Brown
  DRUMS_ACCENT: '#3d2b2b', // Darker Red-Brown
  // Bass group - Dark Green with bright green icons
  BASS_MAIN: '#1b2d1b', // Dark Green
  BASS_ACCENT: '#2b3d2b', // Darker Green
  // Melody group - Dark Blue with bright blue icons
  MELODY_MAIN: '#1b1b2d', // Dark Blue
  MELODY_ACCENT: '#2b2b3d', // Darker Blue
  // SFX group - Dark Purple with bright purple icons
  SFX_MAIN: '#2d1b2d', // Dark Purple
  SFX_ACCENT: '#3d2b3d', // Darker Purple
};

const soundPack: SoundPack = {
  id: 'katana',
  name: 'Katana',
  genre: 'Trap',
  bpm: '140',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
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
    {
      id: 1,
      sound: 'drums_1',
      color: PAD_COLORS.DRUMS_MAIN,
      icon: 'drums',
      title: 'Drums I',
    },
    {
      id: 2,
      sound: 'drums_2',
      color: PAD_COLORS.DRUMS_MAIN,
      icon: 'drums',
      title: 'Drums II',
    },
    {
      id: 3,
      sound: 'drums_3',
      color: PAD_COLORS.DRUMS_MAIN,
      icon: 'drums',
      title: 'Drums III',
    },
    {
      id: 4,
      sound: 'snare',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'snare',
      title: 'Snare',
    },
    {
      id: 5,
      sound: 'melody_1_1',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody I',
    },
    {
      id: 6,
      sound: 'melody_1_2',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody II',
    },
    {
      id: 7,
      sound: 'melody_2',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody III',
    },
    {
      id: 8,
      sound: 'melody_3',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody IV',
    },
    {
      id: 9,
      sound: 'synth',
      color: PAD_COLORS.MELODY_ACCENT,
      icon: 'synth',
      title: 'Synth',
    },
    {
      id: 10,
      sound: 'sfx_sword_1',
      color: PAD_COLORS.SFX_MAIN,
      icon: 'sword',
      title: 'Sword I',
    },
    {
      id: 11,
      sound: 'sfx_sword_2',
      color: PAD_COLORS.SFX_MAIN,
      icon: 'sword',
      title: 'Sword II',
    },
    {
      id: 12,
      sound: 'sfx_reverse',
      color: PAD_COLORS.SFX_ACCENT,
      icon: 'reverse',
      title: 'Reverse',
    },
  ],
};

export default soundPack;
