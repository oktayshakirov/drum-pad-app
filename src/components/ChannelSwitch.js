import React, {useRef, useEffect} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Animated} from 'react-native';

const ChannelSwitch = ({activeChannel, onChannelChange}) => {
  const scaleA = useRef(
    new Animated.Value(activeChannel === 'A' ? 1 : 0.8),
  ).current;
  const scaleB = useRef(
    new Animated.Value(activeChannel === 'B' ? 1 : 0.8),
  ).current;

  useEffect(() => {
    if (activeChannel === 'A') {
      Animated.spring(scaleA, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
      Animated.spring(scaleB, {
        toValue: 0.8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleA, {
        toValue: 0.8,
        useNativeDriver: true,
      }).start();
      Animated.spring(scaleB, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [activeChannel, scaleA, scaleB]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.channelButton,
          activeChannel === 'A' && styles.activeChannel,
        ]}
        onPress={() => onChannelChange('A')}>
        <Animated.View style={{transform: [{scale: scaleA}]}}>
          <Text
            style={[
              styles.channelText,
              activeChannel === 'A' && styles.activeChannelText,
            ]}>
            A
          </Text>
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.channelButton,
          activeChannel === 'B' && styles.activeChannel,
        ]}
        onPress={() => onChannelChange('B')}>
        <Animated.View style={{transform: [{scale: scaleB}]}}>
          <Text
            style={[
              styles.channelText,
              activeChannel === 'B' && styles.activeChannelText,
            ]}>
            B
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
    padding: 4,
  },
  channelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeChannel: {
    backgroundColor: '#3a3a3a',
  },
  channelText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  activeChannelText: {
    color: '#fff',
  },
});

export default ChannelSwitch;
