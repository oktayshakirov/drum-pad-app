import {Platform} from 'react-native';
import {
  REVENUECAT_API_KEY,
  REVENUECAT_API_KEY_IOS,
  REVENUECAT_API_KEY_ANDROID,
} from '@env';

function trimOrEmpty(v: string | undefined): string {
  return (v ?? '').trim();
}

/**
 * RevenueCat public SDK key from `.env` (not committed).
 * Uses `REVENUECAT_API_KEY_IOS` / `REVENUECAT_API_KEY_ANDROID` if set,
 * otherwise falls back to `REVENUECAT_API_KEY`.
 */
export function getRevenueCatApiKey(): string | null {
  const shared = trimOrEmpty(REVENUECAT_API_KEY);
  const ios = trimOrEmpty(REVENUECAT_API_KEY_IOS);
  const android = trimOrEmpty(REVENUECAT_API_KEY_ANDROID);

  if (Platform.OS === 'ios') {
    const key = ios || shared;
    return key || null;
  }
  if (Platform.OS === 'android') {
    const key = android || shared;
    return key || null;
  }
  return null;
}
