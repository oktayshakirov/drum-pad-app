import React, {useState, useCallback, memo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import {soundPacks} from '../assets/sounds';
import AudioService from '../services/AudioService';
import {useRoute, useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {useAppContext} from '../contexts/AppContext';
import {StackNavigationProp} from '@react-navigation/stack';

const {width: screenWidth} = Dimensions.get('window');

interface PlayStopButtonProps {
  isPlaying: boolean;
  onPress: () => void;
}

const PlayStopButton: React.FC<PlayStopButtonProps> = memo(
  ({isPlaying, onPress}) => (
    <TouchableOpacity
      style={styles.playButton}
      onPress={onPress}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      {isPlaying ? (
        <View style={styles.stopIcon} />
      ) : (
        <View style={styles.playIcon} />
      )}
    </TouchableOpacity>
  ),
);

const Equalizer: React.FC = memo(() => {
  const [animations] = useState<Animated.Value[]>([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]);

  useEffect(() => {
    const animate = (): void => {
      const sequences = animations.map(anim => {
        return Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.parallel(sequences).start(() => animate());
    };

    animate();
  }, [animations]);

  return (
    <View style={styles.equalizerContainer}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.equalizerBar,
            {
              transform: [{scaleY: anim}],
            },
          ]}
        />
      ))}
    </View>
  );
});

interface ModalHeaderProps {
  onClose: () => void;
  packName: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = memo(({onClose, packName}) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{packName}</Text>
    <TouchableOpacity
      onPress={onClose}
      style={styles.closeButton}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <Text style={styles.closeButtonText}>X</Text>
    </TouchableOpacity>
  </View>
));

const SoundPackDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'SoundPackDetail'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {packId} = route.params;
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const {setCurrentSoundPack} = useAppContext();

  const pack = packId ? soundPacks[packId] : undefined;

  const cleanupDemo = useCallback(async (): Promise<void> => {
    if (isPlaying) {
      setIsPlaying(false);
      await AudioService.stopDemo();
    }
  }, [isPlaying]);

  const handleClose = useCallback(async (): Promise<void> => {
    await cleanupDemo();
    navigation.goBack();
  }, [cleanupDemo, navigation]);

  const handlePlayStop = useCallback(async (): Promise<void> => {
    if (isPlaying) {
      setIsPlaying(false);
      await AudioService.stopDemo();
    } else {
      setIsPlaying(true);
      try {
        const playPromise = await AudioService.playDemo(packId);
        if (playPromise) {
          await playPromise;
          setIsPlaying(false);
        } else {
          setIsPlaying(false);
        }
      } catch (error) {
        console.error('Error playing demo:', error);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, packId]);

  if (!pack || !pack.sounds || !pack.padConfig || !pack.soundGroups) {
    return null;
  }

  return (
    <View style={{flex: 1, backgroundColor: '#1a1a1a'}}>
      <View style={styles.modalBackdrop}>
        <View style={styles.container}>
          <ModalHeader onClose={handleClose} packName={pack.name} />
          <View style={styles.content}>
            <View style={styles.coverContainer}>
              <Image source={pack.cover} style={styles.coverImage} />
              {isPlaying && <Equalizer />}
            </View>
            <View style={styles.infoContainer}>
              <Text style={styles.packName}>{pack.name}</Text>
              <Text style={styles.packGenre}>{pack.genre}</Text>
              <Text style={styles.packBpm}>BPM: {pack.bpm}</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Sounds</Text>
                  <Text style={styles.statValue}>
                    {pack.sounds ? Object.keys(pack.sounds).length : 0}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Groups</Text>
                  <Text style={styles.statValue}>
                    {pack.soundGroups
                      ? Object.keys(pack.soundGroups).length
                      : 0}
                  </Text>
                </View>
              </View>
              <View style={styles.actionsContainer}>
                <PlayStopButton
                  isPlaying={isPlaying}
                  onPress={handlePlayStop}
                />
                <TouchableOpacity
                  style={styles.unlockButton}
                  onPress={() => console.log('Watch video to unlock pressed')}>
                  <Text style={styles.unlockButtonText}>
                    WATCH VIDEO TO UNLOCK
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.unlockButton,
                    {backgroundColor: '#FFD700', marginTop: 10},
                  ]}
                  onPress={async () => {
                    await setCurrentSoundPack(packId);
                    navigation.navigate('DrumPad');
                  }}>
                  <Text style={[styles.unlockButtonText, {color: '#000'}]}>
                    USE THIS PACK
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 30,
    position: 'relative',
  },
  coverImage: {
    width: screenWidth * 0.8,
    height: (screenWidth * 0.8 * 9) / 16,
    borderRadius: 20,
  },
  equalizerContainer: {
    position: 'absolute',
    bottom: 10,
    right: 30,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  equalizerBar: {
    width: 3,
    height: 12,
    backgroundColor: '#FFD700',
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
  infoContainer: {
    flex: 1,
  },
  packName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  packGenre: {
    color: '#aaa',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  packBpm: {
    color: '#FFD700',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  actionsContainer: {
    alignItems: 'center',
    gap: 20,
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 15,
    borderRightWidth: 0,
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: '#000',
    borderRightColor: 'transparent',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 3,
  },
  stopIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#000',
  },
  unlockButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    marginTop: 16,
  },
  unlockButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SoundPackDetailScreen;
