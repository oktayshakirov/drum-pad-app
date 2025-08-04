import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import {AudioContext} from 'react-native-audio-api';
import AudioService from '../services/AudioService';
import {SOUND_PACKS} from '../utils/soundUtils';
import {soundPacks} from '../assets/sounds';
import {MetronomeSound} from '../assets/sounds/metronome';
import {AppContextType, AppState, AppProviderProps} from '../types/appContext';
import {loadAppOpenAd} from '../components/ads/AppOpenAd';
import {initializeRewardedAd} from '../components/ads/RewardedAd';
import {initializeInterstitial} from '../components/ads/InterstitialAd';
import {UnlockService} from '../services/UnlockService';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({children}) => {
  const [state, setState] = useState<AppState>({
    currentSoundPack: Object.keys(SOUND_PACKS)[0],
    isLoading: true,
    bpm: 120,
    metronomeSound: 'tick',
    metronomeVolume: 1,
    audioContext: null,
  });

  const initializeAudioContext = useCallback(async (): Promise<void> => {
    try {
      const context = new AudioContext();
      setState(prev => ({...prev, audioContext: context}));
      AudioService.setAudioContext(context);

      await UnlockService.initialize();
    } catch (error) {
      console.error('AppContext: Error initializing AudioContext:', error);
      setState(prev => ({...prev, isLoading: false}));
    }
  }, []);

  const loadSoundPack = useCallback(
    async (packId: string): Promise<void> => {
      if (!state.audioContext) {
        return;
      }

      setState(prev => ({...prev, isLoading: true}));

      try {
        await AudioService.setSoundPack(packId);

        const pack = soundPacks[packId];
        if (pack?.bpm) {
          const packBpm = parseInt(String(pack.bpm), 10);
          setState(prev => ({...prev, bpm: packBpm}));
          AudioService.updateBpm(packBpm);
        }
      } catch (error) {
        console.error('AppContext: Error loading sound pack:', error);
      } finally {
        setState(prev => ({...prev, isLoading: false}));
      }
    },
    [state.audioContext],
  );

  const handleSoundPackChange = useCallback(
    async (newPackId: string): Promise<void> => {
      if (
        newPackId === state.currentSoundPack ||
        state.isLoading ||
        !state.audioContext
      ) {
        return;
      }

      try {
        await AudioService.stopAllSounds();
        const success = await AudioService.setSoundPack(newPackId);

        if (success) {
          setState(prev => ({...prev, currentSoundPack: newPackId}));

          const pack = soundPacks[newPackId];
          if (pack?.bpm) {
            const packBpm = parseInt(String(pack.bpm), 10);
            setState(prev => ({...prev, bpm: packBpm}));
            AudioService.updateBpm(packBpm);
          }
        } else {
          console.warn(
            'AppContext: Failed to set new sound pack in AudioService.',
          );
        }
      } catch (error) {
        console.error('AppContext: Error changing sound pack:', error);
      }
    },
    [state.currentSoundPack, state.isLoading, state.audioContext],
  );

  const setBpm = useCallback((newBpm: number): void => {
    AudioService.updateBpm(newBpm);
    setState(prev => ({...prev, bpm: newBpm}));
  }, []);

  const setMetronomeVolume = useCallback((newVolume: number): void => {
    AudioService.updateVolume(newVolume);
    setState(prev => ({...prev, metronomeVolume: newVolume}));
  }, []);

  const handleMetronomeSoundChange = useCallback(
    async (newSound: MetronomeSound): Promise<void> => {
      try {
        await AudioService.updateSound(newSound);
        setState(prev => ({...prev, metronomeSound: newSound}));
      } catch (error) {
        console.error('AppContext: Error updating metronome sound:', error);
      }
    },
    [],
  );

  useEffect(() => {
    initializeAudioContext();
  }, [initializeAudioContext]);

  useEffect(() => {
    if (state.audioContext) {
      loadSoundPack(state.currentSoundPack);
    }
  }, [state.audioContext, state.currentSoundPack, loadSoundPack]);

  useEffect(() => {
    if (state.audioContext && !state.isLoading) {
      const initializeAds = async () => {
        try {
          await Promise.allSettled([
            loadAppOpenAd(),
            initializeRewardedAd(),
            initializeInterstitial(),
          ]);
        } catch (error) {
          console.error('Error initializing ads:', error);
        }
      };

      initializeAds();
    }
  }, [state.audioContext, state.isLoading]);

  const contextValue: AppContextType = {
    currentSoundPack: state.currentSoundPack,
    setCurrentSoundPack: handleSoundPackChange,
    isLoading: state.isLoading,
    availableSoundPacks: Object.values(SOUND_PACKS),

    bpm: state.bpm,
    setBpm,
    metronomeSound: state.metronomeSound,
    setMetronomeSound: handleMetronomeSoundChange,
    metronomeVolume: state.metronomeVolume,
    setMetronomeVolume,

    audioContext: state.audioContext,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
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
