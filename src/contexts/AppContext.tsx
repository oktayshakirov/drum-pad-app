import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import AudioService from '../services/AudioService';
import {SOUND_PACKS} from '../utils/soundUtils';
import {soundPacks} from '../assets/sounds';
import {MetronomeSound} from '../assets/sounds/metronome';

interface AppContextType {
  currentSoundPack: string;
  setCurrentSoundPack: (packId: string) => Promise<void>;
  isLoading: boolean;
  availableSoundPacks: any[];
  bpm: number;
  setBpm: (bpm: number) => void;
  metronomeSound: MetronomeSound;
  setMetronomeSound: (sound: MetronomeSound) => void;
  metronomeVolume: number;
  setMetronomeVolume: (volume: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [currentSoundPack, setCurrentSoundPackState] = useState<string>(
    Object.keys(SOUND_PACKS)[0],
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [bpm, setBpm] = useState<number>(120);
  const [metronomeSound, setMetronomeSound] = useState<MetronomeSound>('tick');
  const [metronomeVolume, setMetronomeVolume] = useState<number>(1);

  useEffect(() => {
    const loadInitialSoundPack = async (): Promise<void> => {
      setIsLoading(true);
      try {
        await AudioService.setSoundPack(currentSoundPack);
        const initialPack = soundPacks[currentSoundPack];
        if (initialPack && initialPack.bpm) {
          setBpm(parseInt(String(initialPack.bpm), 10));
        }
      } catch (error) {
        console.error(
          'AppContext.tsx: Error loading initial sound pack:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialSoundPack();
  }, [currentSoundPack]);

  const handleSoundPackChange = async (newPackId: string): Promise<void> => {
    if (newPackId === currentSoundPack || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      await AudioService.stopAllSounds();
      const success = await AudioService.setSoundPack(newPackId);
      if (success) {
        setCurrentSoundPackState(newPackId);
        const newPack = soundPacks[newPackId];
        if (newPack && newPack.bpm) {
          setBpm(parseInt(String(newPack.bpm), 10));
        }
      } else {
        console.warn(
          'AppContext.tsx: Failed to set new sound pack in AudioService.',
        );
      }
    } catch (error) {
      console.error('AppContext.tsx: Error changing sound pack:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentSoundPack,
        setCurrentSoundPack: handleSoundPackChange,
        isLoading,
        availableSoundPacks: Object.values(SOUND_PACKS),
        bpm,
        setBpm,
        metronomeSound,
        setMetronomeSound,
        metronomeVolume,
        setMetronomeVolume,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export {AppContext};
