import {RewardedAd, AdEventType} from 'react-native-google-mobile-ads';
import {getAdUnitId} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let rewardedAd: RewardedAd | null = null;
let isAdLoaded = false;
let isShowingAd = false;

export async function initializeRewardedAd() {
  const consent = await AsyncStorage.getItem('trackingConsent');
  const requestNonPersonalizedAdsOnly = consent !== 'granted';

  rewardedAd = RewardedAd.createForAdRequest(getAdUnitId('rewarded')!, {
    requestNonPersonalizedAdsOnly,
  });

  rewardedAd.addAdEventListener(AdEventType.LOADED, () => {
    isAdLoaded = true;
    console.log('Rewarded ad loaded');
  });

  rewardedAd.addAdEventListener(AdEventType.ERROR, (error: Error) => {
    isAdLoaded = false;
    console.error('Rewarded ad failed to load:', error);
  });

  rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    isShowingAd = false;
    isAdLoaded = false;
    rewardedAd!.load();
  });

  await rewardedAd.load();
}

export async function showRewardedAd(): Promise<boolean> {
  if (rewardedAd && isAdLoaded && !isShowingAd) {
    try {
      isShowingAd = true;
      await rewardedAd.show();
      return true;
    } catch (error) {
      console.error('Error showing rewarded ad:', error);
      isShowingAd = false;
      return false;
    }
  }
  return false;
}

export function isRewardedAdLoaded(): boolean {
  return isAdLoaded && !isShowingAd;
}

export default null;
