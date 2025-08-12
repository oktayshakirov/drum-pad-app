import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let interstitial: InterstitialAd | null = null;
let isAdLoaded = false;
let isShowingAd = false;
let retryCount = 0;
const MAX_RETRIES = 3;

export async function initializeInterstitial() {
  if (!isGoogleMobileAdsInitialized()) {
    return new Promise<void>(resolve => {
      const checkInitialization = () => {
        if (isGoogleMobileAdsInitialized()) {
          initializeInterstitial().then(resolve);
        } else {
          setTimeout(checkInitialization, 1000);
        }
      };
      checkInitialization();
    });
  }

  if (interstitial) {
    interstitial.removeAllListeners();
  }

  const consent = await AsyncStorage.getItem('trackingConsent');
  const requestNonPersonalizedAdsOnly = consent !== 'granted';

  const adUnitId = getAdUnitId('interstitial');

  interstitial = InterstitialAd.createForAdRequest(adUnitId!, {
    requestNonPersonalizedAdsOnly,
  });

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isAdLoaded = true;
    retryCount = 0;
  });

  interstitial.addAdEventListener(AdEventType.ERROR, (_error: Error) => {
    isAdLoaded = false;

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(() => {
        initializeInterstitial().catch(console.error);
      }, 2000);
    }
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    isShowingAd = false;
    isAdLoaded = false;
    initializeInterstitial();
  });

  try {
    await interstitial.load();
  } catch (error) {
    console.error('Error loading Interstitial ad:', error);
    isAdLoaded = false;
  }
}

export async function showInterstitial() {
  if (!interstitial || !isAdLoaded || isShowingAd) {
    return;
  }

  try {
    isShowingAd = true;
    await interstitial.show();
    isAdLoaded = false;
  } catch (error) {
    console.error('Error showing Interstitial ad:', error);
    isShowingAd = false;
    isAdLoaded = false;
    initializeInterstitial();
  }
}

export default null;
