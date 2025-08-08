import {RewardedAd, RewardedAdEventType} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AudioService from '../../services/AudioService';

let rewardedAd: RewardedAd | null = null;
let isAdLoaded = false;

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

  const consent = await AsyncStorage.getItem('trackingConsent');
  const requestNonPersonalizedAdsOnly = consent !== 'granted';

  const adUnitId = getAdUnitId('rewarded');

  rewardedAd = RewardedAd.createForAdRequest(adUnitId!, {
    requestNonPersonalizedAdsOnly,
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    isAdLoaded = true;
  });

  rewardedAd.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    async _reward => {
      try {
        await AudioService.restoreAfterAd();
      } catch (e) {
        console.error('restoreAfterAd error (rewarded):', e);
      }
    },
  );

  try {
    await rewardedAd.load();
  } catch (error) {
    console.error('Error loading rewarded ad:', error);
    isAdLoaded = false;
  }
}

export async function showRewardedAd() {
  if (!rewardedAd || !isAdLoaded) {
    return;
  }

  try {
    await rewardedAd.show();
  } catch (error) {
    console.error('Error showing rewarded ad:', error);
  } finally {
    isAdLoaded = false;
    rewardedAd = null;
    try {
      await AudioService.restoreAfterAd();
    } catch {}
    initializeRewardedAd();
  }
}

export function isRewardedAdReady(): boolean {
  return isAdLoaded;
}

export default null;
