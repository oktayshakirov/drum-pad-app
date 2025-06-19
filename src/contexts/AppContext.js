import React, {createContext, useState, useEffect, useContext} from 'react';
import AudioService from '../services/AudioService';
import {SOUND_PACKS} from '../utils/soundUtils';
import {soundPacks} from '../assets/sounds';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [currentSoundPack, setCurrentSoundPackState] = useState(
    Object.keys(SOUND_PACKS)[0],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [bpm, setBpm] = useState(120);
  const [metronomeSound, setMetronomeSound] = useState('tick');
  const [metronomeVolume, setMetronomeVolume] = useState(1);

  useEffect(() => {
    const loadInitialSoundPack = async () => {
      setIsLoading(true);
      try {
        await AudioService.setSoundPack(currentSoundPack);
        const initialPack = soundPacks[currentSoundPack];
        if (initialPack && initialPack.bpm) {
          setBpm(parseInt(initialPack.bpm, 10));
        }
      } catch (error) {
        console.error(
          'AppContext.js: Error loading initial sound pack:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialSoundPack();
  }, [currentSoundPack]);

  const handleSoundPackChange = async newPackId => {
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
          setBpm(parseInt(newPack.bpm, 10));
        }
      } else {
        console.warn(
          'AppContext.js: Failed to set new sound pack in AudioService.',
        );
      }
    } catch (error) {
      console.error('AppContext.js: Error changing sound pack:', error);
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

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
