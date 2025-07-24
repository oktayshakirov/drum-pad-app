import React, {useState, useRef} from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Pad from '../components/Pad';
import CurrentPack from '../components/CurrentPack';
import Metronome from '../components/Metronome';
import ChannelSwitch, {ChannelSwitchRef} from '../components/ChannelSwitch';
import {useAppContext} from '../contexts/AppContext';
import {getPadConfigs} from '../utils/soundUtils';
import AdBanner from '../components/ads/BannerAd';
import AudioService from '../services/AudioService';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import {BlurView} from '@react-native-community/blur';

const DrumPadScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {currentSoundPack} = useAppContext();
  const [activeChannel, setActiveChannel] = useState<'A' | 'B'>('A');
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);
  const channelARef = useRef<ChannelSwitchRef>(null);
  const channelBRef = useRef<ChannelSwitchRef>(null);
  const padConfigs = getPadConfigs(currentSoundPack);
  const hasTwoChannels = padConfigs.length > 12;
  const visiblePads = hasTwoChannels
    ? padConfigs.slice(
        activeChannel === 'A' ? 0 : 12,
        activeChannel === 'A' ? 12 : 24,
      )
    : padConfigs;
  const {soundPacks} = require('../assets/sounds');
  const currentPack = soundPacks[currentSoundPack];

  const handleOpenPackLibrary = async (): Promise<void> => {
    setIsMetronomePlaying(false);
    try {
      await AudioService.stopAllSounds();
    } catch (error) {
      console.error('Error stopping all sounds:', error);
    }
    navigation.navigate('PackLibrary');
  };

  const handleChannelPress = (pressedChannel: 'A' | 'B'): void => {
    if (pressedChannel === 'A') {
      channelBRef.current?.triggerFlash();
    } else {
      channelARef.current?.triggerFlash();
    }
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
        blurType="dark"
        blurAmount={40}
      />
      <SafeAreaView
        style={styles.safeArea}
        edges={['top', 'left', 'right', 'bottom']}>
        <AdBanner />
        <View style={styles.container}>
          <CurrentPack onOpenPackLibrary={handleOpenPackLibrary} />
          <View style={styles.controlsRow}>
            <View style={styles.leftSection}>
              {hasTwoChannels && (
                <ChannelSwitch
                  ref={channelARef}
                  channel="A"
                  onChannelSelect={setActiveChannel}
                  disabled={activeChannel === 'A'}
                  onButtonPress={handleChannelPress}
                />
              )}
            </View>
            <View style={styles.centerSection}>
              <Metronome
                isPlaying={isMetronomePlaying}
                setIsPlaying={setIsMetronomePlaying}
              />
            </View>
            <View style={styles.rightSection}>
              {hasTwoChannels && (
                <ChannelSwitch
                  ref={channelBRef}
                  channel="B"
                  onChannelSelect={setActiveChannel}
                  disabled={activeChannel === 'B'}
                  onButtonPress={handleChannelPress}
                />
              )}
            </View>
          </View>
          <View style={styles.grid}>
            {visiblePads.map(pad => (
              <Pad
                key={pad.id}
                sound={pad.sound}
                soundPack={currentSoundPack}
                color={pad.color}
                icon={pad.icon}
              />
            ))}
          </View>
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
});

export default DrumPadScreen;
