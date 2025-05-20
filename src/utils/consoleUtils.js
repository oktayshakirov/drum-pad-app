import {LogBox} from 'react-native';

// List of warning patterns to filter out
const FILTERED_WARNINGS = [
  'The objective-c `getSleepTimerProgress',
  'The objective-c `setSleepTimer',
  'The objective-c `sleepWhenActiveTrackReachesEnd',
  'The objective-c `clearSleepTimer',
];

LogBox.ignoreLogs(FILTERED_WARNINGS);

const originalConsoleWarn = console.warn;

console.warn = (...args) => {
  const message = args[0];

  const shouldFilter =
    typeof message === 'string' &&
    FILTERED_WARNINGS.some(pattern => message.includes(pattern));

  if (!shouldFilter) {
    originalConsoleWarn.apply(console, args);
  }
};
