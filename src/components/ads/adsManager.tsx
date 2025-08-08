import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showInterstitial, initializeInterstitial} from './InterstitialAd';
import {showAppOpenAd, loadAppOpenAd} from './AppOpenAd';

const AD_INTERVAL_MS = 60000; // 1 minute

const AD_TYPES = {
  INTERSTITIAL: 'interstitial',
  APP_OPEN: 'appOpen',
};

async function initializeAdTimings() {
  const now = Date.now();
  await Promise.all([
    AsyncStorage.setItem(
      `lastAdShownTime_${AD_TYPES.INTERSTITIAL}`,
      now.toString(),
    ),
    AsyncStorage.setItem(
      `lastAdShownTime_${AD_TYPES.APP_OPEN}`,
      now.toString(),
    ),
  ]);
}

export async function initializeGlobalAds() {
  const hasInitializedKey = 'hasInitializedAds';
  const hasInitialized = await AsyncStorage.getItem(hasInitializedKey);

  if (!hasInitialized) {
    await initializeAdTimings();
    await AsyncStorage.setItem(hasInitializedKey, 'true');
  }

  await Promise.all([initializeInterstitial(), loadAppOpenAd()]);
}

async function canShowAd(adType: string): Promise<boolean> {
  const lastAdShownString = await AsyncStorage.getItem(
    `lastAdShownTime_${adType}`,
  );
  if (!lastAdShownString) {
    await updateLastAdShownTime(adType);
    return false;
  }
  const lastAdShownTime = parseInt(lastAdShownString, 10);
  const now = Date.now();
  return now - lastAdShownTime > AD_INTERVAL_MS;
}

async function updateLastAdShownTime(adType: string) {
  await AsyncStorage.setItem(
    `lastAdShownTime_${adType}`,
    Date.now().toString(),
  );
}

export async function showGlobalInterstitial(): Promise<boolean> {
  if (await canShowAd(AD_TYPES.INTERSTITIAL)) {
    try {
      await showInterstitial();
      await updateLastAdShownTime(AD_TYPES.INTERSTITIAL);
      return true;
    } catch (error) {
      console.error('Error showing interstitial ad:', error);
    }
  }
  return false;
}

export function useGlobalAds() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          if (await canShowAd(AD_TYPES.APP_OPEN)) {
            try {
              await showAppOpenAd();
              await updateLastAdShownTime(AD_TYPES.APP_OPEN);
            } catch (e) {
              console.log('AppOpenAd error', e);
            }
          }
        }

        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, []);
}
