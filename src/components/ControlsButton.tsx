import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  GestureResponderEvent,
  Text,
} from 'react-native';
import * as Animatable from 'react-native-animatable';

interface ControlsButtonProps {
  variant?: 'play' | 'default' | 'control';
  isPlaying?: boolean;
  onPress: (event: GestureResponderEvent) => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  size?: number;
  playIconSrc?: any;
  pauseIconSrc?: any;
  iconSrc?: any;
  label?: string;
  symbol?: string;
  disabled?: boolean;
  animation?: string;
}

export interface ControlsButtonRef {
  triggerAnimation: (animationType?: string) => void;
}

const ControlsButton = forwardRef<ControlsButtonRef, ControlsButtonProps>(
  (
    {
      variant = 'play',
      isPlaying = false,
      onPress,
      onPressIn,
      onPressOut,
      size = 30,
      playIconSrc,
      pauseIconSrc,
      iconSrc,
      label,
      symbol,
      disabled = false,
      animation,
    },
    ref,
  ) => {
    const animRef = useRef<any>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const getDefaultAnimation = (): string => {
      if (variant === 'control' && disabled) {
        return 'flash';
      }
      return 'pulse';
    };

    const triggerAnimation = (animationType?: string): void => {
      if (animRef.current) {
        const animType = animationType || animation || getDefaultAnimation();
        animRef.current[animType](400);
      }
    };

    useImperativeHandle(ref, () => ({
      triggerAnimation,
    }));

    const handlePress = (event: GestureResponderEvent) => {
      triggerAnimation();
      if (!disabled) {
        onPress(event);
      }
    };

    const handlePressIn = (): void => {
      if (disabled) {
        return;
      }

      triggerAnimation();
      if (onPressIn) {
        onPressIn();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          if (onPressIn) {
            onPressIn();
          }
        }, 100);
      }, 200);
    };

    const handlePressOut = (): void => {
      if (onPressOut) {
        onPressOut();
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }, []);

    let content = null;
    if (variant === 'play') {
      if (playIconSrc && pauseIconSrc) {
        content = (
          <Image
            source={isPlaying ? pauseIconSrc : playIconSrc}
            style={[styles.iconImage, {width: size * 0.5, height: size * 0.5}]}
          />
        );
      } else if (isPlaying) {
        content = (
          <View
            style={[
              styles.stopIcon,
              {
                width: size * 0.33,
                height: size * 0.33,
                borderRadius: size * 0.07,
              },
            ]}
          />
        );
      } else {
        content = (
          <View
            style={[
              styles.playIcon,
              {
                borderTopWidth: size * 0.17,
                borderBottomWidth: size * 0.17,
                borderLeftWidth: size * 0.3,
                marginLeft: size * 0.03,
              },
            ]}
          />
        );
      }
    } else if (variant === 'default' && iconSrc) {
      content = (
        <Image
          source={iconSrc}
          style={[styles.iconImage, {width: size * 0.5, height: size * 0.5}]}
        />
      );
    } else if (variant === 'control' && (label || symbol)) {
      content = (
        <Text
          style={[
            styles.controlText,
            {fontSize: size * 0.6},
            disabled && styles.disabledText,
          ]}>
          {symbol || label}
        </Text>
      );
    }

    return (
      <Animatable.View
        ref={animRef}
        duration={400}
        useNativeDriver
        style={[
          styles.button,
          {width: size, height: size, borderRadius: size / 2},
          disabled && styles.disabledButton,
        ]}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
          activeOpacity={0.8}
          disabled={disabled}>
          {content}
        </TouchableOpacity>
      </Animatable.View>
    );
  },
);

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 0},
  },
  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#000',
  },
  stopIcon: {
    backgroundColor: '#000',
  },
  iconImage: {
    resizeMode: 'contain',
  },
  controlText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  disabledText: {
    color: 'rgba(0,0,0,0.2)',
  },
});

export default ControlsButton;
