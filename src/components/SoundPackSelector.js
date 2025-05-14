import React, {useContext} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {AppContext} from '../contexts/AppContext';

const SoundPackSelector = () => {
  const {availableSoundPacks, currentSoundPack, switchSoundPack} =
    useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sound Pack:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={Object.keys(availableSoundPacks).find(
            key => availableSoundPacks[key].id === currentSoundPack.id,
          )}
          style={styles.picker}
          dropdownIconColor="#fff"
          onValueChange={itemValue => switchSoundPack(itemValue)}>
          {Object.keys(availableSoundPacks).map(packKey => (
            <Picker.Item
              key={packKey}
              label={availableSoundPacks[packKey].name}
              value={packKey}
              color={Platform.OS === 'ios' ? '#fff' : '#000'}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  pickerContainer: {
    width: '80%',
    backgroundColor: '#444',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    color: '#fff',
  },
});

export default SoundPackSelector;
