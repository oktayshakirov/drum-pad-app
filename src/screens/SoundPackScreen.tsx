import React, {useState, useCallback, memo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {soundPacks} from '../assets/sounds';
import AudioService from '../services/AudioService';
import {useRoute, useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {useAppContext} from '../contexts/AppContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {BlurView} from '@react-native-community/blur';
import Equalizer from '../components/Equalizer';
import ControlsButton from '../components/ControlsButton';
import {UnlockService} from '../services/UnlockService';

const {width: screenWidth} = Dimensions.get('window');

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
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isLoadingAd, setIsLoadingAd] = useState<boolean>(false);
  const [unlockStatus, setUnlockStatus] = useState<{
    isUnlocked: boolean;
    canGetFreeUnlock: boolean;
    hasRewardedAd: boolean;
    hoursUntilFreeUnlock: number;
  } | null>(null);
  const {setCurrentSoundPack} = useAppContext();

  const pack = packId ? soundPacks[packId] : undefined;

  useEffect(() => {
    if (packId) {
      const status = UnlockService.getUnlockStatus(packId);
      setIsUnlocked(status.isUnlocked);
      setUnlockStatus(status);
      setIsLoadingAd(false);
    }
  }, [packId]);

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

  const handleUnlockPack = useCallback(async (): Promise<void> => {
    if (!packId || isLoadingAd) {
      return;
    }

    setIsLoadingAd(true);
    try {
      const result = await UnlockService.attemptUnlockWithFallbacks(packId);

      if (result.success) {
        if (result.method === 'rewarded') {
          // Permanently unlock the pack
          setIsUnlocked(true);
          await setCurrentSoundPack(packId);

          navigation.navigate('DrumPad');
        } else if (result.method === 'free') {
          await setCurrentSoundPack(packId);
          navigation.navigate('DrumPad');
        }
      }
    } catch (error) {
      console.error('Error unlocking pack:', error);
    } finally {
      setIsLoadingAd(false);
      if (packId) {
        const status = UnlockService.getUnlockStatus(packId);
        setUnlockStatus(status);
      }
    }
  }, [packId, isLoadingAd, setCurrentSoundPack, navigation]);

  const handleSelectPack = useCallback(async (): Promise<void> => {
    if (!packId) {
      return;
    }

    await setCurrentSoundPack(packId);
    navigation.navigate('DrumPad');
  }, [packId, setCurrentSoundPack, navigation]);

  const getUnlockButtonText = (): string => {
    if (isLoadingAd) {
      return 'LOADING...';
    }

    if (unlockStatus?.hasRewardedAd) {
      return 'WATCH VIDEO TO UNLOCK';
    }

    if (unlockStatus?.canGetFreeUnlock) {
      return 'UNLOCK FREE';
    }

    return 'NO VIDEO AVAILABLE';
  };

  const getUnlockButtonStyle = () => {
    if (isLoadingAd) {
      return [styles.selectButton, styles.loadingButton];
    }
    if (unlockStatus?.hasRewardedAd) {
      return [styles.selectButton, styles.unlockButton];
    }
    if (unlockStatus?.canGetFreeUnlock) {
      return [styles.selectButton, styles.freeUnlockButton];
    }
    return [styles.selectButton, styles.disabledButton];
  };

  const getUnlockButtonIcon = () => {
    if (isLoadingAd) {
      return require('../assets/images/loading.png');
    }
    if (unlockStatus?.hasRewardedAd) {
      return require('../assets/images/video.png');
    }
    return require('../assets/images/pack.png');
  };

  const isUnlockButtonDisabled = (): boolean => {
    return (
      isLoadingAd ||
      (!unlockStatus?.hasRewardedAd && !unlockStatus?.canGetFreeUnlock)
    );
  };

  const getStatusMessage = (): string => {
    if (unlockStatus?.hasRewardedAd) {
      return '';
    }

    if (unlockStatus?.canGetFreeUnlock) {
      return 'No video ads available. Try once for free!';
    }

    return `No video ads available. Try again in ${unlockStatus?.hoursUntilFreeUnlock} hours.`;
  };

  if (!pack || !pack.sounds || !pack.padConfig || !pack.soundGroups) {
    return null;
  }

  return (
    <View style={styles.absoluteFill}>
      <ImageBackground
        source={pack.cover}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={50}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalBackdrop}>
          <View style={styles.container}>
            <ModalHeader onClose={handleClose} packName={pack.name} />
            <View style={styles.content}>
              <View style={styles.coverContainer}>
                <Image source={pack.cover} style={styles.coverImage} />
                {isPlaying && <Equalizer />}
              </View>
              <View style={styles.infoContainer}>
                <View style={styles.packHeader}>
                  <Text style={styles.packName}>{pack.name}</Text>
                </View>
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
                    <Text style={styles.statLabel}>
                      {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                    </Text>
                    <Text style={styles.lockBadgeIcon}>
                      {isUnlocked ? '🔓' : '🔒'}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionsContainer}>
                  <ControlsButton
                    variant="play"
                    isPlaying={isPlaying}
                    onPress={handlePlayStop}
                    size={60}
                  />
                  {isUnlocked ? (
                    <TouchableOpacity
                      style={styles.selectButton}
                      onPress={handleSelectPack}>
                      <View style={styles.buttonContent}>
                        <Image
                          source={require('../assets/images/pack.png')}
                          style={styles.buttonIcon}
                        />
                        <Text style={styles.selectButtonText}>
                          SELECT THIS PACK
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.unlockContainer}>
                      <TouchableOpacity
                        style={getUnlockButtonStyle()}
                        onPress={handleUnlockPack}
                        disabled={isUnlockButtonDisabled()}>
                        <View style={styles.buttonContent}>
                          <Image
                            source={getUnlockButtonIcon()}
                            style={styles.buttonIcon}
                          />
                          <Text style={styles.selectButtonText}>
                            {getUnlockButtonText()}
                          </Text>
                        </View>
                      </TouchableOpacity>

                      {getStatusMessage() && (
                        <Text style={styles.preparingText}>
                          {getStatusMessage()}
                        </Text>
                      )}
                    </View>
                  )}
                </View>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
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
    backgroundColor: '#1a1a1a',
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
    width: screenWidth * 0.95,
    height: (screenWidth * 0.95 * 9) / 16,
    borderRadius: 20,
  },

  infoContainer: {
    flex: 1,
  },
  packHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  packName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lockIcon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unlockedIcon: {
    opacity: 0.7,
  },
  lockIconText: {
    fontSize: 20,
  },
  packGenre: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  packBpm: {
    color: '#fff',
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
  lockBadge: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  lockBadgeIcon: {
    fontSize: 16,
  },
  actionsContainer: {
    alignItems: 'center',
    gap: 20,
  },
  selectButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
    marginTop: 26,
  },
  unlockButton: {
    backgroundColor: '#FF6B6B',
  },
  freeUnlockButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  loadingButton: {
    backgroundColor: '#9E9E9E',
  },
  unlockContainer: {
    alignItems: 'center',
  },
  preparingText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  selectButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonIcon: {
    width: 20,
    height: 20,
  },
  absoluteFill: {
    flex: 1,
  },
});

export default SoundPackDetailScreen;
