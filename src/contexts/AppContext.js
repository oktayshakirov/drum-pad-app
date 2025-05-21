import React, {createContext, useState, useEffect, useContext} from 'react';
import AudioService from '../services/AudioService';
import {SOUND_PACKS} from '../utils/soundUtils';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [currentSoundPack, setCurrentSoundPackState] = useState(SOUND_PACKS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialSoundPack = async () => {
      setIsLoading(true);
      try {
        await AudioService.setSoundPack(currentSoundPack);
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

  const handleSoundPackChange = async newPack => {
    if (newPack === currentSoundPack || isLoading) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await AudioService.setSoundPack(newPack);
      if (success) {
        setCurrentSoundPackState(newPack);
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
        availableSoundPacks: SOUND_PACKS,
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
