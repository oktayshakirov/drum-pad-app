import {AppOpenAd, AdEventType} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioService from '../../services/AudioService';

let appOpenAd: AppOpenAd | null = null;
let isAppOpenAdLoaded = false;
let isShowingAd = false;
let retryCount = 0;
const MAX_RETRIES = 3;

export async function loadAppOpenAd() {
  if (!isGoogleMobileAdsInitialized()) {
    return new Promise<void>(resolve => {
      const checkInitialization = () => {
        if (isGoogleMobileAdsInitialized()) {
          loadAppOpenAd().then(resolve);
        } else {
          setTimeout(checkInitialization, 1000);
        }
      };
      checkInitialization();
    });
  }

  if (appOpenAd) {
    appOpenAd.removeAllListeners();
  }

  const consent = await AsyncStorage.getItem('trackingConsent');
  const requestNonPersonalizedAdsOnly = consent !== 'granted';

  const adUnitId = getAdUnitId('appOpen');

  appOpenAd = AppOpenAd.createForAdRequest(adUnitId!, {
    requestNonPersonalizedAdsOnly,
  });

  appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
    isAppOpenAdLoaded = true;
    retryCount = 0;
  });

  appOpenAd.addAdEventListener(AdEventType.ERROR, (_error: Error) => {
    isAppOpenAdLoaded = false;

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(() => {
        loadAppOpenAd().catch(console.error);
      }, 2000);
    }
  });

  appOpenAd.addAdEventListener(AdEventType.CLOSED, async () => {
    isShowingAd = false;
    isAppOpenAdLoaded = false;
    try {
      await AudioService.restoreAfterAd();
    } catch (e) {
      console.error('restoreAfterAd error (app open):', e);
    }
    loadAppOpenAd();
  });

  try {
    await appOpenAd.load();
  } catch (error) {
    console.error('Error loading App open ad:', error);
    isAppOpenAdLoaded = false;
  }
}

export async function showAppOpenAd() {
  if (!appOpenAd || !isAppOpenAdLoaded || isShowingAd) {
    return;
  }

  try {
    isShowingAd = true;
    await appOpenAd.show();
  } catch (error) {
    console.error('Error showing App open ad:', error);
    isShowingAd = false;
    isAppOpenAdLoaded = false;
    loadAppOpenAd();
  }
}

export default null;
