import {Platform} from 'react-native';
import {TestIds, MobileAds} from 'react-native-google-mobile-ads';

export const USE_TEST_ADS = true;

export const adUnitIDs = {
  banner: Platform.select({
    ios: 'ca-app-pub-5852582960793521/1944834531',
    android: 'ca-app-pub-5852582960793521/3257916205',
  }),
  interstitial: Platform.select({
    ios: 'ca-app-pub-5852582960793521/8114239178',
    android: 'ca-app-pub-5852582960793521/4761285701',
  }),
  appOpen: Platform.select({
    ios: 'ca-app-pub-5852582960793521/4294381841',
    android: 'ca-app-pub-5852582960793521/4102810157',
  }),
  rewarded: Platform.select({
    ios: 'ca-app-pub-5852582960793521/8097895481',
    android: 'ca-app-pub-5852582960793521/5356213896',
  }),
};

export const testAdUnitIDs = {
  banner: TestIds.BANNER,
  interstitial: TestIds.INTERSTITIAL,
  appOpen: TestIds.APP_OPEN,
  rewarded: TestIds.REWARDED,
};

type AdType = 'banner' | 'interstitial' | 'appOpen' | 'rewarded';

export function getAdUnitId(type: AdType): string | undefined {
  return USE_TEST_ADS ? testAdUnitIDs[type] : adUnitIDs[type];
}

let isInitialized = false;
let initializationPromise: Promise<void> | null = null;

export async function initializeGoogleMobileAds(): Promise<void> {
  if (isInitialized) {
    return;
  }

  if (initializationPromise) {
    return initializationPromise;
  }

  initializationPromise = MobileAds()
    .initialize()
    .then(() => {
      isInitialized = true;
    })
    .catch(error => {
      console.error('Failed to initialize Google Mobile Ads SDK:', error);
      isInitialized = false;
      initializationPromise = null;
      throw error;
    });

  return initializationPromise;
}

export function isGoogleMobileAdsInitialized(): boolean {
  return isInitialized;
}

export function debugAdConfiguration() {
  // Debug function kept for potential future use
}

// Enhanced debugging for ad requests
export function logAdRequest(
  type: AdType,
  adUnitId: string,
  additionalInfo?: any,
) {
  console.log('📡 [AD REQUEST] ===== NEW AD REQUEST =====');
  console.log('📡 [AD REQUEST] Type:', type);
  console.log('📡 [AD REQUEST] Ad Unit ID:', adUnitId);
  console.log('📡 [AD REQUEST] SDK Initialized:', isInitialized);
  console.log('📡 [AD REQUEST] Test Mode:', USE_TEST_ADS);
  console.log('📡 [AD REQUEST] Platform:', Platform.OS);
  if (additionalInfo) {
    console.log('📡 [AD REQUEST] Additional Info:', additionalInfo);
  }
  console.log('📡 [AD REQUEST] ===== END AD REQUEST =====');
}
