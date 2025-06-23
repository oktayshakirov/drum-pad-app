import React, {useRef} from 'react';
import {TouchableOpacity, StyleSheet, Animated, View} from 'react-native';
import AudioService from '../services/AudioService';

interface PadProps {
  sound: string | null;
  soundPack: string;
  color: string;
}

const Pad: React.FC<PadProps> = ({sound, soundPack, color}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const brightnessOpacity = useRef(new Animated.Value(0)).current;

  const handlePressIn = async (): Promise<void> => {
    if (!sound) {
      return;
    }

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.95,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(brightnessOpacity, {
        toValue: 0.3,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await AudioService.playSound(soundPack, sound);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handlePressOut = (): void => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(brightnessOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const padColor = sound ? color : '#333';

  return (
    <Animated.View style={[styles.container, {transform: [{scale}]}]}>
      <TouchableOpacity
        style={styles.touchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        disabled={!sound}>
        <View style={[styles.pad, {backgroundColor: padColor}]}>
          {sound && (
            <>
              <Animated.Image
                source={require('../assets/images/glow.png')}
                style={[styles.glow, {opacity: glowOpacity}]}
                resizeMode="contain"
              />
              <Animated.View
                style={[styles.brightnessOverlay, {opacity: brightnessOpacity}]}
              />
            </>
          )}
        </View>
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
  touchable: {
    flex: 1,
    borderRadius: 15,
  },
  pad: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  brightnessOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
  },
});

export default Pad;
