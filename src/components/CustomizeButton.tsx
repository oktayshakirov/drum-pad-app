import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import ControlsButton, {ControlsButtonRef} from './ControlsButton';

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

    return (
      <ControlsButton
        ref={buttonRef}
        variant="default"
        iconSrc={require('../assets/images/sort.png')}
        size={40}
        onPress={onPress}
        disabled={disabled}
      />
    );
  },
);

export default CustomizeButton;
