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
import BpmEditorModal from './BpmEditorModal';

const Metronome = () => {
  useContext(AppContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [displayBpm, setDisplayBpm] = useState(120);
  const [audioBpm, setAudioBpm] = useState(120);

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
    const debounceTimer = setTimeout(() => {
      setAudioBpm(displayBpm);
    }, 200);

    return () => clearTimeout(debounceTimer);
  }, [displayBpm]);

  useEffect(() => {
    if (isPlaying) {
      AudioService.startMetronome(audioBpm, triggerBeatAnimation);
    } else {
      AudioService.stopMetronome();
    }
    return () => {
      AudioService.stopMetronome();
    };
  }, [audioBpm, isPlaying, triggerBeatAnimation]);

  const handleToggleMetronome = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <View style={styles.wrapper}>
        <TouchableOpacity
          style={styles.bpmTouchableWrapper}
          onPress={() => setIsModalVisible(true)}>
          <Animated.View
            style={[styles.bpmCircle, {transform: [{scale: beatAnim}]}]}
          />
          <View style={styles.bpmTextContainer}>
            <Text style={styles.bpmValue}>{displayBpm}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playButton}
          onPress={handleToggleMetronome}>
          <View style={isPlaying ? styles.pauseIcon : styles.playIcon} />
        </TouchableOpacity>
      </View>

      <BpmEditorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        currentBpm={displayBpm}
        onBpmChange={setDisplayBpm}
      />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    gap: 20,
  },
  bpmTouchableWrapper: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bpmCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
    backgroundColor: '#222',
    borderWidth: 2,
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  bpmLabel: {
    color: '#aaa',
    fontSize: 9,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
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
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#000',
    marginLeft: 2,
  },
  pauseIcon: {
    width: 12,
    height: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRightWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#000',
  },
});

export default Metronome;
