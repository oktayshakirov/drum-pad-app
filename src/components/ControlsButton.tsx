import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useCallback,
} from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  GestureResponderEvent,
  Text,
  Platform,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {BlurView} from '@react-native-community/blur';
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';

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
  accentColor?: string;
}

export interface ControlsButtonRef {
  triggerAnimation: (animationType?: string) => void;
}

const ICON_SCALE = 0.5;
const STOP_ICON_SCALE = 0.33;
const PLAY_ICON_BORDER_SCALE = 0.17;
const PLAY_ICON_LEFT_SCALE = 0.3;
const PLAY_ICON_MARGIN_SCALE = 0.03;
const TEXT_SCALE = 0.6;
const ANIMATION_DURATION = 400;
const PRESS_DELAY = 200;
const PRESS_INTERVAL = 100;

const ControlsButton = forwardRef<ControlsButtonRef, ControlsButtonProps>(
  (
    {
      variant = 'play',
      isPlaying = false,
      onPress,
      onPressIn,
      onPressOut,
      size,
      playIconSrc,
      pauseIconSrc,
      iconSrc,
      label,
      symbol,
      disabled = false,
      animation,
      accentColor,
    },
    ref,
  ) => {
    const defaultSize = getResponsiveSize(46, 70);
    const buttonSize = size || defaultSize;
    const animRef = useRef<any>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const buttonStyle = useMemo(
      () => ({
        width: buttonSize,
        height: buttonSize,
        borderRadius: buttonSize / 2,
      }),
      [buttonSize],
    );

    const iconStyle = useMemo(
      () => ({
        width: buttonSize * ICON_SCALE,
        height: buttonSize * ICON_SCALE,
      }),
      [buttonSize],
    );

    const stopIconStyle = useMemo(
      () => ({
        width: buttonSize * STOP_ICON_SCALE,
        height: buttonSize * STOP_ICON_SCALE,
        borderRadius: buttonSize * (STOP_ICON_SCALE / 2),
      }),
      [buttonSize],
    );

    const playIconStyle = useMemo(
      () => ({
        borderTopWidth: buttonSize * PLAY_ICON_BORDER_SCALE,
        borderBottomWidth: buttonSize * PLAY_ICON_BORDER_SCALE,
        borderLeftWidth: buttonSize * PLAY_ICON_LEFT_SCALE,
        marginLeft: buttonSize * PLAY_ICON_MARGIN_SCALE,
      }),
      [buttonSize],
    );

    const textStyle = useMemo(
      () => ({
        fontSize: buttonSize * TEXT_SCALE,
      }),
      [buttonSize],
    );

    const getDefaultAnimation = useCallback((): string => {
      if (variant === 'control' && disabled) {
        return 'flash';
      }
      return 'pulse';
    }, [variant, disabled]);

    const triggerAnimation = useCallback(
      (animationType?: string): void => {
        if (animRef.current) {
          const animType = animationType || animation || getDefaultAnimation();
          animRef.current[animType](ANIMATION_DURATION);
        }
      },
      [animation, getDefaultAnimation],
    );

    useImperativeHandle(ref, () => ({
      triggerAnimation,
    }));

    const clearTimers = useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, []);

    const handlePress = useCallback(
      (event: GestureResponderEvent) => {
        triggerAnimation();
        triggerPlatformHaptic('impactLight');

        if (!disabled) {
          onPress(event);
        }
      },
      [triggerAnimation, onPress, disabled],
    );

    const handlePressIn = useCallback((): void => {
      if (disabled) {
        return;
      }

      triggerAnimation();
      triggerPlatformHaptic('impactLight');

      if (onPressIn) {
        onPressIn();
      }

      clearTimers();

      timeoutRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          if (onPressIn) {
            onPressIn();
          }
        }, PRESS_INTERVAL);
      }, PRESS_DELAY);
    }, [disabled, triggerAnimation, onPressIn, clearTimers]);

    const handlePressOut = useCallback((): void => {
      if (onPressOut) {
        onPressOut();
      }
      clearTimers();
    }, [onPressOut, clearTimers]);

    const content = useMemo(() => {
      if (variant === 'play') {
        if (playIconSrc && pauseIconSrc) {
          return (
            <Image
              source={isPlaying ? pauseIconSrc : playIconSrc}
              style={[styles.iconImage, iconStyle]}
            />
          );
        } else if (isPlaying) {
          return <View style={[styles.stopIcon, stopIconStyle]} />;
        } else {
          return <View style={[styles.playIcon, playIconStyle]} />;
        }
      } else if (variant === 'default' && iconSrc) {
        return <Image source={iconSrc} style={[styles.iconImage, iconStyle]} />;
      } else if (variant === 'control' && (label || symbol)) {
        return (
          <Text
            style={[
              styles.controlText,
              textStyle,
              disabled && styles.disabledText,
            ]}>
            {symbol || label}
          </Text>
        );
      }
      return null;
    }, [
      variant,
      isPlaying,
      playIconSrc,
      pauseIconSrc,
      iconSrc,
      label,
      symbol,
      disabled,
      iconStyle,
      stopIconStyle,
      playIconStyle,
      textStyle,
    ]);

    const blurType = Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark';

    React.useEffect(() => {
      return clearTimers;
    }, [clearTimers]);

    return (
      <Animatable.View
        ref={animRef}
        duration={ANIMATION_DURATION}
        useNativeDriver
        style={[
          styles.button,
          buttonStyle,
          disabled && styles.disabledButton,
          accentColor && {borderColor: accentColor},
        ]}>
        {!accentColor && (
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType={blurType}
            blurAmount={18}
            reducedTransparencyFallbackColor="#101418"
          />
        )}
        {!accentColor && <View style={styles.glassTint} />}
        <TouchableOpacity
          style={[
            styles.touchable,
            accentColor && {backgroundColor: accentColor},
          ]}
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
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  touchable: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#fff',
  },
  stopIcon: {
    backgroundColor: '#fff',
  },
  iconImage: {
    resizeMode: 'contain',
    tintColor: '#fff',
  },
  controlText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  disabledButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  disabledText: {
    color: 'rgba(255,255,255,0.35)',
  },
});

export default ControlsButton;
