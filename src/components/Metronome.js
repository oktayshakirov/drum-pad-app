import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import AudioService from '../services/AudioService';

const Metronome = () => {
  useContext(AppContext);

  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const beatAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      AudioService.stopMetronome();
    };
  }, []);

  const handleToggleMetronome = async () => {
    if (isPlaying) {
      await AudioService.stopMetronome();
    } else {
      await AudioService.startMetronome(bpm);
    }
    setIsPlaying(!isPlaying);
  };

  const handleBPMChange = value => {
    const clampedBpm = Math.max(40, Math.min(200, value));
    setBpm(clampedBpm);
    if (isPlaying) {
      AudioService.stopMetronome();
      AudioService.startMetronome(clampedBpm);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.centeredColumn}>
        <Animated.View
          style={[styles.bpmCircle, {transform: [{scale: beatAnim}]}]}>
          <Text style={styles.bpmValue}>{bpm}</Text>
          <Text style={styles.bpmLabel}>BPM</Text>
        </Animated.View>
        <View style={styles.bpmStepRow}>
          <TouchableOpacity
            style={styles.bpmStepButton}
            onPress={() => handleBPMChange(bpm - 5)}>
            <Text style={styles.bpmStepText}>-5</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bpmStepButton}
            onPress={() => handleBPMChange(bpm + 5)}>
            <Text style={styles.bpmStepText}>+5</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.startStopButton, isPlaying && styles.startStopActive]}
          onPress={handleToggleMetronome}>
          <Text style={styles.startStopText}>
            {isPlaying ? 'Stop' : 'Start'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    marginTop: 10,
    width: '100%',
  },
  centeredColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  bpmCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#222',
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    shadowColor: '#4CAF50',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
  },
  bpmValue: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  bpmLabel: {
    color: '#aaa',
    fontSize: 13,
    marginTop: -2,
  },
  bpmStepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    gap: 10,
  },
  bpmStepButton: {
    backgroundColor: '#333',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 18,
    marginHorizontal: 4,
    elevation: 2,
  },
  bpmStepText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  startStopButton: {
    backgroundColor: '#444',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  startStopActive: {
    backgroundColor: '#4CAF50',
  },
  startStopText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default Metronome;
