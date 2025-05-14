import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {playMetronomeTick} from '../services/AudioService';
import Slider from '@react-native-community/slider';

const Metronome = () => {
  const {metronomeBPM, setMetronomeBPM, isMetronomeOn, setIsMetronomeOn} =
    useContext(AppContext);

  const intervalRef = useRef(null);
  const [beatVisual, setBeatVisual] = useState(false);

  useEffect(() => {
    if (isMetronomeOn) {
      const intervalTime = (60 / metronomeBPM) * 1000;
      intervalRef.current = setInterval(() => {
        playMetronomeTick();
        setBeatVisual(v => !v);
        setTimeout(() => setBeatVisual(false), 100);
      }, intervalTime);
    } else {
      clearInterval(intervalRef.current);
      setBeatVisual(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [isMetronomeOn, metronomeBPM]);

  const handleToggleMetronome = () => {
    setIsMetronomeOn(!isMetronomeOn);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bpmText}>BPM: {metronomeBPM}</Text>
      <View
        style={[styles.beatIndicator, beatVisual && styles.beatIndicatorActive]}
      />
      <View style={styles.controls}>
        <View style={styles.sliderContainer}>
          <Slider
            style={styles.slider}
            minimumValue={60}
            maximumValue={200}
            step={1}
            value={metronomeBPM}
            onValueChange={value => setMetronomeBPM(value)}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#AAAAAA"
            thumbTintColor="#FFFFFF"
          />
        </View>
        <View style={styles.buttonWrapper}>
          <Button
            title={isMetronomeOn ? 'Stop' : 'Start'}
            onPress={handleToggleMetronome}
            color={
              Platform.OS === 'ios' ? '#fff' : isMetronomeOn ? 'red' : 'green'
            }
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 10,
  },
  bpmText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  beatIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginBottom: 10,
    borderColor: '#fff',
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  beatIndicatorActive: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  sliderContainer: {
    flex: 1,
    marginRight: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonWrapper: {
    backgroundColor: '#444',
    borderRadius: 5,
  },
});

export default Metronome;
