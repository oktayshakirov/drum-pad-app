import React, {useRef, useEffect, useContext} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ImageBackground,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {METRONOME_SOUNDS, MetronomeSound} from '../assets/sounds/metronome';
import {soundPacks} from '../assets/sounds';
import {AppContext} from '../contexts/AppContext';
import ControlsButton from './ControlsButton';
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';

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
  const context = useContext(AppContext);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const currentBpmRef = useRef(bpm);
  const currentVolumeRef = useRef(metronomeVolume);

  const modalMaxWidth = getResponsiveSize(350, 500);
  const modalPadding = getResponsiveSize(25, 40);
  const titleFontSize = getResponsiveSize(20, 28);
  const sectionTitleFontSize = getResponsiveSize(16, 20);
  const bpmFontSize = getResponsiveSize(64, 80);
  const valueFontSize = getResponsiveSize(24, 28);
  const doneButtonFontSize = getResponsiveSize(16, 20);
  const doneButtonPadding = getResponsiveSize(15, 20);
  const doneButtonRadius = getResponsiveSize(30, 40);

  const soundButtonPaddingV = getResponsiveSize(10, 16);
  const soundButtonPaddingH = getResponsiveSize(20, 32);
  const soundButtonRadius = getResponsiveSize(15, 20);
  const soundButtonFontSize = getResponsiveSize(14, 18);

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

  const handleBpmPressIn = (amount: number): void => {
    changeBpm(amount);
  };

  const handleVolumePressIn = (amount: number): void => {
    changeVolume(amount);
  };

  const isBpmMin = bpm <= BPM_MIN;
  const isBpmMax = bpm >= BPM_MAX;
  const isVolumeMin = metronomeVolume <= VOLUME_MIN;
  const isVolumeMax = metronomeVolume >= VOLUME_MAX;

  const currentPack = context ? soundPacks[context.currentSoundPack] : null;
  const currentColor = context ? context.metronomeColor : 'white';
  const setColor = context ? context.setMetronomeColor : undefined;

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
              maxWidth: modalMaxWidth,
              transform: [{scale: scaleAnim}],
              opacity: opacityAnim,
            },
          ]}>
          {currentPack && (
            <>
              <ImageBackground
                source={currentPack.cover}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                imageStyle={styles.backgroundImage}
              />
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="dark"
                blurAmount={50}
              />
            </>
          )}
          <View style={[styles.contentContainer, {padding: modalPadding}]}>
            <Text style={[styles.title, {fontSize: titleFontSize}]}>
              Metronome Settings
            </Text>

            <Text
              style={[styles.sectionTitle, {fontSize: sectionTitleFontSize}]}>
              BPM
            </Text>
            <View style={styles.buttonControlContainer}>
              <ControlsButton
                variant="control"
                symbol="-"
                size={getResponsiveSize(60, 90)}
                disabled={isBpmMin}
                onPress={() => {}}
                onPressIn={() => handleBpmPressIn(-1)}
              />
              <Text
                style={[
                  styles.bpmDisplay,
                  {
                    fontSize: bpmFontSize,
                    marginHorizontal: getResponsiveSize(20, 30),
                  },
                ]}>
                {bpm}
              </Text>
              <ControlsButton
                variant="control"
                symbol="+"
                size={getResponsiveSize(60, 90)}
                disabled={isBpmMax}
                onPress={() => {}}
                onPressIn={() => handleBpmPressIn(1)}
              />
            </View>

            <Text
              style={[styles.sectionTitle, {fontSize: sectionTitleFontSize}]}>
              Sound
            </Text>
            <View style={styles.soundOptionsContainer}>
              {METRONOME_SOUNDS.map(sound => (
                <TouchableOpacity
                  key={sound}
                  style={[
                    styles.soundOption,
                    {
                      paddingVertical: soundButtonPaddingV,
                      paddingHorizontal: soundButtonPaddingH,
                      borderRadius: soundButtonRadius,
                    },
                    metronomeSound === sound && styles.activeSoundOption,
                  ]}
                  onPress={() => {
                    triggerPlatformHaptic('selection');
                    setMetronomeSound(sound);
                  }}>
                  <Text
                    style={[
                      styles.soundOptionText,
                      {fontSize: soundButtonFontSize},
                      metronomeSound === sound && styles.activeSoundOptionText,
                    ]}>
                    {sound.charAt(0).toUpperCase() + sound.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text
              style={[styles.sectionTitle, {fontSize: sectionTitleFontSize}]}>
              Volume
            </Text>
            <View style={styles.buttonControlContainer}>
              <ControlsButton
                variant="control"
                symbol="-"
                size={getResponsiveSize(60, 90)}
                disabled={isVolumeMin}
                onPress={() => {}}
                onPressIn={() => handleVolumePressIn(-0.1)}
              />
              <Text
                style={[
                  styles.valueText,
                  {fontSize: valueFontSize, width: getResponsiveSize(80, 120)},
                ]}>
                {(metronomeVolume * 100).toFixed(0)}%
              </Text>
              <ControlsButton
                variant="control"
                symbol="+"
                size={getResponsiveSize(60, 90)}
                disabled={isVolumeMax}
                onPress={() => {}}
                onPressIn={() => handleVolumePressIn(0.1)}
              />
            </View>

            <Text
              style={[styles.sectionTitle, {fontSize: sectionTitleFontSize}]}>
              Color
            </Text>
            <View style={styles.colorOptionsContainer}>
              {[
                {key: 'white', color: '#ffffff'},
                {key: 'green', color: '#4CAF50'},
                {key: 'blue', color: '#2196F3'},
                {key: 'red', color: '#F44336'},
                {key: 'yellow', color: '#FFEB3B'},
              ].map(option => {
                const isSelected = currentColor === option.key;
                return (
                  <ControlsButton
                    key={option.key}
                    variant="default"
                    size={
                      isSelected
                        ? getResponsiveSize(44, 64)
                        : getResponsiveSize(36, 56)
                    }
                    onPress={() => setColor && setColor(option.key as any)}
                    onPressIn={() => {}}
                    onPressOut={() => {}}
                    accentColor={option.color}
                  />
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.doneButton,
                {
                  paddingVertical: doneButtonPadding,
                  borderRadius: doneButtonRadius,
                },
              ]}
              onPress={() => {
                triggerPlatformHaptic('selection');
                onClose();
              }}>
              <Text
                style={[styles.doneButtonText, {fontSize: doneButtonFontSize}]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: '#2c2c2e',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  backgroundImage: {
    borderRadius: 20,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#a0a0a0',
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    alignSelf: 'center',
  },
  colorOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 10,
  },
  bpmDisplay: {
    color: '#fff',
    fontWeight: 'bold',
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
    fontWeight: '600',
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
  },
  activeSoundOption: {
    backgroundColor: '#ffffff',
  },
  soundOptionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  activeSoundOptionText: {
    color: '#000',
  },
  doneButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    alignItems: 'center',
    marginTop: 30,
  },
  doneButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default MetronomeSettings;
