import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioService from '../../services/AudioService';

let rewardedAd: RewardedAd | null = null;
let isAdLoaded = false;
let rewardEarned = false;
let adCompletionCallback:
  | ((success: boolean, rewardEarned: boolean) => void)
  | null = null;

export async function initializeRewardedAd() {
  if (!isGoogleMobileAdsInitialized()) {
    return new Promise<void>(resolve => {
      const checkInitialization = () => {
        if (isGoogleMobileAdsInitialized()) {
          initializeRewardedAd().then(resolve);
        } else {
          setTimeout(checkInitialization, 1000);
        }
      };
      checkInitialization();
    });
  }

  if (rewardedAd) {
    rewardedAd.removeAllListeners();
  }

  // Reset state
  isAdLoaded = false;
  rewardEarned = false;

  const consent = await AsyncStorage.getItem('trackingConsent');
  const requestNonPersonalizedAdsOnly = consent !== 'granted';

  const adUnitId = getAdUnitId('rewarded');

  rewardedAd = RewardedAd.createForAdRequest(adUnitId!, {
    requestNonPersonalizedAdsOnly,
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    isAdLoaded = true;
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, _reward => {
    rewardEarned = true;
  });

  rewardedAd.addAdEventListener(AdEventType.OPENED, () => {});

  rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    if (adCompletionCallback) {
      adCompletionCallback(true, rewardEarned);
      adCompletionCallback = null;
    }

    rewardedAd = null;
    isAdLoaded = false;
    rewardEarned = false;

    initializeRewardedAd();
  });

  rewardedAd.addAdEventListener(AdEventType.ERROR, _error => {
    if (adCompletionCallback) {
      adCompletionCallback(false, false);
      adCompletionCallback = null;
    }

    isAdLoaded = false;
    rewardEarned = false;
  });

  try {
    await rewardedAd.load();
  } catch (error) {
    console.error('Error loading rewarded ad:', error);
    isAdLoaded = false;
  }
}

export async function showRewardedAd(): Promise<{
  success: boolean;
  rewardEarned: boolean;
}> {
  if (!rewardedAd || !isAdLoaded) {
    throw new Error('No rewarded ad available');
  }

  return new Promise((resolve, reject) => {
    adCompletionCallback = (success: boolean, rewardEarned: boolean) => {
      if (success) {
        resolve({success: true, rewardEarned});
      } else {
        reject(new Error('Ad failed to show properly'));
      }
    };

    try {
      AudioService.markVideoAdPlayed();
      rewardedAd!.show();
    } catch (error) {
      adCompletionCallback = null;
      reject(error);
    }
  });
}

export function isRewardedAdReady(): boolean {
  return isAdLoaded;
}

export default null;
