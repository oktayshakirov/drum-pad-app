import {soundPacks, metronome} from '../assets/sounds';

export const SOUND_PACKS = Object.keys(soundPacks).reduce((acc, key) => {
  const pack = soundPacks[key];
  acc[key] = {
    id: pack.id,
    name: pack.name,
    genre: pack.genre,
    image: pack.cover,
  };
  return acc;
}, {});

export const getPadConfigs = packName => {
  return soundPacks[packName]?.padConfig || [];
};

export const getSoundModuleId = (packName, soundName) => {
  if (packName === 'metronome') {
    return metronome[soundName];
  }
  return soundPacks[packName]?.sounds[soundName] || null;
};

export const getAvailableSoundNames = packName => {
  if (!soundPacks[packName]) {
    return [];
  }
  return Object.keys(soundPacks[packName].sounds);
};
