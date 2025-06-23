import {PadColors, SoundPack} from '../../../../types/soundPacks';

const PAD_COLORS: PadColors = {
  // Drums group - Soft Pastel Purple shades
  DRUMS_MAIN: '#D8BFD8', // Soft Pastel Purple
  DRUMS_ACCENT: '#E6D3E6', // Lighter Pastel Purple
  // Bass group - Soft Pastel Blue shades
  BASS_MAIN: '#B0C4DE', // Soft Pastel Blue
  BASS_ACCENT: '#D0E6FA', // Lighter Pastel Blue
  // Melody group - Soft Pastel Pink shades
  MELODY_MAIN: '#FFB6C1', // Soft Pastel Pink
  MELODY_ACCENT: '#FFC0CB', // Lighter Pastel Pink
  // SFX group - Soft Pastel Lavender shades
  SFX_MAIN: '#E6E6FA', // Soft Pastel Lavender
  SFX_ACCENT: '#F0F0FF', // Lighter Pastel Lavender
  // Percussion group - Soft Pastel Coral shades
  PERCUSSION_MAIN: '#FFB6C1', // Soft Pastel Coral
  PERCUSSION_ACCENT: '#FFC0CB', // Lighter Pastel Coral
};

const soundPack: SoundPack = {
  id: 'zenith',
  name: 'Zenith',
  genre: 'R&B',
  bpm: '120',
  cover: require('./cover.jpg'),
  demo: require('./demo.mp3'),
  sounds: {
    // Melodies first
    melody_1: require('./samples/melody_1.mp3'),
    melody_2: require('./samples/melody_2.mp3'),
    melody_3: require('./samples/melody_3.mp3'),
    // Drums
    kick: require('./samples/kick.mp3'),
    clap: require('./samples/clap.mp3'),
    hi_hat: require('./samples/hi_hat.mp3'),
    crash: require('./samples/crash.mp3'),
    drums_1: require('./samples/drums_1.mp3'),
    drums_2: require('./samples/drums_2.mp3'),
    // Percussion
    percussion_1: require('./samples/percussion_1.mp3'),
    percussion_2: require('./samples/percussion_2.mp3'),
    // Vocals
    vocal: require('./samples/vocal.mp3'),
  },
  soundGroups: {
    melodies: ['melody_1', 'melody_2', 'melody_3'],
    drums: ['drums_1', 'drums_2'],
  },
  padConfig: [
    {id: 1, sound: 'kick', color: PAD_COLORS.DRUMS_MAIN},
    {id: 2, sound: 'clap', color: PAD_COLORS.DRUMS_MAIN},
    {id: 3, sound: 'hi_hat', color: PAD_COLORS.DRUMS_MAIN},
    {id: 4, sound: 'crash', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 5, sound: 'drums_1', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 6, sound: 'drums_2', color: PAD_COLORS.DRUMS_ACCENT},
    {id: 7, sound: 'percussion_1', color: PAD_COLORS.PERCUSSION_MAIN},
    {id: 8, sound: 'percussion_2', color: PAD_COLORS.PERCUSSION_ACCENT},
    {id: 9, sound: 'melody_1', color: PAD_COLORS.MELODY_MAIN},
    {id: 10, sound: 'melody_2', color: PAD_COLORS.MELODY_MAIN},
    {id: 11, sound: 'melody_3', color: PAD_COLORS.MELODY_ACCENT},
    {id: 12, sound: 'vocal', color: PAD_COLORS.MELODY_ACCENT},
  ],
};

export default soundPack;
