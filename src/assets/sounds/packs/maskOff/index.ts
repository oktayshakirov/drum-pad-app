import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Gray shades
  DRUMS_MAIN: '#D3D3D3', // Soft Pastel Gray
  DRUMS_ACCENT: '#E9E9E9', // Lighter Pastel Gray
  // Bass group - Soft Pastel Dark Gray shades
  BASS_MAIN: '#A9A9A9', // Soft Pastel Dark Gray
  BASS_ACCENT: '#C0C0C0', // Lighter Pastel Dark Gray
  // Melody group - Soft Pastel Silver shades
  MELODY_MAIN: '#C0C0C0', // Soft Pastel Silver
  MELODY_ACCENT: '#D3D3D3', // Lighter Pastel Silver
  // SFX group - Soft Pastel Light Gray shades
  SFX_MAIN: '#E9E9E9', // Soft Pastel Light Gray
  SFX_ACCENT: '#F5F5F5', // Lighter Pastel Light Gray
};

const soundPack: SoundPack = {
  id: 'maskOff',
  name: 'Mask Off',
  genre: 'Trap',
  bpm: '134',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    synth: require('./samples/synth.mp3'),
    // Chants
    chant_1: require('./samples/chant_1.mp3'),
    chant_2: require('./samples/chant_2.mp3'),
    // Drums
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    drums_3: require('./samples/drums_3.mp3'),
    hit_1: require('./samples/hit_1.mp3'),
    hit_2: require('./samples/hit_2.mp3'),
    snare: require('./samples/snare.mp3'),
    // SFX
    sfx_dubstep_filler: require('./samples/sfx_dubstep_filler.mp3'),
  },
  soundGroups: {
    drums: ['drums_1', 'drums_2', 'drums_3'],
    melodies: ['melody_1', 'melody_2'],
  },
  padConfig: [
    {id: 1, sound: 'drums_1', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'drums_2', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'drums_3', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'hit_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'hit_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'snare', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 8, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 9, sound: 'synth', color: PAD_COLORS.MELODY_ACCENT},
    {id: 10, sound: 'chant_1', color: PAD_COLORS.BASS_MAIN},
    {id: 11, sound: 'chant_2', color: PAD_COLORS.BASS_ACCENT},
    {id: 12, sound: 'sfx_dubstep_filler', color: PAD_COLORS.SFX_MAIN},
  ],
};

export default soundPack;
