import React from 'react';
import {Modal, View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Slider from '@react-native-community/slider';

const BpmEditorModal = ({isVisible, onClose, currentBpm, onBpmChange}) => {
  const handleValueChange = value => {
    onBpmChange(Math.floor(value));
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Adjust BPM</Text>
          <Text style={styles.bpmDisplay}>{currentBpm}</Text>
          <Slider
            style={styles.slider}
            minimumValue={40}
            maximumValue={220}
            step={1}
            value={currentBpm}
            onValueChange={handleValueChange}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="#555"
            thumbTintColor="#FFFFFF"
          />
          <View style={styles.fineTuneRow}>
            <TouchableOpacity
              style={styles.fineTuneButton}
              onPress={() => handleValueChange(Math.max(40, currentBpm - 1))}>
              <Text style={styles.fineTuneText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fineTuneButton}
              onPress={() => handleValueChange(Math.min(220, currentBpm + 1))}>
              <Text style={styles.fineTuneText}>+</Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    color: '#a0a0a0',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  bpmDisplay: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  slider: {
    width: '100%',
    height: 40,
    marginBottom: 15,
  },
  fineTuneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  fineTuneButton: {
    backgroundColor: '#444',
    width: 80,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fineTuneText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BpmEditorModal;
