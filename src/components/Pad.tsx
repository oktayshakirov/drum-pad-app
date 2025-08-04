import React, {useRef} from 'react';
import {TouchableOpacity, StyleSheet, Animated, View} from 'react-native';
import AudioService from '../services/AudioService';
import {Svg, Rect} from 'react-native-svg';
import {useEffect, useState} from 'react';
import type {SoundEvent} from '../types/audioService';
import * as Animatable from 'react-native-animatable';
import {iconMap} from '../assets/sounds/icons';

interface PadProps {
  sound: string | null;
  soundPack: string;
  color: string;
  icon?: string;
}

const Pad: React.FC<PadProps> = ({sound, soundPack, color, icon}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.4)).current;
  const brightnessOpacity = useRef(new Animated.Value(0)).current;
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [showIndicator, setShowIndicator] = useState(false);
  const [indicatorAnim, setIndicatorAnim] = useState<
    'fadeIn' | 'flash' | undefined
  >(undefined);
  const latestPlayInstanceId = useRef<number | null>(null); // Add this

  useEffect(() => {
    if (!sound) {
      return;
    }
    const listener = (event: SoundEvent) => {
      if (event.soundName === sound && event.soundPack === soundPack) {
        if (event.type === 'start' && event.duration) {
          latestPlayInstanceId.current = event.playInstanceId ?? null; // Track the playInstanceId
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
      setIndicatorAnim('flash');
      const timeout = setTimeout(() => setShowIndicator(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isPlaying, showIndicator]);

  const handlePressIn = async (): Promise<void> => {
    if (!sound) {
      return;
    }

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 0.95,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(brightnessOpacity, {
        toValue: 0.3,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      await AudioService.playSound(soundPack, sound);
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handlePressOut = (): void => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 9,
        useNativeDriver: true,
      }),
      Animated.timing(glowOpacity, {
        toValue: 0.4,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(brightnessOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const padColor = sound ? color : '#333';
  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : null;
  return (
    <Animated.View style={[styles.container, {transform: [{scale}]}]}>
      <View style={styles.padWrapper}>
        <TouchableOpacity
          style={styles.touchable}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
          disabled={!sound}>
          <View style={[styles.pad, {backgroundColor: padColor}]}>
            {sound && (
              <>
                <Animated.Image
                  source={require('../assets/images/glow.png')}
                  style={[styles.glow, {opacity: glowOpacity}]}
                  resizeMode="contain"
                />
                <Animated.View
                  style={[
                    styles.brightnessOverlay,
                    {opacity: brightnessOpacity},
                  ]}
                />
                {IconComponent && (
                  <IconComponent
                    width={40}
                    height={40}
                    fill="black"
                    opacity={1}
                    style={iconStyle.icon}
                  />
                )}
              </>
            )}
            {showIndicator && (
              <Animatable.View
                animation={indicatorAnim}
                duration={300}
                style={activePadIndicatorStyle.indicator}
                useNativeDriver>
                <Svg style={StyleSheet.absoluteFill} viewBox="0 0 100 100">
                  <Rect
                    x="3"
                    y="3"
                    width="94"
                    height="94"
                    rx="10"
                    ry="10"
                    stroke="white"
                    strokeWidth="7"
                    fill="none"
                    strokeDasharray={376}
                    strokeDashoffset={(1 - progress) * 376}
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
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  glow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  brightnessOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 15,
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
