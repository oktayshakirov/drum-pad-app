import React, {useContext} from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';
import Pad from '../components/Pad';
import SoundPackSelector from '../components/SoundPackSelector';
import Metronome from '../components/Metronome';
import {AppContext} from '../contexts/AppContext';

const DrumPadScreen = () => {
  const {currentSoundPack, isLoading} = useContext(AppContext);

  const padConfigs = [
    {id: 1, sound: 'kick', label: 'Kick'},
    {id: 2, sound: 'snare', label: 'Snare'},
    {id: 3, sound: 'hi_hat', label: 'Hi-Hat'},
    {id: 4, sound: 'clap', label: 'Clap'},
    {id: 5, sound: 'snap', label: 'Snap'},
    {id: 6, sound: 'open_hat', label: 'Open Hat'},
    {id: 7, sound: 'melody1', label: 'Melody 1'},
    {id: 8, sound: 'melody2', label: 'Melody 2'},
    {id: 9, sound: 'gun_sfx', label: 'Gun SFX'},
    {id: 10, sound: 'adlib1_sfx', label: 'Adlib 1'},
    {id: 11, sound: 'adlib2_sfx', label: 'Adlib 2'},
    {id: 12, sound: '808', label: '808'},
  ];

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
