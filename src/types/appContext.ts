import {AudioContext} from 'react-native-audio-api';
import {MetronomeSound} from '../assets/sounds/metronome';

export type MetronomeColor = 'white' | 'green' | 'blue' | 'red' | 'yellow';

export interface AppContextType {
  currentSoundPack: string;
  setCurrentSoundPack: (packId: string) => Promise<void>;
  isLoading: boolean;
  availableSoundPacks: any[];

  bpm: number;
  setBpm: (bpm: number) => void;
  metronomeSound: MetronomeSound;
  setMetronomeSound: (sound: MetronomeSound) => Promise<void>;
  metronomeVolume: number;
  setMetronomeVolume: (volume: number) => void;
  metronomeColor: MetronomeColor;
  setMetronomeColor: (color: MetronomeColor) => void;

  audioContext: AudioContext | null;
}

export interface AppState {
  currentSoundPack: string;
  isLoading: boolean;
  bpm: number;
  metronomeSound: MetronomeSound;
  metronomeVolume: number;
  metronomeColor: MetronomeColor;
  audioContext: AudioContext | null;
}

export interface AppProviderProps {
  children: React.ReactNode;
}
