import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {Picker} from '@react-native-picker/picker';

const SoundPackSelector = () => {
  const {soundPack, setSoundPack, isLoading} = useContext(AppContext);
  const [isChanging, setIsChanging] = useState(false);

  const handleSoundPackChange = async newSoundPack => {
    if (newSoundPack === soundPack) {
      return;
    }

    setIsChanging(true);
    try {
      await setSoundPack(newSoundPack);
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
          selectedValue={soundPack}
          onValueChange={handleSoundPackChange}
          style={styles.picker}
          dropdownIconColor="#fff"
          mode="dropdown"
          enabled={!isLoading && !isChanging}>
          <Picker.Item label="808" value="808" color="#fff" />
          <Picker.Item label="909" value="909" color="#fff" />
          <Picker.Item label="707" value="707" color="#fff" />
          <Picker.Item label="606" value="606" color="#fff" />
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
