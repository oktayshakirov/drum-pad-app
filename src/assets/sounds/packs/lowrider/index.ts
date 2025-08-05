import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Brown shades
  DRUMS_MAIN: '#DEB887', // Soft Pastel Brown
  DRUMS_ACCENT: '#F5DEB3', // Lighter Pastel Brown
  // Bass group - Soft Pastel Tan shades
  BASS_MAIN: '#D2B48C', // Soft Pastel Tan
  BASS_ACCENT: '#E6D3B3', // Lighter Pastel Tan
  // Melody group - Soft Pastel Gold shades
  MELODY_MAIN: '#FFE5A2', // Soft Pastel Gold
  MELODY_ACCENT: '#FFF2CC', // Lighter Pastel Gold
  // SFX group - Soft Pastel Cream shades
  SFX_MAIN: '#F5F5DC', // Soft Pastel Cream
  SFX_ACCENT: '#FAFAF0', // Lighter Pastel Cream
};

const soundPack: SoundPack = {
  id: 'lowrider',
  name: 'Lowrider',
  genre: 'Rap',
  bpm: '138',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Drums
    kick: require('./samples/kick.mp3'),
    snare: require('./samples/snare.mp3'),
    open_hat: require('./samples/open_hat.mp3'),
    clap: require('./samples/clap.mp3'),
    hit: require('./samples/hit.mp3'),
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    percussion: require('./samples/percussion.mp3'),
    // Melodies
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    // Chants
    chant_yeah: require('./samples/chant_yeah.mp3'),
    // SFX
    sfx_gun: require('./samples/sfx_gun.mp3'),
  },
  soundGroups: {
    drums: ['drums_1', 'drums_2'],
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
      color: PAD_COLORS.DRUMS_MAIN,
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
      sound: 'open_hat',
      color: PAD_COLORS.DRUMS_MAIN,
      icon: 'open_hat',
      title: 'Open Hat',
    },
    {
      id: 5,
      sound: 'hit',
      color: PAD_COLORS.DRUMS_ACCENT,
      icon: 'hit',
      title: 'Hit',
    },
    {
      id: 6,
      sound: 'drums_1',
      color: PAD_COLORS.BASS_MAIN,
      icon: 'drums',
      title: 'Drums I',
    },
    {
      id: 7,
      sound: 'drums_2',
      color: PAD_COLORS.BASS_MAIN,
      icon: 'drums',
      title: 'Drums II',
    },
    {
      id: 8,
      sound: 'percussion',
      color: PAD_COLORS.BASS_ACCENT,
      icon: 'percussion',
      title: 'Percussion',
    },
    {
      id: 9,
      sound: 'melody_1',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody I',
    },
    {
      id: 10,
      sound: 'melody_2',
      color: PAD_COLORS.MELODY_MAIN,
      icon: 'melody',
      title: 'Melody II',
    },
    {
      id: 11,
      sound: 'chant_yeah',
      color: PAD_COLORS.MELODY_ACCENT,
      icon: 'chant',
      title: 'Yeah Chant',
    },
    {
      id: 12,
      sound: 'sfx_gun',
      color: PAD_COLORS.SFX_MAIN,
      icon: 'gun',
      title: 'Gun',
    },
  ],
};

export default soundPack;
