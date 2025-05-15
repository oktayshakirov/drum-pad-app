import React, {createContext, useState, useEffect} from 'react';
import AudioService from '../services/AudioService';

export const AppContext = createContext();

export const AppProvider = ({children}) => {
  const [currentSoundPack, setCurrentSoundPack] = useState('hiphop');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadInitialSoundPack = async () => {
      setIsLoading(true);
      try {
        await AudioService.preloadSoundPack(currentSoundPack);
      } catch (error) {
        console.error('Error loading initial sound pack:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSoundPack();
  }, [currentSoundPack]);

  const handleSoundPackChange = async newPack => {
    if (newPack === currentSoundPack) {
      return;
    }

    setIsLoading(true);
    try {
      await AudioService.preloadSoundPack(newPack);
      setCurrentSoundPack(newPack);
    } catch (error) {
      console.error('Error changing sound pack:', error);
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
      }}>
      {children}
    </AppContext.Provider>
  );
};
