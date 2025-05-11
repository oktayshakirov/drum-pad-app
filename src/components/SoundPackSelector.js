// src/components/SoundPackSelector.js
import React, {useContext} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {AppContext} from '../contexts/AppContext';
// You might want to use a Picker component for a dropdown feel
// import {Picker} from '@react-native-picker/picker'; // npm install @react-native-picker/picker

const SoundPackSelector = () => {
  const {availableSoundPacks, currentSoundPack, switchSoundPack} =
    useContext(AppContext);

  // For simplicity, using buttons. A Picker would be more conventional for dropdowns.
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sound Pack:</Text>
      <View style={styles.buttonsContainer}>
        {Object.keys(availableSoundPacks).map(packKey => (
          <View key={packKey} style={styles.buttonWrapper}>
            <Button
              title={availableSoundPacks[packKey].name}
              onPress={() => switchSoundPack(packKey)}
              disabled={currentSoundPack.id === availableSoundPacks[packKey].id}
              color={
                Platform.OS === 'ios'
                  ? '#fff'
                  : currentSoundPack.id === availableSoundPacks[packKey].id
                  ? '#555'
                  : '#333'
              }
            />
          </View>
        ))}
      </View>
      {/*
      // Example using Picker:
      <Picker
        selectedValue={Object.keys(availableSoundPacks).find(key => availableSoundPacks[key].id === currentSoundPack.id)}
        style={{ height: 50, width: 200, color: '#fff' }}
        dropdownIconColor="#fff"
        onValueChange={(itemValue, itemIndex) => switchSoundPack(itemValue)}
      >
        {Object.keys(availableSoundPacks).map(packKey => (
          <Picker.Item key={packKey} label={availableSoundPacks[packKey].name} value={packKey} />
        ))}
      </Picker>
      */}
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonWrapper: {
    marginHorizontal: 5,
    backgroundColor: '#444', // Button background for Android visibility
    borderRadius: 5,
  },
});

export default SoundPackSelector;
