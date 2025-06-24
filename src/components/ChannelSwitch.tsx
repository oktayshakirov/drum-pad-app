import React, {useRef} from 'react';
import {Pressable, Text, StyleSheet, Animated} from 'react-native';

interface ChannelSwitchProps {
  channel: 'A' | 'B';
  onChannelSelect: (channel: 'A' | 'B') => void;
  disabled?: boolean;
}

const ChannelSwitch: React.FC<ChannelSwitchProps> = ({
  channel,
  onChannelSelect,
  disabled,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = (): void => {
    onChannelSelect(channel);
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
      disabled={disabled}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.button,
          disabled && styles.disabledButton,
          {transform: [{scale}]},
        ]}>
        <Text style={[styles.text, disabled && styles.disabledText]}>
          {channel}
        </Text>
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
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  text: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
  },
  disabledText: {
    color: 'rgba(0, 0, 0, 0.2)',
  },
});

export default ChannelSwitch;
