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
        <View style={styles.bannerContainer}>
          <AdBanner />
        </View>
        <View style={styles.container}>
          <CurrentPack onOpenPackLibrary={handleOpenPackLibrary} />
          <View style={styles.controlsRow}>
            <View style={styles.leftSection}>
              <ChannelSwitch
                ref={channelRef}
                onChannelSelect={setActiveChannel}
                disabled={!hasTwoChannels}
                onButtonPress={handleChannelPress}
              />
            </View>
            <View style={styles.centerSection}>
              <Metronome
                isPlaying={isMetronomePlaying}
                setIsPlaying={setIsMetronomePlaying}
              />
            </View>
            <View style={styles.rightSection}>
              <CustomizeButton
                ref={customizeRef}
                onPress={handleOpenCustomize}
                disabled={false}
              />
            </View>
          </View>
          {padsLoaded && visiblePads.length > 0 ? (
            <Reanimated.View style={[styles.grid, gridAnimatedStyle]}>
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
            <View style={styles.grid}>
              {skeletonSlots.map(slot => (
                <View key={slot} style={styles.skeletonPad}>
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
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    minHeight: 80,
  },
  leftSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 40,
  },
  centerSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 40,
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
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  skeletonGlassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
});

export default DrumPadScreen;
