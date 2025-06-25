import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Pad from '../components/Pad';
import CurrentPack from '../components/CurrentPack';
import Metronome from '../components/Metronome';
import ChannelSwitch from '../components/ChannelSwitch';
import {useAppContext} from '../contexts/AppContext';
import {getPadConfigs} from '../utils/soundUtils';
import AdBanner from '../components/ads/BannerAd';
import AudioService from '../services/AudioService';

const DrumPadScreen: React.FC = () => {
  const {currentSoundPack} = useAppContext();
  const [activeChannel, setActiveChannel] = useState<'A' | 'B'>('A');
  const [isMetronomePlaying, setIsMetronomePlaying] = useState<boolean>(false);
  const padConfigs = getPadConfigs(currentSoundPack);
  const hasTwoChannels = padConfigs.length > 12;
  const visiblePads = hasTwoChannels
    ? padConfigs.slice(
        activeChannel === 'A' ? 0 : 12,
        activeChannel === 'A' ? 12 : 24,
      )
    : padConfigs;

  const handleOpenPackLibrary = async (): Promise<void> => {
    setIsMetronomePlaying(false);

    try {
      await AudioService.stopAllSounds();
    } catch (error) {
      console.error('Error stopping all sounds:', error);
    }
  };

  return (
    <View style={styles.container}>
      <AdBanner />
      <CurrentPack onOpenPackLibrary={handleOpenPackLibrary} />
      <View style={styles.controlsRow}>
        <View style={styles.leftSection}>
          {hasTwoChannels && (
            <ChannelSwitch
              channel="A"
              onChannelSelect={setActiveChannel}
              disabled={activeChannel === 'A'}
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
              channel="B"
              onChannelSelect={setActiveChannel}
              disabled={activeChannel === 'B'}
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
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    marginBottom: 10,
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
