import React, {useRef, useState} from 'react';
import {Pressable, StyleSheet, Animated, View} from 'react-native';

const RecordingButton: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = (): void => {
    setIsRecording(!isRecording);
  };

  const handlePressIn = (): void => {
    Animated.spring(scale, {
      toValue: 0.8,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (): void => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View style={[styles.button, {transform: [{scale}]}]}>
        <View style={styles.recordingDot} />
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  recordingDot: {
    width: 15,
    height: 15,
    borderRadius: 4,
    backgroundColor: 'red',
  },
});

export default RecordingButton;
