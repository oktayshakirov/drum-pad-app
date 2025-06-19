import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import AudioService from '../services/AudioService';
import MetronomeSettings from './MetronomeSettings';

const Metronome = ({isPlaying, setIsPlaying}) => {
  const {
    bpm,
    setBpm,
    metronomeSound,
    setMetronomeSound,
    metronomeVolume,
    setMetronomeVolume,
  } = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const beatAnim = useRef(new Animated.Value(1)).current;

  const triggerBeatAnimation = useCallback(() => {
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
    if (isPlaying) {
      AudioService.startMetronome(
        bpm,
        triggerBeatAnimation,
        metronomeSound,
        metronomeVolume,
      );
    } else {
      AudioService.stopMetronome();
    }
    return () => {
      AudioService.stopMetronome();
    };
  }, [bpm, isPlaying, triggerBeatAnimation, metronomeSound, metronomeVolume]);

  const handleToggleMetronome = () => {
    setIsPlaying(!isPlaying);
  };

  const openSettingsModal = () => {
    // FIX: The metronome no longer stops when opening the settings.
    setIsModalVisible(true);
  };

  return (
    <>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={handleToggleMetronome}>
          <View style={isPlaying ? styles.pauseIcon : styles.playIcon} />
        </TouchableOpacity>

        <View style={styles.bpmDisplay}>
          <Animated.View
            style={[styles.bpmCircle, {transform: [{scale: beatAnim}]}]}
          />
          <View style={styles.bpmTextContainer}>
            <Text style={styles.bpmValue}>{bpm}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={openSettingsModal}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* FIX: Pass all values and setters as props to ensure sliders are correct */}
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
    marginTop: 10,
    marginBottom: 20,
    gap: 20,
  },
  bpmDisplay: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bpmCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    backgroundColor: '#222',
    borderWidth: 3,
    borderColor: '#4CAF50',
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 2},
  },
  bpmTextContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bpmValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  bpmLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 0},
  },
  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderLeftWidth: 14,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#000',
    marginLeft: 3,
  },
  pauseIcon: {
    width: 14,
    height: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRightWidth: 5,
    borderLeftWidth: 5,
    borderColor: '#000',
  },
  settingsIcon: {
    fontSize: 24,
    color: '#000',
  },
});

export default Metronome;
