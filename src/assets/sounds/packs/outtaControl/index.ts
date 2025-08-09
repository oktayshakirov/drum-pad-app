import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Cyan shades
  DRUMS_MAIN: '#40E0D0', // Soft Pastel Cyan
  DRUMS_ACCENT: '#7FFFD4', // Lighter Pastel Cyan
  // Bass group - Soft Pastel Blue shades
  BASS_MAIN: '#87CEEB', // Soft Pastel Blue
  BASS_ACCENT: '#B0E0E6', // Lighter Pastel Blue
  // Melody group - Soft Pastel Green shades
  MELODY_MAIN: '#98FB98', // Soft Pastel Green
  MELODY_ACCENT: '#C0F0C0', // Lighter Pastel Green
  // SFX group - Soft Pastel Purple shades
  SFX_MAIN: '#DDA0DD', // Soft Pastel Purple
  SFX_ACCENT: '#E6E6FA', // Lighter Pastel Purple
  // Percussion group - Very light Green shades
  PERC_MAIN: '#F0FFF0', // Very Light Green
  PERC_ACCENT: '#F8FFF8', // Extremely Light Green
  // Brass group - Very light Gold shades
  BRASS_MAIN: '#FFFEF0', // Very Light Gold
  BRASS_ACCENT: '#FFFFF8', // Extremely Light Gold
};

const soundPack: SoundPack = {
  id: 'outtaControl',
  name: 'Outta Control',
  genre: 'Trap',
  bpm: 160,
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  theme: 'light',
  sounds: {
    // Drums
    drums: require('./samples/drums.mp3'),
    snare: require('./samples/snare.mp3'),
    kick: require('./samples/kick.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    // Synths
    synth_1: require('./samples/synth_1.mp3'),
    synth_2: require('./samples/synth_2.mp3'),
    // Brass
    brass_1: require('./samples/brass_1.mp3'),
    brass_2: require('./samples/brass_2.mp3'),
    // Chants
    chant_shyah: require('./samples/chant_shyah.mp3'),
  },
  soundGroups: {
    melody: ['melody_1', 'melody_2', 'melody_3'],
    synth: ['synth_1', 'synth_2'],
    brass: ['brass_1', 'brass_2'],
  },
  padConfig: [
    {
      id: 1,
      sound: 'drums',
      color: PAD_COLORS.DRUMS_MAIN,
      group: 'drums',
      icon: 'drums',
      title: 'Drums',
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
      sound: 'kick',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'kick',
      title: 'Kick',
    },
    {
      id: 4,
      sound: 'hi_hat',
      color: PAD_COLORS.BASS_MAIN,
      icon: 'hi_hat',
      title: 'Hi Hat',
    },
    {
      id: 5,
      sound: 'melody_1',
      color: PAD_COLORS.MELODY_MAIN,
      group: 'melody',
      icon: 'melody',
      title: 'Melody I',
    },
    {
      id: 6,
      sound: 'synth_1',
      color: PAD_COLORS.PERC_ACCENT,
      group: 'synth',
      icon: 'synth',
      title: 'Synth I',
    },
    {
      id: 7,
      sound: 'melody_2',
      color: PAD_COLORS.MELODY_MAIN,
      group: 'melody',
      icon: 'melody',
      title: 'Melody II',
    },
    {
      id: 8,
      sound: 'synth_2',
      color: PAD_COLORS.PERC_ACCENT,
      group: 'synth',
      icon: 'synth',
      title: 'Synth II',
    },
    {
      id: 9,
      sound: 'melody_3',
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
      icon: 'melody',
      title: 'Melody III',
    },
    {
      id: 10,
      sound: 'brass_1',
      color: PAD_COLORS.BRASS_MAIN,
      group: 'brass',
      icon: 'trumpet',
      title: 'Brass I',
    },
    {
      id: 11,
      sound: 'brass_2',
      color: PAD_COLORS.BRASS_ACCENT,
      group: 'brass',
      icon: 'trumpet',
      title: 'Brass II',
    },
    {
      id: 12,
      sound: 'chant_shyah',
      color: PAD_COLORS.SFX_MAIN,
      icon: 'chant',
      title: 'Shyah Chant',
    },
  ],
};

export default soundPack;
