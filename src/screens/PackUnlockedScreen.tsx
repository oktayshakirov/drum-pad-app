import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  ActivityIndicator,
  Platform,
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

const {width: screenWidth} = Dimensions.get('window');

interface PackUnlockedScreenProps {}

const PackUnlockedScreen: React.FC<PackUnlockedScreenProps> = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'PackUnlocked'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {packId} = route.params;
  const {setCurrentSoundPack} = useAppContext();

  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(true);
  const [audioLoadError, setAudioLoadError] = useState<string | null>(null);
  const [canNavigate, setCanNavigate] = useState<boolean>(false);

  const pack = packId ? soundPacks[packId] : undefined;

  const loadAndVerifyAudio = useCallback(async (): Promise<void> => {
    if (!packId || !pack) {
      setAudioLoadError('Invalid sound pack');
      return;
    }

    try {
      setIsLoadingAudio(true);
      setAudioLoadError(null);

      await AudioService.recoverFromVideoAdAudioIssue();

      const success = await AudioService.setSoundPack(packId);

      if (!success) {
        throw new Error('Failed to load sound pack in AudioService');
      }

      const soundNames = pack.sounds ? Object.keys(pack.sounds) : [];

      if (soundNames.length > 0) {
        const audioReady = await AudioService.setSoundPack(packId);
        if (!audioReady) {
          throw new Error('Audio system verification failed');
        }
      }

      setCanNavigate(true);
    } catch (error) {
      setAudioLoadError(`Failed to load audio: ${error}`);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [packId, pack]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadAndVerifyAudio();
    }, 500);

    return () => clearTimeout(timer);
  }, [loadAndVerifyAudio]);

  const handleGoToDrumPads = useCallback(async (): Promise<void> => {
    if (canNavigate && packId) {
      await setCurrentSoundPack(packId);
      navigation.reset({
        index: 0,
        routes: [{name: 'DrumPad'}],
      });
    }
  }, [canNavigate, packId, navigation, setCurrentSoundPack]);

  const handleRetryAudio = useCallback((): void => {
    loadAndVerifyAudio();
  }, [loadAndVerifyAudio]);

  if (!pack) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sound pack not found</Text>
      </View>
    );
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
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>🎉 Pack Unlocked!</Text>
            <Text style={styles.headerSubtitle}>
              You've successfully unlocked
            </Text>
          </View>

          {/* Pack Info */}
          <View style={styles.packInfo}>
            <View style={styles.glassCard}>
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType={
                  Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark'
                }
                blurAmount={18}
                reducedTransparencyFallbackColor="#101418"
              />
              <View style={styles.glassTint} />
              <View style={styles.packInfoContent}>
                <View style={styles.coverContainer}>
                  <Image source={pack.cover} style={styles.coverImage} />
                </View>
                <Text style={styles.packName}>{pack.name}</Text>
                <Text style={styles.packGenre}>{pack.genre}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statusContainer}>
            {isLoadingAudio && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD700" />
                <Text style={styles.loadingText}>Preparing your sounds...</Text>
              </View>
            )}

            {audioLoadError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ Audio Loading Failed</Text>
                <Text style={styles.errorDetails}>{audioLoadError}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={handleRetryAudio}>
                  <Text style={styles.retryButtonText}>
                    Retry Audio Loading
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {canNavigate && (
              <View style={styles.successContainer}>
                <Text style={styles.successText}>✅ Audio Ready!</Text>
                <Text style={styles.successDetails}>
                  Your sounds are loaded and ready to play
                </Text>
              </View>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                canNavigate ? styles.enabledButton : styles.disabledButton,
              ]}
              onPress={handleGoToDrumPads}
              disabled={!canNavigate}>
              <View style={styles.buttonContent}>
                <Image
                  source={require('../assets/images/pack.png')}
                  style={styles.buttonIcon}
                />
                <Text style={styles.actionButtonText}>
                  {isLoadingAudio
                    ? 'LOADING SOUNDS...'
                    : canNavigate
                    ? 'START MAKING BEATS!'
                    : 'AUDIO NOT READY'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteFill: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#FFD700',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.8,
  },
  packInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glassCard: {
    position: 'relative',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  coverImage: {
    width: screenWidth * 0.6,
    height: (screenWidth * 0.6 * 9) / 16,
    borderRadius: 16,
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  packInfoContent: {
    alignItems: 'center',
  },
  packName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  packGenre: {
    color: '#D9DEE4',
    fontSize: 18,
    textAlign: 'center',
    opacity: 0.9,
  },
  statusContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    minHeight: 100,
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorDetails: {
    color: '#FF6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successDetails: {
    color: '#4CAF50',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  buttonContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 250,
    alignItems: 'center',
  },
  enabledButton: {
    backgroundColor: '#FFD700',
  },
  disabledButton: {
    backgroundColor: '#666',
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
  actionButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PackUnlockedScreen;
