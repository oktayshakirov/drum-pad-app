import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {getAdUnitId, isGoogleMobileAdsInitialized} from './adConfig';
import {useAdConsent} from './useAdConsent';

const BannerAdComponent = () => {
  const {requestNonPersonalizedAdsOnly} = useAdConsent();
  const [retryCount, setRetryCount] = useState(0);
  const [shouldShowAd, setShouldShowAd] = useState(false);
  const [adUnitId, setAdUnitId] = useState<string | null>(null);

  useEffect(() => {
    const checkInitialization = () => {
      if (isGoogleMobileAdsInitialized()) {
        setShouldShowAd(true);

        const currentAdUnitId = getAdUnitId('banner');
        setAdUnitId(currentAdUnitId || null);
      } else {
        setTimeout(checkInitialization, 1000);
      }
    };

    checkInitialization();
  }, [requestNonPersonalizedAdsOnly, retryCount]);

  const handleAdLoaded = () => {
    setRetryCount(0);
  };

  const handleAdFailedToLoad = (_error: any) => {
    if (retryCount < 3) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 2000);
    }
  };

  if (!shouldShowAd) {
    return <View style={styles.bannerContainer} />;
  }

  return (
    <View style={styles.bannerContainer}>
      <BannerAd
        key={retryCount}
        unitId={adUnitId!}
        size={BannerAdSize.ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly,
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    alignItems: 'center',
    minHeight: 50,
  },
});

export default BannerAdComponent;
