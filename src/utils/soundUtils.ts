import {soundPacks, metronome} from '../assets/sounds';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {Theme} from '../types/soundPacks';

interface SoundPack {
  id: string;
  name: string;
  genre: string;
  image: any;
  theme?: Theme;
}

interface PadConfig {
  id: string;
  sound: string | null;
  label?: string;
  color: string;
  icon?: string;
  title?: string;
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
    theme: pack.theme || 'light',
  };
  return acc;
}, {} as Record<string, SoundPack>);

export const getPadConfigs = async (packName: string): Promise<PadConfig[]> => {
  try {
    const savedOrder = await AsyncStorage.getItem(`custom_order_${packName}`);
    if (savedOrder) {
      return JSON.parse(savedOrder);
    }
  } catch (error) {
    console.error('Error loading custom order:', error);
  }
  return (soundPacks as any)[packName]?.padConfig || [];
};

export const getPadConfigsSync = (packName: string): PadConfig[] => {
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

export const getPackTheme = (packName: string): Theme => {
  const pack = (soundPacks as any)[packName];
  return (pack?.theme as Theme) || 'light';
};
