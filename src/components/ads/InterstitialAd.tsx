import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioService from '../../services/AudioService';

let interstitial: InterstitialAd | null = null;
let isAdLoaded = false;
let isShowingAd = false;
let retryCount = 0;
let isInitializing = false;
const MAX_RETRIES = 3;

async function updateInterstitialAdShownTime() {
  try {
    await AsyncStorage.setItem(
      'lastAdShownTime_interstitial',
      Date.now().toString(),
    );
  } catch (error) {
    console.error('Failed to update interstitial ad shown time:', error);
  }
}

export async function initializeInterstitial() {
  if (isInitializing) {
    return;
  }

  isInitializing = true;

  if (!isGoogleMobileAdsInitialized()) {
    isInitializing = false;
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
    isInitializing = false;
  });

  interstitial.addAdEventListener(AdEventType.ERROR, (_error: Error) => {
    isAdLoaded = false;
    isInitializing = false;

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(() => {
        initializeInterstitial().catch(console.error);
      }, 2000);
    }
  });

  interstitial.addAdEventListener(AdEventType.CLOSED, async () => {
    await updateInterstitialAdShownTime();

    isShowingAd = false;
    isAdLoaded = false;
    initializeInterstitial();
  });

  try {
    await interstitial.load();
  } catch (error) {
    console.error('Error loading Interstitial ad:', error);
    isAdLoaded = false;
    isInitializing = false;
  }
}

export async function showInterstitial() {
  if (!interstitial || !isAdLoaded || isShowingAd) {
    return;
  }

  try {
    isShowingAd = true;
    AudioService.markVideoAdPlayed();
    await interstitial.show();
    isAdLoaded = false;
    isShowingAd = false;
  } catch (error) {
    console.error('Error showing Interstitial ad:', error);
    isShowingAd = false;
    isAdLoaded = false;
    initializeInterstitial();
  }
}

export default null;
