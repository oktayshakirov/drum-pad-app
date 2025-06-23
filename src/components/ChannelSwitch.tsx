import React, {useRef} from 'react';
import {Pressable, Text, StyleSheet, Animated} from 'react-native';

interface ChannelSwitchProps {
  activeChannel: 'A' | 'B';
  onChannelChange: (channel: 'A' | 'B') => void;
}

const ChannelSwitch: React.FC<ChannelSwitchProps> = ({
  activeChannel,
  onChannelChange,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = (): void => {
    onChannelChange(activeChannel === 'A' ? 'B' : 'A');
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
        <Text style={styles.text}>{activeChannel}</Text>
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
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default ChannelSwitch;
