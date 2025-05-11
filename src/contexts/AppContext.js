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
      'hiphop_hat.wav',
      'hiphop_tom1.wav',
      'hiphop_tom2.wav',
      'hiphop_tom3.wav',
      'hiphop_clap.wav',
      'hiphop_cymbal.wav',
      'hiphop_fx1.wav',
      'hiphop_fx2.wav',
      'hiphop_openhat.wav',
      'hiphop_perc.wav',
    ],
    id: 'hiphop', // for AudioService path
  },
  edm: {
    name: 'EDM',
    sounds: [
      'edm_kick.wav',
      'edm_snare.wav',
      'edm_hat.wav',
      'edm_tom1.wav',
      'edm_tom2.wav',
      'edm_tom3.wav',
      'edm_clap.wav',
      'edm_cymbal.wav',
      'edm_fx1.wav',
      'edm_fx2.wav',
      'edm_openhat.wav',
      'edm_perc.wav',
    ],
    id: 'edm', // for AudioService path
  },
};

export const AppProvider = ({children}) => {
  const [currentSoundPack, setCurrentSoundPack] = useState(SOUND_PACKS.hiphop);
  const [availableSoundPacks] = useState(SOUND_PACKS);

  const [metronomeBPM, setMetronomeBPM] = useState(120);
  const [isMetronomeOn, setIsMetronomeOn] = useState(false);

  // Preload initial sound pack and metronome tick
  useEffect(() => {
    preloadSoundPack(currentSoundPack.id, currentSoundPack.sounds);
    loadMetronomeTick(); // Load metronome tick sound on app start

    // Clean up on unmount (though AppProvider rarely unmounts)
    return () => {
      releaseSoundPack(currentSoundPack.id);
    };
  }, []); // Run only once on mount

  const switchSoundPack = useCallback(
    async packKey => {
      const newPack = availableSoundPacks[packKey];
      if (newPack && newPack.id !== currentSoundPack.id) {
        console.log(`Switching to pack: ${newPack.name}`);
        // Release old pack's sounds (optional, to save memory)
        // Be careful if sounds are still playing out
        // For simplicity, we might not always release immediately or manage more carefully
        // releaseSoundPack(currentSoundPack.id); // Consider implications

        await preloadSoundPack(newPack.id, newPack.sounds);
        setCurrentSoundPack(newPack);
      }
    },
    [currentSoundPack, availableSoundPacks],
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
