import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Pad from '../components/Pad';
import CurrentPack from '../components/CurrentPack';
import Metronome from '../components/Metronome';
import ChannelSwitch, {ChannelSwitchRef} from '../components/ChannelSwitch';
import CustomizeButton, {
  CustomizeButtonRef,
} from '../components/CustomizeButton';
import {useAppContext} from '../contexts/AppContext';
import {
  getPadConfigs,
  getPadConfigsSync,
  getPackTheme,
} from '../utils/soundUtils';
import AdBanner from '../components/ads/BannerAd';
import AudioService from '../services/AudioService';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {BlurView} from '@react-native-community/blur';
import {useGlobalAds} from '../components/ads/adsManager';
import {
  getResponsiveMaxWidth,
  getResponsiveSize,
  getResponsivePercentage,
} from '../utils/deviceUtils';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const DrumPadScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {currentSoundPack} = useAppContext();
  const [activeChannel, setActiveChannel] = useState<'A' | 'B'>('A');
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);
  const [padConfigs, setPadConfigs] = useState<any[]>([]);
  const [padsLoaded, setPadsLoaded] = useState<boolean>(false);
  const skeletonTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [bannerState, setBannerState] = useState({hasBanner: false, height: 0});

  const channelRef = useRef<ChannelSwitchRef>(null);
  const customizeRef = useRef<CustomizeButtonRef>(null);

  useGlobalAds();

  const loadPadConfigs = useCallback(async (): Promise<void> => {
    const MIN_SKELETON_MS = 350;
    if (skeletonTimeoutRef.current) {
      clearTimeout(skeletonTimeoutRef.current);
      skeletonTimeoutRef.current = null;
    }
    setPadsLoaded(false);
    const start = Date.now();

    try {
      const configs = await getPadConfigs(currentSoundPack);
      setPadConfigs(configs);
    } catch (error) {
      console.error('Error loading pad configs:', error);
      const fallbackConfigs = getPadConfigsSync(currentSoundPack);
      setPadConfigs(fallbackConfigs);
    } finally {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, MIN_SKELETON_MS - elapsed);
      if (remaining > 0) {
        skeletonTimeoutRef.current = setTimeout(() => {
          setPadsLoaded(true);
          skeletonTimeoutRef.current = null;
        }, remaining);
      } else {
        setPadsLoaded(true);
      }
    }
  }, [currentSoundPack]);

  useEffect(() => {
    loadPadConfigs();
  }, [loadPadConfigs]);

  useFocusEffect(
    useCallback(() => {
      loadPadConfigs();
      return () => {
        if (skeletonTimeoutRef.current) {
          clearTimeout(skeletonTimeoutRef.current);
          skeletonTimeoutRef.current = null;
        }
      };
    }, [loadPadConfigs]),
  );

  const hasTwoChannels = padConfigs.length > 12;
  const visiblePads = hasTwoChannels
    ? padConfigs.slice(
        activeChannel === 'A' ? 0 : 12,
        activeChannel === 'A' ? 12 : 24,
      )
    : padConfigs;
  const {soundPacks} = require('../assets/sounds');
  const currentPack = soundPacks[currentSoundPack];
  const blurType = getPackTheme(currentSoundPack) === 'dark' ? 'dark' : 'light';

  const controlsMaxWidth = getResponsiveMaxWidth(400, 800);
  const gridMaxWidth = getResponsiveMaxWidth(400, 700);
  const controlsMinHeight = getResponsiveSize(80, 120);

  const skeletonPadBorderRadius = getResponsiveSize(15, 20);

  const bannerContainerHeight = useSharedValue(0);
  const bannerContainerOpacity = useSharedValue(0);

  useEffect(() => {
    if (bannerState.hasBanner && bannerState.height > 0) {
      bannerContainerHeight.value = withTiming(bannerState.height, {
        duration: 300,
      });
      bannerContainerOpacity.value = withTiming(1, {duration: 300});
    } else {
      bannerContainerHeight.value = withTiming(0, {duration: 300});
      bannerContainerOpacity.value = withTiming(0, {duration: 300});
    }
  }, [
    bannerState.hasBanner,
    bannerState.height,
    bannerContainerHeight,
    bannerContainerOpacity,
  ]);

  const bannerContainerAnimatedStyle = useAnimatedStyle(() => ({
    height: bannerContainerHeight.value,
    opacity: bannerContainerOpacity.value,
  }));

  const bannerContainerStyle = useMemo(
    () => [styles.bannerContainer, bannerContainerAnimatedStyle],
    [bannerContainerAnimatedStyle],
  );

  const bannerContainerProps = useMemo(
    () => ({
      style: bannerContainerStyle,
      pointerEvents:
        bannerState.hasBanner && bannerState.height > 0
          ? ('auto' as const)
          : ('none' as const),
    }),
    [bannerContainerStyle, bannerState.hasBanner, bannerState.height],
  );

  const gridOpacity = useSharedValue(0);
  const gridTranslateY = useSharedValue(8);
  useEffect(() => {
    if (padsLoaded && visiblePads.length > 0) {
      gridOpacity.value = withTiming(1, {duration: 220});
      gridTranslateY.value = withTiming(0, {duration: 220});
    } else {
      gridOpacity.value = 0;
      gridTranslateY.value = 8;
    }
  }, [padsLoaded, visiblePads.length, gridOpacity, gridTranslateY]);
  const gridAnimatedStyle = useAnimatedStyle(() => ({
    opacity: gridOpacity.value,
    transform: [{translateY: gridTranslateY.value}],
  }));

  const skeletonSlots = useMemo(
    () => new Array(12).fill(0).map((_, i) => i),
    [],
  );

  const skeletonPadWidth = getResponsivePercentage('30%', '28%');
  const skeletonPadMargin = getResponsivePercentage('1.5%', '2%');

  const handleBannerStateChange = useCallback(
    (hasAd: boolean, height: number) => {
      setBannerState({hasBanner: hasAd, height});
    },
    [],
  );

  const handleOpenPackLibrary = async (): Promise<void> => {
    setIsMetronomePlaying(false);
    try {
      await AudioService.stopAllSounds();
    } catch (error) {
      console.error('Error stopping all sounds:', error);
    }
    navigation.navigate('PackLibrary');
  };

  const handleOpenCustomize = (): void => {
    navigation.navigate('Customize', {packId: currentSoundPack});
  };

  const handleChannelPress = (_pressedChannel: 'A' | 'B'): void => {
    channelRef.current?.triggerFlash();
  };

  return (
    <View style={styles.absoluteFill}>
      <ImageBackground
        source={currentPack.cover}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={blurType}
        blurAmount={40}
      />
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'left', 'right', 'bottom']}>
        <Reanimated.View {...bannerContainerProps}>
          <AdBanner onBannerStateChange={handleBannerStateChange} />
        </Reanimated.View>
        <View style={styles.container}>
          <CurrentPack onOpenPackLibrary={handleOpenPackLibrary} />
          <View
            style={[
              styles.controlsRow,
              {
                maxWidth: controlsMaxWidth,
                minHeight: controlsMinHeight,
              },
            ]}>
            <ChannelSwitch
              ref={channelRef}
              onChannelSelect={setActiveChannel}
              disabled={!hasTwoChannels}
              onButtonPress={handleChannelPress}
            />
            <Metronome
              isPlaying={isMetronomePlaying}
              setIsPlaying={setIsMetronomePlaying}
            />
            <CustomizeButton
              ref={customizeRef}
              onPress={handleOpenCustomize}
              disabled={false}
            />
          </View>
          {padsLoaded && visiblePads.length > 0 ? (
            <Reanimated.View
              style={[
                styles.grid,
                gridAnimatedStyle,
                {maxWidth: gridMaxWidth},
              ]}>
              {visiblePads.map(pad => (
                <Pad
                  key={pad.id}
                  sound={pad.sound}
                  soundPack={currentSoundPack}
                  color={pad.color}
                  icon={pad.icon}
                  title={pad.title}
                />
              ))}
            </Reanimated.View>
          ) : (
            <View style={[styles.grid, {maxWidth: gridMaxWidth}]}>
              {skeletonSlots.map(slot => (
                <View
                  key={slot}
                  style={[
                    styles.skeletonPad,
                    {
                      width: skeletonPadWidth,
                      margin: skeletonPadMargin,
                      borderRadius: skeletonPadBorderRadius,
                    },
                  ]}>
                  <BlurView
                    style={StyleSheet.absoluteFill}
                    blurType="light"
                    blurAmount={18}
                  />
                  <View style={styles.skeletonGlassTint} />
                </View>
              ))}
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteFill: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  bannerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    minHeight: 80,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  skeletonPad: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  skeletonGlassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});

export default DrumPadScreen;
