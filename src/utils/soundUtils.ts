import {soundPacks, metronome} from '../assets/sounds';

interface SoundPack {
  id: string;
  name: string;
  genre: string;
  image: any;
}

interface PadConfig {
  id: string;
  sound: string | null;
  label?: string;
  color: string;
}

export const SOUND_PACKS: Record<string, SoundPack> = Object.keys(
  soundPacks,
).reduce((acc, key) => {
  const pack = (soundPacks as any)[key];
  acc[key] = {
    id: pack.id,
    name: pack.name,
    genre: pack.genre,
    image: pack.cover,
  };
  return acc;
}, {} as Record<string, SoundPack>);

export const getPadConfigs = (packName: string): PadConfig[] => {
  return (soundPacks as any)[packName]?.padConfig || [];
};

export const getSoundModuleId = (packName: string, soundName: string): any => {
  if (packName === 'metronome') {
    return (metronome as any)[soundName];
  }
  return (soundPacks as any)[packName]?.sounds[soundName] || null;
};

export const getAvailableSoundNames = (packName: string): string[] => {
  if (!(soundPacks as any)[packName]) {
    return [];
  }
  return Object.keys((soundPacks as any)[packName].sounds);
};
