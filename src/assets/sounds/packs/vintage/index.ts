import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  DRUMS_MAIN: '#DEB887',
  DRUMS_SECONDARY: '#F5DEB3',
  MELODY_MAIN: '#F5F5DC',
  MELODY_SECONDARY: '#FAFAF0',
};

const soundPack: SoundPack = {
  id: 'vintage',
  name: 'Vintage',
  genre: 'Pop',
  bpm: '124',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  theme: 'light',
  sounds: {
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    melody_4: require('./samples/melody_4.mp3'),
    vocals_1: require('./samples/vocals_1.mp3'),
    vocals_2: require('./samples/vocals_2.mp3'),
    vocals_3: require('./samples/vocals_3.mp3'),
    kick: require('./samples/kick.mp3'),
    clap: require('./samples/clap.mp3'),
    snap: require('./samples/snap.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    crash: require('./samples/crash.mp3'),
  },
  soundGroups: {
    melodies: ['melody_1', 'melody_2', 'melody_3', 'melody_4'],
    vocals: ['vocals_1', 'vocals_2', 'vocals_3'],
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
      sound: 'snap',
      color: PAD_COLORS.DRUMS_MAIN,
      icon: 'snap',
      title: 'Snap',
    },
    {
      id: 4,
      sound: 'open_hat',
      color: PAD_COLORS.DRUMS_SECONDARY,
      icon: 'open_hat',
      title: 'Open Hat',
    },
    {
      id: 5,
      sound: 'crash',
      color: PAD_COLORS.DRUMS_SECONDARY,
      icon: 'open_hat',
      title: 'Crash',
    },
    {
      id: 6,
      sound: 'melody_1',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody I',
    },
    {
      id: 7,
      sound: 'melody_2',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody II',
    },
    {
      id: 8,
      sound: 'melody_3',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody III',
    },
    {
      id: 9,
      sound: 'melody_4',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody IV',
    },
    {
      id: 10,
      sound: 'vocals_1',
      color: PAD_COLORS.MELODY_SECONDARY,
      icon: 'melody',
      title: 'Vocals I',
    },
    {
      id: 11,
      sound: 'vocals_2',
      color: PAD_COLORS.MELODY_SECONDARY,
      icon: 'melody',
      title: 'Vocals II',
    },
    {
      id: 12,
      sound: 'vocals_3',
      color: PAD_COLORS.MELODY_SECONDARY,
      icon: 'melody',
      title: 'Vocals III',
    },
  ],
};

export default soundPack;
