import React, {useContext, useState, useRef, useEffect} from 'react';
import {View, StyleSheet, ActivityIndicator, Animated} from 'react-native';
import Pad from '../components/Pad';
import CurrentPack from '../components/CurrentPack';
import Metronome from '../components/Metronome';
import ChannelSwitch from '../components/ChannelSwitch';
import {AppContext} from '../contexts/AppContext';
import {getPadConfigs} from '../utils/soundUtils';
import AdBanner from '../components/AdBanner';

const DrumPadScreen = () => {
  const {currentSoundPack, isLoading} = useContext(AppContext);
  const [activeChannel, setActiveChannel] = useState('A');
  const [isMetronomePlaying, setIsMetronomePlaying] = useState(false);
  const padConfigs = getPadConfigs(currentSoundPack);
  const hasTwoChannels = padConfigs.length > 12;
  const visiblePads = hasTwoChannels
    ? padConfigs.slice(
        activeChannel === 'A' ? 0 : 12,
        activeChannel === 'A' ? 12 : 24,
      )
    : padConfigs;

  const handleOpenPackLibrary = () => {
    setIsMetronomePlaying(false);
  };

  const gridOpacity = useRef(new Animated.Value(1)).current;
  const gridScale = useRef(new Animated.Value(1)).current;
  const prevChannel = useRef(activeChannel);

  useEffect(() => {
    if (prevChannel.current !== activeChannel) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(gridOpacity, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(gridScale, {
            toValue: 0.85,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(gridOpacity, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
          Animated.timing(gridScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
      prevChannel.current = activeChannel;
    }
  }, [activeChannel, gridOpacity, gridScale]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AdBanner />
      <CurrentPack onOpenPackLibrary={handleOpenPackLibrary} />
      <View style={styles.controlsRow}>
        {hasTwoChannels && (
          <ChannelSwitch
            activeChannel={activeChannel}
            onChannelChange={setActiveChannel}
          />
        )}
        {hasTwoChannels && <View />}
        <Metronome
          isPlaying={isMetronomePlaying}
          setIsPlaying={setIsMetronomePlaying}
        />
      </View>
      <Animated.View
        style={[
          styles.grid,
          {opacity: gridOpacity, transform: [{scale: gridScale}]},
        ]}>
        {visiblePads.map(pad => (
          <Pad
            key={pad.id}
            sound={pad.sound}
            label={pad.label}
            soundPack={currentSoundPack}
            color={pad.color}
          />
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
