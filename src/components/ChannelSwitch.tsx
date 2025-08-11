import React, {useRef, forwardRef, useImperativeHandle, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import ControlsButton, {ControlsButtonRef} from './ControlsButton';

interface ChannelSwitchProps {
  onChannelSelect: (channel: 'A' | 'B') => void;
  disabled?: boolean;
  onButtonPress?: (channel: 'A' | 'B') => void;
}

export interface ChannelSwitchRef {
  triggerFlash: () => void;
}

const ChannelSwitch = forwardRef<ChannelSwitchRef, ChannelSwitchProps>(
  ({onChannelSelect, disabled, onButtonPress}, ref) => {
    const buttonRef = useRef<ControlsButtonRef>(null);
    const [currentChannel, setCurrentChannel] = useState<'A' | 'B'>('A');

    useImperativeHandle(ref, () => ({
      triggerFlash: () => {
        buttonRef.current?.triggerAnimation('flash');
      },
    }));

    const handlePress = (): void => {
      const newChannel = currentChannel === 'A' ? 'B' : 'A';
      setCurrentChannel(newChannel);

      if (onButtonPress) {
        onButtonPress(newChannel);
      }
      onChannelSelect(newChannel);
    };

    return (
      <View style={styles.container}>
        <ControlsButton
          ref={buttonRef}
          variant="control"
          label={currentChannel}
          size={46}
          onPress={handlePress}
          disabled={disabled}
        />
        {disabled && (
          <View style={styles.disabledOverlay} pointerEvents="none">
            <View style={styles.diagonalLine} />
          </View>
        )}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  disabledOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  diagonalLine: {
    width: 32,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.81)',
    transform: [{rotate: '45deg'}],
    borderRadius: 1,
  },
});

export default ChannelSwitch;
