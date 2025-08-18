import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import ControlsButton, {ControlsButtonRef} from './ControlsButton';
import {getResponsiveSize} from '../utils/deviceUtils';

interface CustomizeButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export interface CustomizeButtonRef {
  triggerFlash: () => void;
}

const CustomizeButton = forwardRef<CustomizeButtonRef, CustomizeButtonProps>(
  ({onPress, disabled}, ref) => {
    const buttonRef = useRef<ControlsButtonRef>(null);

    useImperativeHandle(ref, () => ({
      triggerFlash: () => {
        buttonRef.current?.triggerAnimation('flash');
      },
    }));

    const buttonSize = getResponsiveSize(46, 70);

    return (
      <ControlsButton
        ref={buttonRef}
        variant="default"
        iconSrc={require('../assets/images/pad-settings.png')}
        size={buttonSize}
        onPress={onPress}
        disabled={disabled}
      />
    );
  },
);

export default CustomizeButton;
