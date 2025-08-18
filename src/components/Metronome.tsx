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
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';

interface MetronomeProps {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
}

const Metronome: React.FC<MetronomeProps> = ({isPlaying, setIsPlaying}) => {
  const context = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const beatAnim = useRef(new Animated.Value(1)).current;

  const buttonSize = getResponsiveSize(46, 70);
  const bpmDisplaySize = getResponsiveSize(65, 80);
  const bpmValueFontSize = getResponsiveSize(20, 26);
  const bpmLabelFontSize = getResponsiveSize(12, 16);
  const wrapperPaddingH = getResponsiveSize(20, 30);
  const wrapperGap = getResponsiveSize(15, 20);

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

    triggerPlatformHaptic('selection');
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
    metronomeColor,
  } = context;

  let borderColorStyle = styles.borderGreen;
  if (metronomeColor === 'white') {
    borderColorStyle = styles.borderWhite;
  } else if (metronomeColor === 'blue') {
    borderColorStyle = styles.borderBlue;
  } else if (metronomeColor === 'red') {
    borderColorStyle = styles.borderRed;
  } else if (metronomeColor === 'yellow') {
    borderColorStyle = styles.borderYellow;
  }

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
      <View
        style={[
          styles.wrapper,
          {
            paddingHorizontal: wrapperPaddingH,
            gap: wrapperGap,
          },
        ]}>
        <ControlsButton
          variant="play"
          isPlaying={isPlaying}
          onPress={handleToggleMetronome}
          size={buttonSize}
          playIconSrc={playIcon}
          pauseIconSrc={pauseIcon}
        />

        <View
          style={[
            styles.bpmDisplay,
            {
              width: bpmDisplaySize,
              height: bpmDisplaySize,
            },
          ]}>
          <Animated.View
            style={[
              styles.bpmCircle,
              {transform: [{scale: beatAnim}]},
              borderColorStyle,
            ]}
          />
          <View style={styles.bpmTextContainer}>
            <Text style={[styles.bpmValue, {fontSize: bpmValueFontSize}]}>
              {bpm}
            </Text>
            <Text style={[styles.bpmLabel, {fontSize: bpmLabelFontSize}]}>
              BPM
            </Text>
          </View>
        </View>

        <ControlsButton
          variant="default"
          iconSrc={settingsIcon}
          onPress={handleSettingsPress}
          size={buttonSize}
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
  },
  borderWhite: {borderColor: '#ffffff'},
  borderGreen: {borderColor: '#4CAF50'},
  borderBlue: {borderColor: '#2196F3'},
  borderRed: {borderColor: '#F44336'},
  borderYellow: {borderColor: '#FFEB3B'},
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
