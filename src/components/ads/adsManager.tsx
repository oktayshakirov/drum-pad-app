import {useEffect, useRef} from 'react';
import {AppState, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showInterstitial, initializeInterstitial} from './InterstitialAd';
import {showAppOpenAd, loadAppOpenAd} from './AppOpenAd';
import {initializeGoogleMobileAds} from './adConfig';

const AD_INTERVAL_MS = 60000;
const APP_OPEN_AFTER_AD_COOLDOWN_MS = 30000;

const AD_TYPES = {
  INTERSTITIAL: 'interstitial',
  APP_OPEN: 'appOpen',
  REWARDED: 'rewarded',
};

export async function initializeGlobalAds() {
  try {
    await initializeGoogleMobileAds();
    await Promise.all([initializeInterstitial(), loadAppOpenAd()]);
  } catch (error) {
    console.error('Failed to initialize global ads:', error);

    setTimeout(() => {
      initializeGlobalAds().catch(console.error);
    }, 5000);
  }
}

async function canShowAd(adType: string): Promise<boolean> {
  if (adType === AD_TYPES.APP_OPEN) {
    const lastInterstitialString = await AsyncStorage.getItem(
      `lastAdShownTime_${AD_TYPES.INTERSTITIAL}`,
    );
    const lastRewardedString = await AsyncStorage.getItem(
      `lastAdShownTime_${AD_TYPES.REWARDED}`,
    );

    const now = Date.now();
    let canShow = true;

    if (lastInterstitialString) {
      const lastInterstitialTime = parseInt(lastInterstitialString, 10);
      const timeSinceInterstitial = now - lastInterstitialTime;
      if (timeSinceInterstitial < APP_OPEN_AFTER_AD_COOLDOWN_MS) {
        console.log(
          `App open blocked: Interstitial shown ${timeSinceInterstitial}ms ago`,
        );
        canShow = false;
      }
    }

    if (lastRewardedString) {
      const lastRewardedTime = parseInt(lastRewardedString, 10);
      const timeSinceRewarded = now - lastRewardedTime;
      if (timeSinceRewarded < APP_OPEN_AFTER_AD_COOLDOWN_MS) {
        console.log(
          `App open blocked: Rewarded shown ${timeSinceRewarded}ms ago`,
        );
        canShow = false;
      }
    }

    if (canShow) {
      console.log('App open can show: No recent ads');
    }

    return canShow;
  }

  const lastAdShownString = await AsyncStorage.getItem(
    `lastAdShownTime_${adType}`,
  );

  if (!lastAdShownString) {
    return true;
  }

  const lastAdShownTime = parseInt(lastAdShownString, 10);
  const now = Date.now();
  const timeSinceLastAd = now - lastAdShownTime;

  const canShow = timeSinceLastAd > AD_INTERVAL_MS;
  return canShow;
}

async function updateLastAdShownTime(adType: string) {
  const now = Date.now();
  await AsyncStorage.setItem(`lastAdShownTime_${adType}`, now.toString());
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

export async function trackRewardedAdShown(): Promise<void> {
  await updateLastAdShownTime(AD_TYPES.REWARDED);
}

export function useGlobalAds() {
  const appState = useRef(AppState.currentState);
  const lastAppStateChange = useRef(Date.now());
  const lastAdShownTime = useRef(0);

  useEffect(() => {
    console.log('useGlobalAds: Hook initialized');
    console.log('useGlobalAds: Initial app state:', AppState.currentState);

    const subscription = AppState.addEventListener(
      'change',
      async nextAppState => {
        const now = Date.now();
        const timeSinceLastChange = now - lastAppStateChange.current;
        const timeSinceLastAd = now - lastAdShownTime.current;

        console.log(
          `useGlobalAds: App state change detected: ${appState.current} -> ${nextAppState}`,
        );
        console.log(
          `useGlobalAds: Time since last change: ${timeSinceLastChange}ms`,
        );
        console.log(`useGlobalAds: Time since last ad: ${timeSinceLastAd}ms`);

        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log(
            `App state change: ${appState.current} -> ${nextAppState}`,
          );
          console.log(`Platform: ${Platform.OS}`);

          if (Platform.OS === 'android') {
            if (timeSinceLastChange < 500) {
              console.log(
                `Android: App state change too recent (${timeSinceLastChange}ms), skipping`,
              );
              return;
            }

            if (timeSinceLastAd < 2000) {
              console.log(
                `Android: Last ad too recent (${timeSinceLastAd}ms), skipping`,
              );
              return;
            }
          }

          console.log('Checking if app open ad can show...');
          if (await canShowAd(AD_TYPES.APP_OPEN)) {
            try {
              console.log('Showing app open ad...');
              await showAppOpenAd();
              await updateLastAdShownTime(AD_TYPES.APP_OPEN);
              lastAdShownTime.current = now;
              console.log('App open ad shown successfully');
            } catch (e) {
              console.error('AppOpenAd error:', e);
            }
          } else {
            console.log('App open ad cannot show at this time');
          }
        }

        lastAppStateChange.current = now;
        appState.current = nextAppState;
      },
    );

    return () => {
      console.log('useGlobalAds: Hook cleanup');
      subscription.remove();
    };
  }, []);
}
