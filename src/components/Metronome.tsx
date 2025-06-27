import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {AppContext} from '../contexts/AppContext';
import AudioService from '../services/AudioService';
import MetronomeSettings from './MetronomeSettings';
import playIcon from '../assets/images/play.png';
import pauseIcon from '../assets/images/pause.png';
import settingsIcon from '../assets/images/settings.png';
import ControlsButton from './ControlsButton';

interface MetronomeProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const Metronome: React.FC<MetronomeProps> = ({isPlaying, setIsPlaying}) => {
  const context = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const beatAnim = useRef(new Animated.Value(1)).current;

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

  const handleSettingsPress = (): void => {
    openSettingsModal();
  };

  return (
    <>
      <View style={styles.wrapper}>
        <ControlsButton
          variant="play"
          isPlaying={isPlaying}
          onPress={handleToggleMetronome}
          size={40}
          playIconSrc={playIcon}
          pauseIconSrc={pauseIcon}
        />

        <View style={styles.bpmDisplay}>
          <Animated.View
            style={[styles.bpmCircle, {transform: [{scale: beatAnim}]}]}
          />
          <View style={styles.bpmTextContainer}>
            <Text style={styles.bpmValue}>{bpm}</Text>
            <Text style={styles.bpmLabel}>BPM</Text>
          </View>
        </View>

        <ControlsButton
          variant="default"
          iconSrc={settingsIcon}
          onPress={handleSettingsPress}
          size={40}
        />
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
