import {Platform} from 'react-native';
import {TestIds} from 'react-native-google-mobile-ads';

export const USE_TEST_ADS = false;

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
