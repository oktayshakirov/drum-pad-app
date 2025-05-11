// src/components/Metronome.js
import React, {useContext, useEffect, useRef, useState} from 'react';
import {View, Text, Button, StyleSheet, Platform} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import {playMetronomeTick} from '../services/AudioService';
// Consider using a slider for BPM
// import Slider from '@react-native-community/slider'; // npm install @react-native-community/slider

const Metronome = () => {
  const {metronomeBPM, setMetronomeBPM, isMetronomeOn, setIsMetronomeOn} =
    useContext(AppContext);

  const intervalRef = useRef(null);
  const [beatVisual, setBeatVisual] = useState(false); // For visual feedback

  useEffect(() => {
    if (isMetronomeOn) {
      const intervalTime = (60 / metronomeBPM) * 1000;
      intervalRef.current = setInterval(() => {
        playMetronomeTick();
        setBeatVisual(v => !v); // Toggle visual feedback
        setTimeout(() => setBeatVisual(false), 100); // Reset visual after short duration
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

  const adjustBPM = amount => {
    let newBPM = metronomeBPM + amount;
    if (newBPM < 60) {
      newBPM = 60;
    } // Added curly braces
    if (newBPM > 200) {
      newBPM = 200;
    } // Added curly braces
    setMetronomeBPM(newBPM);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bpmText}>BPM: {metronomeBPM}</Text>
      <View
        style={[styles.beatIndicator, beatVisual && styles.beatIndicatorActive]}
      />
      <View style={styles.controls}>
        <View style={styles.buttonWrapper}>
          <Button
            title="-"
            onPress={() => adjustBPM(-5)}
            color={Platform.OS === 'ios' ? '#fff' : '#333'}
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
        <View style={styles.buttonWrapper}>
          <Button
            title="+"
            onPress={() => adjustBPM(5)}
            color={Platform.OS === 'ios' ? '#fff' : '#333'}
          />
        </View>
      </View>
      {/*
      // Example using Slider:
      <Slider
        style={{width: 200, height: 40}}
        minimumValue={60}
        maximumValue={200}
        step={1}
        value={metronomeBPM}
        onValueChange={value => setMetronomeBPM(value)}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="#AAAAAA"
        thumbTintColor="#FFFFFF"
      />
      */}
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
  },
  buttonWrapper: {
    marginHorizontal: 5,
    backgroundColor: '#444',
    borderRadius: 5,
  },
});

export default Metronome;
