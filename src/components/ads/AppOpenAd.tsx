import {AppOpenAd, AdEventType} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioService from '../../services/AudioService';
import {Platform} from 'react-native';

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
    console.log('AppOpenAd: Ad loaded successfully');
    isAppOpenAdLoaded = true;
    retryCount = 0;
  });

  appOpenAd.addAdEventListener(AdEventType.ERROR, (_error: Error) => {
    console.log('AppOpenAd: Ad failed to load');
    isAppOpenAdLoaded = false;

    if (retryCount < MAX_RETRIES) {
      retryCount++;
      setTimeout(() => {
        loadAppOpenAd().catch(console.error);
      }, 2000);
    }
  });

  try {
    await appOpenAd.load();
  } catch (error) {
    console.error('Error loading App open ad:', error);
    isAppOpenAdLoaded = false;
  }
}

export async function showAppOpenAd(): Promise<void> {
  console.log('AppOpenAd: showAppOpenAd called');
  console.log('AppOpenAd: appOpenAd exists:', !!appOpenAd);
  console.log('AppOpenAd: isAppOpenAdLoaded:', isAppOpenAdLoaded);
  console.log('AppOpenAd: isShowingAd:', isShowingAd);

  if (!appOpenAd || !isAppOpenAdLoaded || isShowingAd) {
    console.log('AppOpenAd: Cannot show - conditions not met');
    return;
  }

  return new Promise((resolve, reject) => {
    const handleAdClosed = () => {
      console.log('AppOpenAd: Ad closed');
      isShowingAd = false;
      isAppOpenAdLoaded = false;
      loadAppOpenAd();
      resolve();
    };

    const handleAdError = (error: Error) => {
      console.log('AppOpenAd: Ad error:', error);
      isShowingAd = false;
      isAppOpenAdLoaded = false;
      reject(error);
    };

    appOpenAd!.addAdEventListener(AdEventType.CLOSED, handleAdClosed);
    appOpenAd!.addAdEventListener(AdEventType.ERROR, handleAdError);

    try {
      isShowingAd = true;
      console.log('AppOpenAd: Starting to show ad...');

      setTimeout(
        () => {
          if (isShowingAd && appOpenAd) {
            console.log('AppOpenAd: Showing ad after delay');
            AudioService.markVideoAdPlayed();
            appOpenAd.show();
          } else {
            console.log(
              'AppOpenAd: Cannot show - isShowingAd:',
              isShowingAd,
              'appOpenAd:',
              !!appOpenAd,
            );
          }
        },
        Platform.OS === 'android' ? 100 : 0,
      );
    } catch (error) {
      console.log('AppOpenAd: Error in showAppOpenAd:', error);
      isShowingAd = false;
      isAppOpenAdLoaded = false;
      reject(error);
    }
  });
}

export default null;
