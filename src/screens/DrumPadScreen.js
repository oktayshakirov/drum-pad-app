import React, {useContext} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import Pad from '../components/Pad';
import CurrentPack from '../components/CurrentPack';
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
      <CurrentPack />
      <Metronome />
      <View style={styles.grid}>
        {padConfigs.map(pad => (
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
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
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
