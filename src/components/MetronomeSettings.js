import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';

const SOUND_OPTIONS = ['tick', 'beep', 'block'];

const MetronomeSettings = ({
  isVisible,
  onClose,
  bpm,
  setBpm,
  metronomeSound,
  setMetronomeSound,
  metronomeVolume,
  setMetronomeVolume,
}) => {
  const handleBpmChange = value => {
    setBpm(Math.floor(value));
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Metronome Settings</Text>

          {/* BPM Section */}
          <Text style={styles.bpmDisplay}>{bpm}</Text>
          <Slider
            style={styles.slider}
            minimumValue={40}
            maximumValue={220}
            step={1}
            value={bpm}
            onValueChange={handleBpmChange}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="#555"
            thumbTintColor="#FFFFFF"
          />

          {/* Sound Section */}
          <Text style={styles.sectionTitle}>Sound</Text>
          <View style={styles.soundOptionsContainer}>
            {SOUND_OPTIONS.map(sound => (
              <TouchableOpacity
                key={sound}
                style={[
                  styles.soundOption,
                  metronomeSound === sound && styles.activeSoundOption,
                ]}
                onPress={() => setMetronomeSound(sound)}>
                <Text
                  style={[
                    styles.soundOptionText,
                    metronomeSound === sound && styles.activeSoundOptionText,
                  ]}>
                  {sound.charAt(0).toUpperCase() + sound.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Volume Section */}
          <Text style={styles.sectionTitle}>Volume</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            step={0.1}
            value={metronomeVolume}
            onValueChange={setMetronomeVolume}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="#555"
            thumbTintColor="#FFFFFF"
          />

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 350,
    backgroundColor: '#2c2c2e',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#a0a0a0',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  bpmDisplay: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  soundOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  soundOption: {
    backgroundColor: '#444',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  activeSoundOption: {
    backgroundColor: '#FFD700',
  },
  soundOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeSoundOptionText: {
    color: '#000',
  },
  doneButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  doneButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MetronomeSettings;
