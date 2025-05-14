import React, {useState, useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import {playSound} from '../services/AudioService';

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  if (r < 50 && g < 50 && b < 50) {
    return getRandomColor();
  }
  return color;
};

const Pad = ({padId, soundFile, packName}) => {
  const [padColor] = useState(getRandomColor());
  const scaleValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (soundFile) {
      playSound(packName.toLowerCase().replace(' ', '_'), soundFile);
    }

    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 0.9,
        duration: 80,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 0.7,
        duration: 80,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(opacityValue, {
        toValue: 1,
        duration: 100,
        easing: Easing.bezier(0.0, 0.0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <Animated.View
      style={{transform: [{scale: scaleValue}], opacity: opacityValue}}>
      <TouchableOpacity
        style={[styles.pad, {backgroundColor: padColor}]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}>
        <Text style={styles.padText}>
          {/* Can display padId or sound name */}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pad: {
    width: 90,
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  padText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Pad;
