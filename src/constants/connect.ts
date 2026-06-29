/**
 * Configuration for the "Connect with Us" modal (ConnectModal).
 *
 * ⚠️ FILL THESE IN before shipping — values marked TODO are placeholders.
 * The social URLs and the App Store numeric ID are the only things that
 * are not auto-derivable from the codebase.
 */

/** Shown in titles, email subjects and the "Rate" row. */
export const APP_NAME = 'Shape Beats';

/** Where Report a Bug / Suggest a Feature / Work with Us are sent. */
export const CONTACT_EMAIL = 'shape-beats@oktayshakirov.com';

/**
 * App Store numeric ID — the digits from the App Store listing URL
 * (https://apps.apple.com/app/idXXXXXXXXXX). Used for the "rate / review"
 * deep link on iOS.
 */
export const APP_STORE_ID = '6751116257';

/** Android applicationId — matches android/app/build.gradle + app.json. */
export const ANDROID_PACKAGE = 'com.shadev.shapebeats';

/** AsyncStorage flag so the native review prompt is only requested once. */
export const RATED_FLAG_KEY = 'shapebeats_hasRequestedReview';

/** Social links opened via Linking.openURL. */
export const SOCIAL_URLS = {
  tiktok: 'https://www.tiktok.com/@shape.beats',
};
