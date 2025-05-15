import {Platform} from 'react-native';

export const getSoundPath = (packName, soundName) => {
  const path = `${packName.toLowerCase()}/${packName.toLowerCase()}_${soundName}.wav`;
  return Platform.select({
    ios: path,
    android: `asset:/${path}`,
  });
};
