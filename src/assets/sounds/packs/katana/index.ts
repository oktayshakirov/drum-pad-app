import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Blue shades
  DRUMS_MAIN: '#A7C7E7', // Soft Pastel Blue
  DRUMS_ACCENT: '#D0E6FA', // Lighter Pastel Blue
  // Bass group - Soft Pastel Silver shades
  BASS_MAIN: '#D3D3D3', // Soft Pastel Silver
  BASS_ACCENT: '#E9E9E9', // Lighter Pastel Silver
  // Melody group - Soft Pastel Silver shades
  MELODY_MAIN: '#E9E9E9', // Soft Pastel Silver
  MELODY_ACCENT: '#F5F5F5', // Lighter Pastel Silver
  // SFX group - Soft Pastel Blue shades
  SFX_MAIN: '#A7C7E7', // Soft Pastel Blue
  SFX_ACCENT: '#D0E6FA', // Lighter Pastel Blue
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
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN, icon: 'drums'},
    {id: 2, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN, icon: 'drums'},
    {id: 3, sound: 'drums_3', color: PAD_COLORS.DRUMS_MAIN, icon: 'drums'},
    {id: 4, sound: 'snare', color: PAD_COLORS.DRUMS_ACCENT, icon: 'snare'},
    {id: 5, sound: 'melody_1_1', color: PAD_COLORS.MELODY_MAIN, icon: 'melody'},
    {id: 6, sound: 'melody_1_2', color: PAD_COLORS.MELODY_MAIN, icon: 'melody'},
    {id: 7, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN, icon: 'melody'},
    {id: 8, sound: 'melody_3', color: PAD_COLORS.MELODY_MAIN, icon: 'melody'},
    {id: 9, sound: 'synth', color: PAD_COLORS.MELODY_ACCENT, icon: 'synth'},
    {id: 10, sound: 'sfx_sword_1', color: PAD_COLORS.SFX_MAIN, icon: 'sword'},
    {id: 11, sound: 'sfx_sword_2', color: PAD_COLORS.SFX_MAIN, icon: 'sword'},
    {
      id: 12,
      sound: 'sfx_reverse',
      color: PAD_COLORS.SFX_ACCENT,
      icon: 'reverse',
    },
  ],
};

export default soundPack;
