import React, {useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {METRONOME_SOUNDS, MetronomeSound} from '../assets/sounds/metronome';
import ControlsButton from './ControlsButton';

const BPM_MIN = 40;
const BPM_MAX = 220;
const VOLUME_MIN = 0;
const VOLUME_MAX = 1;

interface MetronomeSettingsProps {
  isVisible: boolean;
  onClose: () => void;
  bpm: number;
  setBpm: (bpm: number) => void;
  metronomeSound: MetronomeSound;
  setMetronomeSound: (sound: MetronomeSound) => void;
  metronomeVolume: number;
  setMetronomeVolume: (volume: number) => void;
}

const MetronomeSettings: React.FC<MetronomeSettingsProps> = ({
  isVisible,
  onClose,
  bpm,
  setBpm,
  metronomeSound,
  setMetronomeSound,
  metronomeVolume,
  setMetronomeVolume,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const currentBpmRef = useRef(bpm);
  const currentVolumeRef = useRef(metronomeVolume);

  useEffect(() => {
    currentBpmRef.current = bpm;
  }, [bpm]);

  useEffect(() => {
    currentVolumeRef.current = metronomeVolume;
  }, [metronomeVolume]);

  useEffect(() => {
    if (isVisible) {
      scaleAnim.setValue(0.8);
      opacityAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible, scaleAnim, opacityAnim]);

  const changeBpm = (amount: number): void => {
    const currentBpm = currentBpmRef.current;
    const newBpm = Math.max(BPM_MIN, Math.min(BPM_MAX, currentBpm + amount));
    setBpm(newBpm);
  };

  const changeVolume = (amount: number): void => {
    const currentVolume = currentVolumeRef.current;
    const newVolume = Math.max(
      VOLUME_MIN,
      Math.min(VOLUME_MAX, parseFloat((currentVolume + amount).toFixed(1))),
    );
    setMetronomeVolume(newVolume);
  };

  const isBpmMin = bpm <= BPM_MIN;
  const isBpmMax = bpm >= BPM_MAX;
  const isVolumeMin = metronomeVolume <= VOLUME_MIN;
  const isVolumeMax = metronomeVolume >= VOLUME_MAX;

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{scale: scaleAnim}],
              opacity: opacityAnim,
            },
          ]}>
          <Text style={styles.title}>Metronome Settings</Text>

          <Text style={styles.sectionTitle}>BPM</Text>
          <View style={styles.buttonControlContainer}>
            <ControlsButton
              variant="control"
              symbol="-"
              size={60}
              disabled={isBpmMin}
              onPress={() => changeBpm(-1)}
              onPressIn={() => changeBpm(-1)}
              onPressOut={() => {}}
            />
            <Text style={styles.bpmDisplay}>{bpm}</Text>
            <ControlsButton
              variant="control"
              symbol="+"
              size={60}
              disabled={isBpmMax}
              onPress={() => changeBpm(1)}
              onPressIn={() => changeBpm(1)}
              onPressOut={() => {}}
            />
          </View>

          <Text style={styles.sectionTitle}>Sound</Text>
          <View style={styles.soundOptionsContainer}>
            {METRONOME_SOUNDS.map(sound => (
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

          <Text style={styles.sectionTitle}>Volume</Text>
          <View style={styles.buttonControlContainer}>
            <ControlsButton
              variant="control"
              symbol="-"
              size={60}
              disabled={isVolumeMin}
              onPress={() => changeVolume(-0.1)}
              onPressIn={() => changeVolume(-0.1)}
              onPressOut={() => {}}
            />
            <Text style={styles.valueText}>
              {(metronomeVolume * 100).toFixed(0)}%
            </Text>
            <ControlsButton
              variant="control"
              symbol="+"
              size={60}
              disabled={isVolumeMax}
              onPress={() => changeVolume(0.1)}
              onPressIn={() => changeVolume(0.1)}
              onPressOut={() => {}}
            />
          </View>

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
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
    alignSelf: 'center',
  },
  bpmDisplay: {
    color: '#fff',
    fontSize: 64,
    fontWeight: 'bold',
    marginHorizontal: 20,
  },
  buttonControlContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 5,
  },
  valueText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    width: 80,
    textAlign: 'center',
  },
  soundOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 10,
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
