import React, {useRef, forwardRef, useImperativeHandle, useState} from 'react';
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
      <ControlsButton
        ref={buttonRef}
        variant="control"
        label={currentChannel}
        size={40}
        onPress={handlePress}
        disabled={disabled}
      />
    );
  },
);

export default ChannelSwitch;
