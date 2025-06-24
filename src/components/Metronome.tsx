import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {View, Text, StyleSheet, Pressable, Animated, Image} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import AudioService from '../services/AudioService';
import MetronomeSettings from './MetronomeSettings';
import playIcon from '../assets/images/play.png';
import pauseIcon from '../assets/images/pause.png';
import settingsIcon from '../assets/images/settings.png';

interface MetronomeProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const Metronome: React.FC<MetronomeProps> = ({isPlaying, setIsPlaying}) => {
  const context = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const beatAnim = useRef(new Animated.Value(1)).current;
  const playPauseScale = useRef(new Animated.Value(1)).current;
  const settingsScale = useRef(new Animated.Value(1)).current;

  const triggerBeatAnimation = useCallback((): void => {
    Animated.sequence([
      Animated.timing(beatAnim, {
        toValue: 1.05,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(beatAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [beatAnim]);

  useEffect(() => {
    if (context && isPlaying) {
      AudioService.startMetronome(
        context.bpm,
        triggerBeatAnimation,
        context.metronomeSound,
        context.metronomeVolume,
      );
    } else {
      AudioService.stopMetronome();
    }
    return () => {
      AudioService.stopMetronome();
    };
  }, [context, isPlaying, triggerBeatAnimation]);

  if (!context) {
    return null;
  }

  const {
    bpm,
    setBpm,
    metronomeSound,
    setMetronomeSound,
    metronomeVolume,
    setMetronomeVolume,
  } = context;

  const handleToggleMetronome = (): void => {
    setIsPlaying(!isPlaying);
  };

  const openSettingsModal = (): void => {
    setIsModalVisible(true);
  };

  const handlePressIn = (scaleRef: Animated.Value): void => {
    Animated.spring(scaleRef, {
      toValue: 0.7,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (scaleRef: Animated.Value): void => {
    Animated.spring(scaleRef, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <>
      <View style={styles.wrapper}>
        <Pressable
          style={styles.controlButton}
          onPress={handleToggleMetronome}
          onPressIn={() => handlePressIn(playPauseScale)}
          onPressOut={() => handlePressOut(playPauseScale)}>
          <Animated.View style={{transform: [{scale: playPauseScale}]}}>
            <Image
              source={isPlaying ? pauseIcon : playIcon}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </Animated.View>
        </Pressable>

        <View style={styles.bpmDisplay}>
          <Animated.View
            style={[styles.bpmCircle, {transform: [{scale: beatAnim}]}]}
          />
          <View style={styles.bpmTextContainer}>
            <Text style={styles.bpmValue}>{bpm}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </View>
        </View>

        <Pressable
          style={styles.controlButton}
          onPress={openSettingsModal}
          onPressIn={() => handlePressIn(settingsScale)}
          onPressOut={() => handlePressOut(settingsScale)}>
          <Animated.View style={{transform: [{scale: settingsScale}]}}>
            <Image
              source={settingsIcon}
              style={styles.iconImage}
              resizeMode="contain"
            />
          </Animated.View>
        </Pressable>
      </View>

      <MetronomeSettings
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        bpm={bpm}
        setBpm={setBpm}
        metronomeSound={metronomeSound}
        setMetronomeSound={setMetronomeSound}
        metronomeVolume={metronomeVolume}
        setMetronomeVolume={setMetronomeVolume}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 15,
    width: '100%',
  },
  bpmDisplay: {
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bpmCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#222',
    borderWidth: 4,
    borderColor: '#4CAF50',
  },
  bpmTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bpmValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  bpmLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 20,
    height: 20,
  },
});

export default Metronome;
