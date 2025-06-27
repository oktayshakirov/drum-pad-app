import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import ControlsButton, {ControlsButtonRef} from './ControlsButton';

interface ChannelSwitchProps {
  channel: 'A' | 'B';
  onChannelSelect: (channel: 'A' | 'B') => void;
  disabled?: boolean;
  onButtonPress?: (channel: 'A' | 'B') => void;
}

export interface ChannelSwitchRef {
  triggerFlash: () => void;
}

const ChannelSwitch = forwardRef<ChannelSwitchRef, ChannelSwitchProps>(
  ({channel, onChannelSelect, disabled, onButtonPress}, ref) => {
    const buttonRef = useRef<ControlsButtonRef>(null);

    useImperativeHandle(ref, () => ({
      triggerFlash: () => {
        buttonRef.current?.triggerAnimation('flash');
      },
    }));

    const handlePress = (): void => {
      if (onButtonPress) {
        onButtonPress(channel);
      }
      onChannelSelect(channel);
    };

    return (
      <ControlsButton
        ref={buttonRef}
        variant="control"
        label={channel}
        size={40}
        onPress={handlePress}
        disabled={disabled}
      />
    );
  },
);

export default ChannelSwitch;
