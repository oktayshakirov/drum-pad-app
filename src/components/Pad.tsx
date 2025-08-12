import React, {useRef} from 'react';
import {TouchableOpacity, StyleSheet, Animated, View, Text} from 'react-native';
import AudioService from '../services/AudioService';
import {Svg, Rect, Defs, RadialGradient, Stop} from 'react-native-svg';
import {useEffect, useState} from 'react';
import type {SoundEvent} from '../types/audioService';
import * as Animatable from 'react-native-animatable';
import {iconMap} from '../assets/sounds/icons';
import {brightenColor} from '../utils/colorUtils';
import Reanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface PadProps {
  sound: string | null;
  soundPack: string;
  color: string;
  icon?: string;
  title?: string;
}

const Pad: React.FC<PadProps> = ({sound, soundPack, color, icon, title}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const innerShadowOpacity = useSharedValue(0.18);
  const innerShadowStyle = useAnimatedStyle(() => ({
    opacity: innerShadowOpacity.value,
  }));
  const gradientIdRef = useRef(
    `inner_${Math.random().toString(36).slice(2, 9)}`,
  );
  const pressHighlightOpacity = useSharedValue(0);
  const pressHighlightStyle = useAnimatedStyle(() => ({
    opacity: pressHighlightOpacity.value,
  }));
  const highlightIdRef = useRef(`hl_${Math.random().toString(36).slice(2, 9)}`);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showIndicator, setShowIndicator] = useState(false);
  const [indicatorAnim, setIndicatorAnim] = useState<
    'fadeIn' | 'fadeOut' | undefined
  >(undefined);
  const latestPlayInstanceId = useRef<number | null>(null);
  const brighterColor = brightenColor(color, 0.9);

  useEffect(() => {
    if (!sound) {
      return;
    }
    const listener = (event: SoundEvent) => {
      if (event.soundName === sound && event.soundPack === soundPack) {
        if (event.type === 'start' && event.duration) {
          latestPlayInstanceId.current = event.playInstanceId ?? null;
          setIsPlaying(true);
          setProgress(0);
          progressAnim.setValue(0);
          Animated.timing(progressAnim, {
            toValue: 1,
            duration: event.duration * 1000,
            useNativeDriver: false,
          }).start();
          if (timerRef.current) {
            clearTimeout(timerRef.current);
          }
          timerRef.current = setTimeout(() => {
            setIsPlaying(false);
            setProgress(1);
          }, event.duration * 1000 + 100);
        } else if (event.type === 'end') {
          if (
            event.playInstanceId == null ||
            event.playInstanceId === latestPlayInstanceId.current
          ) {
            setIsPlaying(false);
            setProgress(1);
            if (timerRef.current) {
              clearTimeout(timerRef.current);
            }
          }
        }
      }
    };
    AudioService.onSoundEvent(listener);
    return () => {
      AudioService.offSoundEvent(listener);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [sound, soundPack, progressAnim]);

  useEffect(() => {
    const sub = progressAnim.addListener(({value}) => {
      setProgress(value);
    });
    return () => progressAnim.removeListener(sub);
  }, [progressAnim]);

  useEffect(() => {
    if (isPlaying) {
      setShowIndicator(true);
      setIndicatorAnim('fadeIn');
    } else if (showIndicator) {
      setIndicatorAnim('fadeOut');
      const timeout = setTimeout(() => setShowIndicator(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, showIndicator]);

  useEffect(() => {
    return () => {
      scale.stopAnimation();
      progressAnim.stopAnimation();
    };
  }, [scale, progressAnim]);

  const handlePressIn = async (): Promise<void> => {
    if (!sound) {
      return;
    }

    scale.stopAnimation();

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.95,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
    innerShadowOpacity.value = withTiming(0.08, {duration: 90});
    pressHighlightOpacity.value = withTiming(0.25, {duration: 90});

    try {
      await AudioService.playSound(soundPack, sound);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handlePressOut = (): void => {
    scale.stopAnimation();

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 9,
        useNativeDriver: true,
      }),
    ]).start();
    innerShadowOpacity.value = withTiming(0.18, {duration: 160});
    pressHighlightOpacity.value = withTiming(0, {duration: 160});
  };

  const padColor = sound ? color : '#333';
  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : null;
  const soundTitle = title || 'Unknown';

  return (
    <Animated.View style={[styles.container, {transform: [{scale}]}]}>
      <View style={styles.padWrapper}>
        <TouchableOpacity
          style={styles.touchable}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={!sound}>
          <View
            style={[
              styles.pad,
              {backgroundColor: padColor},
              showIndicator && styles.padNoShadow,
            ]}>
            {sound && (
              <>
                {/* Inner shadow overlay (no glow) */}
                <Reanimated.View
                  style={[styles.innerShadowOverlay, innerShadowStyle]}
                  pointerEvents="none">
                  <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100">
                    <Defs>
                      <RadialGradient
                        id={gradientIdRef.current}
                        cx="50%"
                        cy="50%"
                        r="60%">
                        <Stop
                          offset="60%"
                          stopColor="#000000"
                          stopOpacity="0"
                        />
                        <Stop
                          offset="100%"
                          stopColor="#000000"
                          stopOpacity="1"
                        />
                      </RadialGradient>
                    </Defs>
                    <Rect
                      x="0"
                      y="0"
                      width="100"
                      height="100"
                      rx="10"
                      ry="10"
                      fill={`url(#${gradientIdRef.current})`}
                    />
                  </Svg>
                </Reanimated.View>
                <Reanimated.View
                  style={[styles.centerHighlightOverlay, pressHighlightStyle]}
                  pointerEvents="none">
                  <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100">
                    <Defs>
                      <RadialGradient
                        id={highlightIdRef.current}
                        cx="50%"
                        cy="50%"
                        r="55%">
                        <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                        <Stop
                          offset="100%"
                          stopColor="#FFFFFF"
                          stopOpacity="0"
                        />
                      </RadialGradient>
                    </Defs>
                    <Rect
                      x="0"
                      y="0"
                      width="100"
                      height="100"
                      rx="10"
                      ry="10"
                      fill={`url(#${highlightIdRef.current})`}
                    />
                  </Svg>
                </Reanimated.View>
                <View style={styles.iconContainer}>
                  {IconComponent && (
                    <IconComponent
                      width={40}
                      height={40}
                      fill={brighterColor}
                      opacity={1}
                      style={iconStyle.icon}
                    />
                  )}
                </View>
                <Text style={[styles.soundTitle, {color: brighterColor}]}>
                  {soundTitle}
                </Text>
              </>
            )}
            {showIndicator && (
              <Animatable.View
                animation={indicatorAnim}
                duration={300}
                style={[
                  activePadIndicatorStyle.indicator,
                  {borderColor: brighterColor},
                ]}
                useNativeDriver>
                <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100">
                  <Rect
                    x="1.5"
                    y="1.5"
                    width="97"
                    height="97"
                    rx="10"
                    ry="10"
                    stroke={brighterColor}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={384}
                    strokeDashoffset={(1 - progress) * 384}
                  />
                </Svg>
              </Animatable.View>
            )}
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '30%',
    aspectRatio: 1,
    margin: '1.5%',
  },
  padWrapper: {
    flex: 1,
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touchable: {
    flex: 1,
    borderRadius: 15,
  },
  pad: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 3,
  },
  padNoShadow: {
    shadowOpacity: 0,
    elevation: 0,
  },
  innerShadowOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  centerHighlightOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundTitle: {
    position: 'absolute',
    bottom: '20%',
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '100%',
  },
});

const activePadIndicatorStyle = StyleSheet.create({
  indicator: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10,
    pointerEvents: 'none',
  },
});

const iconStyle = StyleSheet.create({
  icon: {
    position: 'absolute',
    zIndex: 2,
  },
});

export default Pad;
