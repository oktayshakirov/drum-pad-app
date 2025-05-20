import React, {useContext} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import Pad from '../components/Pad';
import SoundPackSelector from '../components/SoundPackSelector';
import Metronome from '../components/Metronome';
import {AppContext} from '../contexts/AppContext';
import {getPadConfigs} from '../utils/soundUtils';

const DrumPadScreen = () => {
  const {currentSoundPack, isLoading} = useContext(AppContext);
  const padConfigs = getPadConfigs(currentSoundPack);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerControls}>
        <SoundPackSelector />
        <Metronome />
      </View>
      <View style={styles.grid}>
        {padConfigs.map(pad => (
          <Pad
            key={pad.id}
            sound={pad.sound}
            label={pad.label}
            soundPack={currentSoundPack}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
  },
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    paddingHorizontal: 10,
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
