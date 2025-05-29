import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';

const ChannelSwitch = ({activeChannel, onChannelChange}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.channelButton,
          activeChannel === 'A' && styles.activeChannel,
        ]}
        onPress={() => onChannelChange('A')}>
        <Text
          style={[
            styles.channelText,
            activeChannel === 'A' && styles.activeChannelText,
          ]}>
          A
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.channelButton,
          activeChannel === 'B' && styles.activeChannel,
        ]}
        onPress={() => onChannelChange('B')}>
        <Text
          style={[
            styles.channelText,
            activeChannel === 'B' && styles.activeChannelText,
          ]}>
          B
        </Text>
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
