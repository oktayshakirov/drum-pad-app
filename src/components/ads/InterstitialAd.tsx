import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';
import {getAdUnitId} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let interstitial: InterstitialAd | null = null;
let isAdLoaded = false;
let isShowingAd = false;

export async function initializeInterstitial() {
  if (interstitial) {
    interstitial.removeAllListeners();
  }

  const consent = await AsyncStorage.getItem('trackingConsent');
  const requestNonPersonalizedAdsOnly = consent !== 'granted';

  interstitial = InterstitialAd.createForAdRequest(
    getAdUnitId('interstitial')!,
    {
      requestNonPersonalizedAdsOnly,
    },
  );

  interstitial.addAdEventListener(AdEventType.LOADED, () => {
    isAdLoaded = true;
    console.log('Interstitial ad loaded');
  });

  interstitial.addAdEventListener(AdEventType.ERROR, (error: Error) => {
    isAdLoaded = false;
    console.error('Interstitial ad failed to load:', error);
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
