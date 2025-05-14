import React, {createContext, useState, useEffect, useCallback} from 'react';
import {
  preloadSoundPack,
  releaseSoundPack,
  loadMetronomeTick,
} from '../services/AudioService';

export const AppContext = createContext();

const SOUND_PACKS = {
  hiphop: {
    name: 'Hip Hop',
    sounds: [
      'hiphop_kick.wav',
      'hiphop_snare.wav',
      'hiphop_hi_hat.wav',
      'hiphop_clap.wav',
      // 'hiphop_tom1.wav',
      // 'hiphop_tom2.wav',
      // 'hiphop_tom3.wav',
      // 'hiphop_cymbal.wav',
      // 'hiphop_fx1.wav',
      // 'hiphop_fx2.wav',
      // 'hiphop_openhat.wav',
      // 'hiphop_perc.wav',
    ],
    id: 'hiphop',
  },
  // edm: {
  //   name: 'EDM',
  //   sounds: [
  //     // 'edm_kick.wav',
  //     // 'edm_snare.wav',
  //     // 'edm_hat.wav',
  //     // 'edm_tom1.wav',
  //     // 'edm_tom2.wav',
  //     // 'edm_tom3.wav',
  //     // 'edm_clap.wav',
  //     // 'edm_cymbal.wav',
  //     // 'edm_fx1.wav',
  //     // 'edm_fx2.wav',
  //     // 'edm_openhat.wav',
  //     // 'edm_perc.wav',
  //   ],
  //   id: 'edm',
  // },
};

export const AppProvider = ({children}) => {
  const [currentSoundPack, setCurrentSoundPack] = useState(SOUND_PACKS.hiphop);
  const [availableSoundPacks] = useState(SOUND_PACKS);
  const [metronomeBPM, setMetronomeBPM] = useState(120);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);

  useEffect(() => {
    const loadInitialSounds = async () => {
      try {
        await preloadSoundPack(currentSoundPack.id, currentSoundPack.sounds);
        await loadMetronomeTick();
      } catch (error) {
        console.error('Error loading initial sounds:', error);
      }
    };

    loadInitialSounds();

    return () => {
      releaseSoundPack(currentSoundPack.id);
    };
  }, [currentSoundPack.id, currentSoundPack.sounds]);

  const switchSoundPack = useCallback(
    async packKey => {
      const newPack = availableSoundPacks[packKey];
      if (newPack && newPack.id !== currentSoundPack.id) {
        try {
          console.log(`Switching to pack: ${newPack.name}`);
          await releaseSoundPack(currentSoundPack.id);
          await preloadSoundPack(newPack.id, newPack.sounds);
          setCurrentSoundPack(newPack);
        } catch (error) {
          console.error('Error switching sound packs:', error);
        }
      }
    },
    [currentSoundPack.id, availableSoundPacks],
  );

  return (
    <AppContext.Provider
      value={{
        currentSoundPack,
        availableSoundPacks,
        switchSoundPack,
        metronomeBPM,
        setMetronomeBPM,
        isMetronomeOn,
        setIsMetronomeOn,
      }}>
      {children}
    </AppContext.Provider>
  );
};
