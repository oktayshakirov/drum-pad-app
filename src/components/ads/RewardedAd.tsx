import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  // CRITICAL: Add all required event listeners per Google's specification
  rewardedAd.addAdEventListener(RewardedAdEventType.LOADED, () => {
    console.log('RewardedAd: Ad loaded successfully');
    isAdLoaded = true;
  });

  rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, reward => {
    console.log(
      `RewardedAd: User earned reward - ${reward.type}: ${reward.amount}`,
    );
    rewardEarned = true;
  });

  // Full screen content delegate methods - CRITICAL for proper lifecycle
  rewardedAd.addAdEventListener(AdEventType.OPENED, () => {
    console.log('RewardedAd: Ad opened/presented');
  });

  rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
    console.log('RewardedAd: Ad dismissed/closed');
    console.log(`RewardedAd: Final state - rewardEarned: ${rewardEarned}`);

    // Call completion callback when ad is dismissed
    if (adCompletionCallback) {
      adCompletionCallback(true, rewardEarned);
      adCompletionCallback = null;
    }

    // Clear the rewarded ad as per Google's recommendation
    rewardedAd = null;
    isAdLoaded = false;
    rewardEarned = false;

    // Initialize a new ad for next time
    initializeRewardedAd();
  });

  rewardedAd.addAdEventListener(AdEventType.ERROR, error => {
    console.error('RewardedAd: Ad failed to present:', error);

    // Call completion callback on error
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
  console.log('RewardedAd: showRewardedAd called');
  console.log(
    `RewardedAd: isAdLoaded = ${isAdLoaded}, rewardedAd exists = ${!!rewardedAd}`,
  );

  if (!rewardedAd || !isAdLoaded) {
    console.error('RewardedAd: No ad available to show');
    throw new Error('No rewarded ad available');
  }

  return new Promise((resolve, reject) => {
    // Set up completion callback
    adCompletionCallback = (success: boolean, rewardEarned: boolean) => {
      console.log(
        `RewardedAd: Completion callback - success: ${success}, rewardEarned: ${rewardEarned}`,
      );
      if (success) {
        resolve({success: true, rewardEarned});
      } else {
        reject(new Error('Ad failed to show properly'));
      }
    };

    try {
      console.log('RewardedAd: Starting ad.show()');
      rewardedAd!.show();
      console.log('RewardedAd: Ad.show() call initiated');
    } catch (error) {
      console.error('RewardedAd: Error calling ad.show():', error);
      adCompletionCallback = null;
      reject(error);
    }
  });
}

export function isRewardedAdReady(): boolean {
  return isAdLoaded;
}

export default null;
