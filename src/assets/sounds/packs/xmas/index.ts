import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Red shades
  DRUMS_MAIN: '#FFB6C1', // Soft Pastel Red
  DRUMS_ACCENT: '#FFC0CB', // Lighter Pastel Red
  // Bass group - Soft Pastel Green shades
  BASS_MAIN: '#98FB98', // Soft Pastel Green
  BASS_ACCENT: '#C0F0C0', // Lighter Pastel Green
  // Melody group - Soft Pastel Gold shades
  MELODY_MAIN: '#FFE5A2', // Soft Pastel Gold
  MELODY_ACCENT: '#FFF2CC', // Lighter Pastel Gold
  // SFX group - Soft Pastel Silver shades
  SFX_MAIN: '#D3D3D3', // Soft Pastel Silver
  SFX_ACCENT: '#E9E9E9', // Lighter Pastel Silver
  // Percussion group - Very light Green shades
  PERC_MAIN: '#F0FFF0', // Very Light Green
  PERC_ACCENT: '#F8FFF8', // Extremely Light Green
  // Bells group - Very light Blue shades
  BELLS_MAIN: '#F0F8FF', // Very Light Blue
  BELLS_ACCENT: '#F8FCFF', // Extremely Light Blue
  // Chants group - Very light Purple shades
  CHANT_MAIN: '#F8F0FF', // Very Light Purple
  CHANT_ACCENT: '#FCF8FF', // Extremely Light Purple
};

const soundPack: SoundPack = {
  id: 'xmas',
  name: 'Xmas',
  genre: 'Trap',
  bpm: 120,
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    kick: require('./samples/kick.mp3'),
    snare: require('./samples/snare.mp3'),
    clap: require('./samples/clap.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    // Bells
    bells_1: require('./samples/bells_1.mp3'),
    bells_2: require('./samples/bells_2.mp3'),
    // Chants
    chant_merry_christmas: require('./samples/chant_merry_christmas.mp3'),
    chant_christmas_morning: require('./samples/chant_christmas_morning.mp3'),
  },
  soundGroups: {
    melody: ['melody_1', 'melody_2', 'melody_3'],
    bells: ['bells_1', 'bells_2'],
    chant: ['chant_merry_christmas', 'chant_christmas_morning'],
  },
  padConfig: [
    {
      id: 1,
      sound: 'kick',
      color: PAD_COLORS.DRUMS_MAIN,
      icon: 'kick',
      title: 'Kick',
    },
    {
      id: 2,
      sound: 'snare',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'snare',
      title: 'Snare',
    },
    {
      id: 3,
      sound: 'clap',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'clap',
      title: 'Clap',
    },
    {
      id: 4,
      sound: 'hi_hat',
      color: PAD_COLORS.PERC_MAIN,
      icon: 'hi_hat',
      title: 'Hi Hat',
    },
    {
      id: 5,
      sound: 'open_hat',
      color: PAD_COLORS.PERC_ACCENT,
      icon: 'open_hat',
      title: 'Open Hat',
    },
    {
      id: 6,
      sound: 'melody_1',
      color: PAD_COLORS.MELODY_MAIN,
      group: 'melody',
      icon: 'melody',
      title: 'Melody I',
    },
    {
      id: 7,
      sound: 'melody_2',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
      icon: 'melody',
      title: 'Melody II',
    },
    {
      id: 8,
      sound: 'melody_3',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
      icon: 'melody',
      title: 'Melody III',
    },
    {
      id: 9,
      sound: 'bells_1',
      color: PAD_COLORS.BELLS_MAIN,
      group: 'bells',
      icon: 'bells',
      title: 'Bells I',
    },
    {
      id: 10,
      sound: 'bells_2',
      color: PAD_COLORS.BELLS_ACCENT,
      group: 'bells',
      icon: 'bells',
      title: 'Bells II',
    },
    {
      id: 11,
      sound: 'chant_merry_christmas',
      color: PAD_COLORS.CHANT_MAIN,
      group: 'chant',
      icon: 'chant',
      title: 'Merry Christmas',
    },
    {
      id: 12,
      sound: 'chant_christmas_morning',
      color: PAD_COLORS.CHANT_ACCENT,
      group: 'chant',
      icon: 'chant',
      title: 'Christmas Morning',
    },
  ],
};

export default soundPack;
