import {RewardedAd, RewardedAdEventType} from 'react-native-google-mobile-ads';
import {getAdUnitId} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let rewardedAd: RewardedAd | null = null;
let isAdLoaded = false;

export async function initializeRewardedAd() {
  const consent = await AsyncStorage.getItem('trackingConsent');
  const requestNonPersonalizedAdsOnly = consent !== 'granted';

  rewardedAd = RewardedAd.createForAdRequest(getAdUnitId('rewarded')!, {
    requestNonPersonalizedAdsOnly,
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    isAdLoaded = true;
    console.log('Rewarded ad loaded');
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
    console.log('User earned reward:', reward);
  });

  await rewardedAd.load();
}

export async function showRewardedAd() {
  if (rewardedAd && isAdLoaded) {
    try {
      await rewardedAd.show();
      isAdLoaded = false;
      rewardedAd = null;
      initializeRewardedAd();
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
    }
  }
}

export function isRewardedAdReady(): boolean {
  return isAdLoaded;
}

export default null;
