import {Platform} from 'react-native';

let HapticFeedback: any = null;

if (Platform.OS === 'ios') {
  try {
    HapticFeedback = require('react-native-haptic-feedback');
  } catch (error) {
    console.warn('Failed to load haptics on iOS:', error);
  }
}

export const triggerHaptic = (type: string) => {
  if (Platform.OS === 'ios' && HapticFeedback && HapticFeedback.trigger) {
    try {
      HapticFeedback.trigger(type);
    } catch (error) {
      console.warn('Haptic feedback failed on iOS:', error);
    }
  }
};

export const triggerPlatformHaptic = (iosType: string) => {
  if (Platform.OS === 'ios') {
    triggerHaptic(iosType);
  }
};

export const haptics = {
  light: () => triggerPlatformHaptic('impactLight'),
  medium: () => triggerPlatformHaptic('impactMedium'),
  heavy: () => triggerPlatformHaptic('impactHeavy'),
  selection: () => triggerPlatformHaptic('selection'),
  success: () => triggerPlatformHaptic('notificationSuccess'),
  warning: () => triggerPlatformHaptic('notificationWarning'),
  error: () => triggerPlatformHaptic('notificationError'),
  soft: () => triggerHaptic('soft'),
};
