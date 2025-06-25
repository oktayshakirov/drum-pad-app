import {AudioContext} from 'react-native-audio-api';
import {MetronomeSound} from '../assets/sounds/metronome';

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

  audioContext: AudioContext | null;
}

export interface AppState {
  currentSoundPack: string;
  isLoading: boolean;
  bpm: number;
  metronomeSound: MetronomeSound;
  metronomeVolume: number;
  audioContext: AudioContext | null;
}

export interface AppProviderProps {
  children: React.ReactNode;
}
