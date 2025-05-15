import React, {useState} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Vibration,
} from 'react-native';
import AudioService from '../services/AudioService';

const Pad = ({sound, label, soundPack}) => {
  const [scale] = useState(new Animated.Value(1));
  const [isPressed, setIsPressed] = useState(false);

  const handlePressIn = async () => {
    if (!sound) {
      return;
    }

    setIsPressed(true);
    Vibration.vibrate(50);
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();

    try {
      await AudioService.playSound(soundPack, sound);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{scale}],
          opacity: sound ? 1 : 0.5,
        },
      ]}>
      <TouchableOpacity
        style={[styles.pad, isPressed && styles.padPressed]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        disabled={!sound}>
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
  },
  pad: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  padPressed: {
    backgroundColor: '#444',
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default Pad;
