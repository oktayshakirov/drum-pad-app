import React, {useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import Pad from '../components/Pad';
import CurrentPack from '../components/CurrentPack';
import Metronome from '../components/Metronome';
import ChannelSwitch from '../components/ChannelSwitch';
import {AppContext} from '../contexts/AppContext';
import {getPadConfigs} from '../utils/soundUtils';
import AdBanner from '../components/AdBanner';

const DrumPadScreen = () => {
  const {currentSoundPack} = useContext(AppContext);
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
      <View style={styles.grid}>
        {visiblePads.map(pad => (
          <Pad
            key={pad.id}
            sound={pad.sound}
            label={pad.label}
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
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 10,
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
