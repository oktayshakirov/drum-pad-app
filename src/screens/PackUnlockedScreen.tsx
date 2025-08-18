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
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';

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

  const containerPaddingH = getResponsiveSize(20, 32);
  const headerPaddingTop = getResponsiveSize(40, 60);
  const headerPaddingBottom = getResponsiveSize(20, 30);
  const headerTitleFontSize = getResponsiveSize(32, 48);
  const headerSubtitleFontSize = getResponsiveSize(18, 24);
  const headerTitleMarginBottom = getResponsiveSize(8, 12);
  const glassCardPaddingH = getResponsiveSize(20, 32);
  const glassCardPaddingV = getResponsiveSize(20, 30);
  const glassCardBorderRadius = getResponsiveSize(18, 26);
  const coverMarginBottom = getResponsiveSize(20, 30);
  const coverWidthMultiplier = getResponsiveSize(0.6, 0.5);
  const coverBorderRadius = getResponsiveSize(16, 24);
  const packNameFontSize = getResponsiveSize(28, 36);
  const packGenreFontSize = getResponsiveSize(18, 24);
  const packNameMarginBottom = getResponsiveSize(8, 12);
  const statusContainerPaddingV = getResponsiveSize(20, 30);
  const statusContainerMinHeight = getResponsiveSize(100, 140);
  const loadingTextFontSize = getResponsiveSize(16, 20);
  const loadingTextMarginTop = getResponsiveSize(12, 16);
  const errorTextFontSize = getResponsiveSize(18, 24);
  const errorDetailsFontSize = getResponsiveSize(14, 18);
  const errorDetailsMarginTop = getResponsiveSize(8, 12);
  const errorDetailsMarginBottom = getResponsiveSize(16, 24);
  const retryButtonPaddingV = getResponsiveSize(8, 12);
  const retryButtonPaddingH = getResponsiveSize(16, 24);
  const retryButtonRadius = getResponsiveSize(8, 12);
  const retryButtonFontSize = getResponsiveSize(14, 18);
  const successTextFontSize = getResponsiveSize(18, 24);
  const successDetailsFontSize = getResponsiveSize(14, 18);
  const successDetailsMarginTop = getResponsiveSize(8, 12);
  const buttonContainerPaddingBottom = getResponsiveSize(20, 30);
  const actionButtonPaddingV = getResponsiveSize(15, 20);
  const actionButtonPaddingH = getResponsiveSize(30, 40);
  const actionButtonRadius = getResponsiveSize(25, 32);
  const actionButtonMinWidth = getResponsiveSize(250, 320);
  const actionButtonFontSize = getResponsiveSize(16, 20);
  const buttonIconSize = getResponsiveSize(20, 26);
  const buttonContentGap = getResponsiveSize(8, 12);

  const loadAndVerifyAudio = useCallback(async (): Promise<void> => {
    if (!packId || !pack) {
      setAudioLoadError('Invalid sound pack');
      return;
    }

    try {
      setIsLoadingAudio(true);
      setAudioLoadError(null);

      if (AudioService.isAudioRecoveryNeeded()) {
        await AudioService.recoverFromVideoAdAudioIssue();
      }

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

    triggerPlatformHaptic('notificationSuccess');

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
        <View
          style={[styles.container, {paddingHorizontal: containerPaddingH}]}>
          <View
            style={[
              styles.header,
              {
                paddingTop: headerPaddingTop,
                paddingBottom: headerPaddingBottom,
              },
            ]}>
            <Text
              style={[
                styles.headerTitle,
                {
                  fontSize: headerTitleFontSize,
                  marginBottom: headerTitleMarginBottom,
                },
              ]}>
              🎉 Pack Unlocked!
            </Text>
            <Text
              style={[
                styles.headerSubtitle,
                {fontSize: headerSubtitleFontSize},
              ]}>
              You've successfully unlocked
            </Text>
          </View>

          <View style={styles.packInfo}>
            <View
              style={[
                styles.glassCard,
                {
                  paddingHorizontal: glassCardPaddingH,
                  paddingVertical: glassCardPaddingV,
                  borderRadius: glassCardBorderRadius,
                },
              ]}>
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
                <View
                  style={[
                    styles.coverContainer,
                    {marginBottom: coverMarginBottom},
                  ]}>
                  <Image
                    source={pack.cover}
                    style={[
                      styles.coverImage,
                      {
                        width: screenWidth * coverWidthMultiplier,
                        height: (screenWidth * coverWidthMultiplier * 9) / 16,
                        borderRadius: coverBorderRadius,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.packName,
                    {
                      fontSize: packNameFontSize,
                      marginBottom: packNameMarginBottom,
                    },
                  ]}>
                  {pack.name}
                </Text>
                <Text style={[styles.packGenre, {fontSize: packGenreFontSize}]}>
                  {pack.genre}
                </Text>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.statusContainer,
              {
                paddingVertical: statusContainerPaddingV,
                minHeight: statusContainerMinHeight,
              },
            ]}>
            {isLoadingAudio && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text
                  style={[
                    styles.loadingText,
                    {
                      fontSize: loadingTextFontSize,
                      marginTop: loadingTextMarginTop,
                    },
                  ]}>
                  Preparing your sounds...
                </Text>
              </View>
            )}

            {audioLoadError && (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, {fontSize: errorTextFontSize}]}>
                  ⚠️ Audio Loading Failed
                </Text>
                <Text
                  style={[
                    styles.errorDetails,
                    {
                      fontSize: errorDetailsFontSize,
                      marginTop: errorDetailsMarginTop,
                      marginBottom: errorDetailsMarginBottom,
                    },
                  ]}>
                  {audioLoadError}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.retryButton,
                    {
                      paddingVertical: retryButtonPaddingV,
                      paddingHorizontal: retryButtonPaddingH,
                      borderRadius: retryButtonRadius,
                    },
                  ]}
                  onPress={handleRetryAudio}>
                  <Text
                    style={[
                      styles.retryButtonText,
                      {fontSize: retryButtonFontSize},
                    ]}>
                    Retry Audio Loading
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {canNavigate && (
              <View style={styles.successContainer}>
                <Text
                  style={[styles.successText, {fontSize: successTextFontSize}]}>
                  ✅ Audio Ready!
                </Text>
                <Text
                  style={[
                    styles.successDetails,
                    {
                      fontSize: successDetailsFontSize,
                      marginTop: successDetailsMarginTop,
                    },
                  ]}>
                  Your sounds are loaded and ready to play
                </Text>
              </View>
            )}
          </View>

          <View
            style={[
              styles.buttonContainer,
              {paddingBottom: buttonContainerPaddingBottom},
            ]}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                canNavigate ? styles.enabledButton : styles.disabledButton,
                {
                  paddingVertical: actionButtonPaddingV,
                  paddingHorizontal: actionButtonPaddingH,
                  borderRadius: actionButtonRadius,
                  minWidth: actionButtonMinWidth,
                },
              ]}
              onPress={handleGoToDrumPads}
              disabled={!canNavigate}>
              <View style={[styles.buttonContent, {gap: buttonContentGap}]}>
                <Image
                  source={require('../assets/images/pack.png')}
                  style={[
                    styles.buttonIcon,
                    {width: buttonIconSize, height: buttonIconSize},
                  ]}
                />
                <Text
                  style={[
                    styles.actionButtonText,
                    {fontSize: actionButtonFontSize},
                  ]}>
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
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerSubtitle: {
    color: '#fff',
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
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 2,
  },
  coverContainer: {
    alignItems: 'center',
  },
  coverImage: {
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  packGenre: {
    color: '#D9DEE4',
    textAlign: 'center',
    opacity: 0.9,
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  errorContainer: {
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorDetails: {
    color: '#FF6B6B',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  successContainer: {
    alignItems: 'center',
  },
  successText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successDetails: {
    color: '#4CAF50',
    textAlign: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
  },
  enabledButton: {
    backgroundColor: '#ffffff',
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
  },
  actionButtonText: {
    color: '#000',
    fontWeight: '600',
  },
});

export default PackUnlockedScreen;
