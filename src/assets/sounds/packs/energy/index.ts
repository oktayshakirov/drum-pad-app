import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Very light Green shades
  DRUMS_MAIN: '#F0FFF0', // Very Light Green
  DRUMS_ACCENT: '#F8FFF8', // Extremely Light Green
  // Percussion group - Very light Blue shades
  PERC_MAIN: '#F0F8FF', // Very Light Blue
  PERC_ACCENT: '#F8FCFF', // Extremely Light Blue
  // Melody group - Very light Purple shades
  MELODY_MAIN: '#F8F0FF', // Very Light Purple
  MELODY_ACCENT: '#FCF8FF', // Extremely Light Purple
  // Synth group - Very light Orange shades
  SYNTH_MAIN: '#FFF8F0', // Very Light Orange
  SYNTH_ACCENT: '#FFFCF8', // Extremely Light Orange
  // SFX group - Very light Red shades
  SFX_MAIN: '#FFF0F0', // Very Light Red
  SFX_ACCENT: '#FFF8F8', // Extremely Light Red
};

const soundPack: SoundPack = {
  id: 'energy',
  name: 'Energy',
  genre: 'Hip Hop',
  bpm: 140,
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    kick: require('./samples/kick.mp3'),
    clap: require('./samples/clap.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    hi_hat_roll: require('./samples/hi_hat_roll.mp3'),
    hit: require('./samples/hit.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    // Synths
    synth_1: require('./samples/synth_1.mp3'),
    synth_2: require('./samples/synth_2.mp3'),
    // SFX and Chants
    sfx_walkie_talkie: require('./samples/sfx_walkie_talkie.mp3'),
    chant_female: require('./samples/chant_female.mp3'),
  },
  soundGroups: {
    // Only one melody can play at a time
    melody: ['melody_1', 'melody_2'],
    // Only one synth can play at a time
    synth: ['synth_1', 'synth_2'],
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
      sound: 'clap',
      color: PAD_COLORS.DRUMS_MAIN,
      icon: 'clap',
      title: 'Clap',
    },
    {
      id: 3,
      sound: 'hi_hat',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'hi_hat',
      title: 'Hi Hat',
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
      sound: 'hi_hat_roll',
      color: PAD_COLORS.PERC_MAIN,
      icon: 'hi_hat',
      title: 'Hi Hat Roll',
    },
    {
      id: 6,
      sound: 'hit',
      color: PAD_COLORS.PERC_ACCENT,
      icon: 'hit',
      title: 'Hit',
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
      color: PAD_COLORS.MELODY_ACCENT,
      group: 'melody',
      icon: 'melody',
      title: 'Melody II',
    },
    {
      id: 9,
      sound: 'synth_1',
      color: PAD_COLORS.SYNTH_MAIN,
      group: 'synth',
      icon: 'synth',
      title: 'Synth I',
    },
    {
      id: 10,
      sound: 'synth_2',
      color: PAD_COLORS.SYNTH_ACCENT,
      group: 'synth',
      icon: 'synth',
      title: 'Synth II',
    },
    {
      id: 11,
      sound: 'sfx_walkie_talkie',
      color: PAD_COLORS.SFX_MAIN,
      icon: 'walkieTalkie',
      title: 'Walkie Talkie',
    },
    {
      id: 12,
      sound: 'chant_female',
      color: PAD_COLORS.SFX_ACCENT,
      icon: 'chant',
      title: 'Female Chant',
    },
  ],
};

export default soundPack;
