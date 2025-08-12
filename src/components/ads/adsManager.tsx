import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showInterstitial, initializeInterstitial} from './InterstitialAd';
import {showAppOpenAd, loadAppOpenAd} from './AppOpenAd';
import {initializeGoogleMobileAds} from './adConfig';

const AD_INTERVAL_MS = 60000; // 1 minute
const APP_OPEN_AFTER_INTERSTITIAL_COOLDOWN_MS = 30000; // 30 seconds

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
  try {
    await initializeGoogleMobileAds();

    const hasInitializedKey = 'hasInitializedAds';
    const hasInitialized = await AsyncStorage.getItem(hasInitializedKey);

    if (!hasInitialized) {
      await initializeAdTimings();
      await AsyncStorage.setItem(hasInitializedKey, 'true');
    }

    await Promise.all([initializeInterstitial(), loadAppOpenAd()]);
  } catch (error) {
    console.error('Failed to initialize global ads:', error);

    setTimeout(() => {
      initializeGlobalAds().catch(console.error);
    }, 5000);
  }
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
  const timeSinceLastAd = now - lastAdShownTime;

  // Special case: Block app open ads if interstitial was recently shown
  if (adType === AD_TYPES.APP_OPEN) {
    const lastInterstitialString = await AsyncStorage.getItem(
      `lastAdShownTime_${AD_TYPES.INTERSTITIAL}`,
    );
    if (lastInterstitialString) {
      const lastInterstitialTime = parseInt(lastInterstitialString, 10);
      const timeSinceInterstitial = now - lastInterstitialTime;
      if (timeSinceInterstitial < APP_OPEN_AFTER_INTERSTITIAL_COOLDOWN_MS) {
        return false;
      }
    }
  }

  const canShow = timeSinceLastAd > AD_INTERVAL_MS;
  return canShow;
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
              console.error('AppOpenAd error:', e);
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
