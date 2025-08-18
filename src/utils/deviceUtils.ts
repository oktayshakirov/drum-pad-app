import {Dimensions, Platform} from 'react-native';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

export const isTablet = (): boolean => {
  if (Platform.OS === 'ios') {
    return screenWidth >= 768 || screenHeight >= 1024;
  }

  if (Platform.OS === 'android') {
    const {width, height} = Dimensions.get('window');
    const screenDiagonal = Math.sqrt(width * width + height * height);

    return screenDiagonal >= 1000 || (width >= 600 && height >= 960);
  }

  return false;
};

export const getResponsiveSize = (
  phoneSize: number,
  tabletSize: number,
): number => {
  return isTablet() ? tabletSize : phoneSize;
};

export const getResponsivePercentage = (
  phonePercentage: string,
  tabletPercentage: string,
): `${number}%` => {
  return (isTablet() ? tabletPercentage : phonePercentage) as `${number}%`;
};

export const getResponsiveMaxWidth = (
  phoneMaxWidth: number,
  tabletMaxWidth: number,
): number => {
  return isTablet() ? tabletMaxWidth : phoneMaxWidth;
};
