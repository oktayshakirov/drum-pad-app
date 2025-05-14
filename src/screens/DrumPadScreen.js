import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import Pad from '../components/Pad';
import SoundPackSelector from '../components/SoundPackSelector';
import Metronome from '../components/Metronome';
import {AppContext} from '../contexts/AppContext';

const DrumPadScreen = () => {
  const {currentSoundPack} = useContext(AppContext);

  const padIds = Array.from({length: 12}, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.headerControls}>
        <SoundPackSelector />
        <Metronome />
      </View>
      <View style={styles.grid}>
        {padIds.map(id => (
          <Pad
            key={id}
            padId={id}
            soundFile={currentSoundPack.sounds[id]}
            packName={currentSoundPack.name}
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
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
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
