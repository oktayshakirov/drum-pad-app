import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Green shades
  DRUMS_MAIN: '#98FB98', // Soft Pastel Green
  DRUMS_ACCENT: '#C0F0C0', // Lighter Pastel Green
  // Bass group - Soft Pastel Teal shades
  BASS_MAIN: '#AFEEEE', // Soft Pastel Teal
  BASS_ACCENT: '#D0F0F0', // Lighter Pastel Teal
  // Melody group - Soft Pastel Mint shades
  MELODY_MAIN: '#F0FFF0', // Soft Pastel Mint
  MELODY_ACCENT: '#F8FFF8', // Lighter Pastel Mint
  // SFX group - Soft Pastel Sea Green shades
  SFX_MAIN: '#98D8C8', // Soft Pastel Sea Green
  SFX_ACCENT: '#C0E8D8', // Lighter Pastel Sea Green
};

const soundPack: SoundPack = {
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
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN, icon: 'kick'},
    {id: 2, sound: 'snare_1', color: PAD_COLORS.DRUMS_MAIN, icon: 'snare'},
    {id: 3, sound: 'snare_2', color: PAD_COLORS.DRUMS_MAIN, icon: 'snare'},
    {
      id: 4,
      sound: 'sfx_motorbike',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'sfx',
    },
    {
      id: 5,
      sound: 'open_hat',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'open_hat',
    },
    {id: 6, sound: 'snap', color: PAD_COLORS.DRUMS_ACCENT, icon: 'snap'},
    {id: 7, sound: 'drums_1', color: PAD_COLORS.BASS_MAIN, icon: 'drums'},
    {id: 8, sound: 'drums_2', color: PAD_COLORS.BASS_MAIN, icon: 'drums'},
    {id: 9, sound: 'hi_hat', color: PAD_COLORS.BASS_ACCENT, icon: 'hi_hat'},
    {
      id: 10,
      sound: 'choir_1',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'choir_male',
    },
    {
      id: 11,
      sound: 'choir_2',
      color: PAD_COLORS.MELODY_ACCENT,
      icon: 'choir_male',
    },
    {
      id: 12,
      sound: 'choir_3',
      color: PAD_COLORS.MELODY_ACCENT,
      icon: 'choir_female',
    },
  ],
};

export default soundPack;
