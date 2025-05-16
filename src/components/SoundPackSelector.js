import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {Picker} from '@react-native-picker/picker';
import {SOUND_PACKS} from '../utils/soundUtils';

const SoundPackSelector = () => {
  const {currentSoundPack, setCurrentSoundPack, isLoading} =
    useContext(AppContext);
  const [isChanging, setIsChanging] = useState(false);

  const handleSoundPackChange = async newSoundPack => {
    if (newSoundPack === currentSoundPack) {
      return;
    }

    setIsChanging(true);
    try {
      await setCurrentSoundPack(newSoundPack);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Genre Pack</Text>
      <View style={styles.pickerContainer}>
        {(isLoading || isChanging) && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        )}
        <Picker
          selectedValue={currentSoundPack}
          onValueChange={handleSoundPackChange}
          style={styles.picker}
          dropdownIconColor="#fff"
          mode="dropdown"
          enabled={!isLoading && !isChanging}>
          {SOUND_PACKS.map(pack => (
            <Picker.Item
              key={pack}
              label={pack.charAt(0).toUpperCase() + pack.slice(1)}
              value={pack}
              color="#fff"
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  pickerContainer: {
    position: 'relative',
    backgroundColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

export default SoundPackSelector;
