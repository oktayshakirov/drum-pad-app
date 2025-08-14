import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import {useAdConsent} from './useAdConsent';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface BannerAdComponentProps {
  onBannerStateChange?: (hasAd: boolean, height: number) => void;
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  onBannerStateChange,
}) => {
  const {requestNonPersonalizedAdsOnly} = useAdConsent();
  const [retryCount, setRetryCount] = useState(0);
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [adUnitId, setAdUnitId] = useState<string | null>(null);

  const bannerHeight = useSharedValue(0);
  const bannerOpacity = useSharedValue(0);

  const hasAdRef = useRef(false);

  const updateBannerState = useCallback(
    (hasAdContent: boolean, height: number) => {
      hasAdRef.current = hasAdContent;

      if (onBannerStateChange) {
        onBannerStateChange(hasAdContent, height);
      }

      if (hasAdContent && height > 0) {
        bannerHeight.value = withTiming(height, {duration: 300});
        bannerOpacity.value = withTiming(1, {duration: 300});
      } else {
        bannerHeight.value = withTiming(0, {duration: 300});
        bannerOpacity.value = withTiming(0, {duration: 300});
      }
    },
    [onBannerStateChange, bannerHeight, bannerOpacity],
  );

  useEffect(() => {
    const checkInitialization = () => {
      if (isGoogleMobileAdsInitialized()) {
        setShouldShowAd(true);

        const currentAdUnitId = getAdUnitId('banner');
        if (!currentAdUnitId) {
          setShouldShowAd(false);
          updateBannerState(false, 0);
          return;
        }

        setAdUnitId(currentAdUnitId);

        const adLoadTimeout = setTimeout(() => {
          if (!hasAdRef.current) {
            updateBannerState(false, 0);
          }
        }, 5000);

        return () => clearTimeout(adLoadTimeout);
      } else {
        setTimeout(checkInitialization, 1000);
      }
    };

    checkInitialization();
  }, [requestNonPersonalizedAdsOnly, retryCount, updateBannerState]);

  const handleAdLoaded = useCallback(() => {
    setRetryCount(0);
    updateBannerState(true, 60);
  }, [updateBannerState]);

  const handleAdFailedToLoad = useCallback(
    (_error: any) => {
      updateBannerState(false, 0);

      if (retryCount < 3) {
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 2000);
      }
    },
    [retryCount, updateBannerState],
  );

  const handleAdClosed = useCallback(() => {
    updateBannerState(false, 0);
  }, [updateBannerState]);

  const handleAdSizeChange = useCallback(
    (event: any) => {
      if (event && event.width && event.height) {
        const height = Math.min(event.height, 100);
        updateBannerState(true, height);
      }
    },
    [updateBannerState],
  );

  const animatedBannerStyle = useAnimatedStyle(() => ({
    height: bannerHeight.value,
    opacity: bannerOpacity.value,
  }));

  const bannerAdProps = useMemo(
    () => ({
      unitId: adUnitId!,
      size: BannerAdSize.ADAPTIVE_BANNER,
      requestOptions: {
        requestNonPersonalizedAdsOnly,
      },
      onAdLoaded: handleAdLoaded,
      onAdFailedToLoad: handleAdFailedToLoad,
      onAdClosed: handleAdClosed,
      onSizeChange: handleAdSizeChange,
    }),
    [
      adUnitId,
      requestNonPersonalizedAdsOnly,
      handleAdLoaded,
      handleAdFailedToLoad,
      handleAdClosed,
      handleAdSizeChange,
    ],
  );

  useEffect(() => {
    if (!shouldShowAd) {
      updateBannerState(false, 0);
    }
  }, [shouldShowAd, updateBannerState]);

  if (!shouldShowAd) {
    return null;
  }

  return (
    <Reanimated.View style={[styles.bannerContainer, animatedBannerStyle]}>
      <BannerAd key={retryCount} {...bannerAdProps} />
    </Reanimated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

export default BannerAdComponent;
