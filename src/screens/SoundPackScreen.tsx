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
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {useAppContext} from '../contexts/AppContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {BlurView} from '@react-native-community/blur';
import Equalizer from '../components/Equalizer';
import ControlsButton from '../components/ControlsButton';
import {UnlockService} from '../services/UnlockService';
import {showGlobalInterstitial} from '../components/ads/adsManager';
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';

const {width: screenWidth} = Dimensions.get('window');

interface ModalHeaderProps {
  onClose: () => void;
  packName: string;
}

const ModalHeader: React.FC<ModalHeaderProps> = memo(({onClose, packName}) => {
  const headerPaddingH = getResponsiveSize(20, 32);
  const headerPaddingV = getResponsiveSize(15, 24);
  const headerTitleFontSize = getResponsiveSize(18, 32);
  const closeButtonSize = getResponsiveSize(30, 52);
  const closeButtonRadius = getResponsiveSize(15, 26);
  const closeButtonFontSize = getResponsiveSize(16, 26);

  return (
    <View
      style={[
        styles.header,
        {
          paddingHorizontal: headerPaddingH,
          paddingVertical: headerPaddingV,
        },
      ]}>
      <Text
        style={[
          styles.headerTitle,
          {
            fontSize: headerTitleFontSize,
          },
        ]}>
        {packName}
      </Text>
      <TouchableOpacity
        onPress={() => {
          triggerPlatformHaptic('selection');
          onClose();
        }}
        style={[
          styles.closeButton,
          {
            width: closeButtonSize,
            height: closeButtonSize,
            borderRadius: closeButtonRadius,
          },
        ]}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Text
          style={[
            styles.closeButtonText,
            {
              fontSize: closeButtonFontSize,
            },
          ]}>
          X
        </Text>
      </TouchableOpacity>
    </View>
  );
});

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
  const {setCurrentSoundPack, currentSoundPack} = useAppContext();

  const pack = packId ? soundPacks[packId] : undefined;

  const contentPaddingH = getResponsiveSize(20, 32);
  const contentPaddingTop = getResponsiveSize(20, 30);
  const packNameFontSize = getResponsiveSize(28, 40);
  const packGenreFontSize = getResponsiveSize(18, 24);
  const packGenreMarginBottom = getResponsiveSize(20, 30);
  const statsMarginTop = getResponsiveSize(20, 30);
  const statsMarginBottom = getResponsiveSize(30, 40);
  const statsPaddingH = getResponsiveSize(20, 32);
  const statLabelFontSize = getResponsiveSize(14, 22);
  const statValueFontSize = getResponsiveSize(20, 32);
  const lockBadgeIconFontSize = getResponsiveSize(16, 26);
  const playButtonSize = getResponsiveSize(60, 80);
  const playButtonMarginTop = getResponsiveSize(20, 30);
  const playButtonMarginBottom = getResponsiveSize(10, 15);
  const bottomButtonPaddingBottom = getResponsiveSize(20, 30);
  const bottomButtonPaddingH = getResponsiveSize(20, 32);
  const selectButtonPaddingV = getResponsiveSize(15, 24);
  const selectButtonPaddingH = getResponsiveSize(30, 48);
  const selectButtonRadius = getResponsiveSize(25, 36);
  const selectButtonMinWidth = getResponsiveSize(220, 360);
  const selectButtonFontSize = getResponsiveSize(16, 22);
  const preparingTextFontSize = getResponsiveSize(12, 16);
  const buttonIconSize = getResponsiveSize(20, 30);
  const currentPackPaddingH = getResponsiveSize(20, 28);
  const currentPackPaddingV = getResponsiveSize(12, 16);
  const currentPackRadius = getResponsiveSize(20, 26);
  const currentPackMarginBottom = getResponsiveSize(20, 30);
  const currentPackFontSize = getResponsiveSize(16, 20);
  const coverMarginBottom = getResponsiveSize(25, 35);
  const coverBorderRadius = getResponsiveSize(20, 28);
  const coverWidthMultiplier = getResponsiveSize(0.95, 0.7125);

  const isCurrentPack = useCallback((): boolean => {
    return currentSoundPack === packId;
  }, [currentSoundPack, packId]);

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

  useFocusEffect(
    useCallback(() => {
      return () => {
        cleanupDemo();
      };
    }, [cleanupDemo]),
  );

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
          setIsUnlocked(true);
          setTimeout(() => {
            navigation.navigate('PackUnlocked', {packId});
          }, 100);
        } else if (result.method === 'free') {
          await setCurrentSoundPack(packId);
          navigation.navigate('DrumPad');
        }
      }
    } catch (error) {
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

    if (isCurrentPack()) {
      navigation.navigate('DrumPad');
      return;
    }

    try {
      await showGlobalInterstitial();
    } catch (error) {}

    await setCurrentSoundPack(packId);
    navigation.navigate('DrumPad');
  }, [packId, setCurrentSoundPack, navigation, isCurrentPack]);

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

  const getSelectButtonText = (): string => {
    if (isCurrentPack()) {
      return 'GO BACK TO THIS PACK';
    }
    return 'SELECT THIS PACK';
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
            <View
              style={[
                styles.content,
                {
                  paddingHorizontal: contentPaddingH,
                  paddingTop: contentPaddingTop,
                },
              ]}>
              <View style={styles.scrollableContent}>
                {isCurrentPack() && (
                  <View
                    style={[
                      styles.currentPackIndicator,
                      {
                        paddingHorizontal: currentPackPaddingH,
                        paddingVertical: currentPackPaddingV,
                        borderRadius: currentPackRadius,
                        marginBottom: currentPackMarginBottom,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.currentPackText,
                        {fontSize: currentPackFontSize},
                      ]}>
                      Currently Active Pack
                    </Text>
                  </View>
                )}
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
                  {isPlaying && <Equalizer />}
                </View>
                <View style={styles.infoContainer}>
                  <View style={styles.packHeader}>
                    <Text
                      style={[styles.packName, {fontSize: packNameFontSize}]}>
                      {pack.name}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.packGenre,
                      {
                        fontSize: packGenreFontSize,
                        marginBottom: packGenreMarginBottom,
                      },
                    ]}>
                    {pack.genre}
                  </Text>
                  <View
                    style={[
                      styles.statsContainer,
                      {
                        marginTop: statsMarginTop,
                        marginBottom: statsMarginBottom,
                        paddingHorizontal: statsPaddingH,
                      },
                    ]}>
                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statLabel,
                          {fontSize: statLabelFontSize},
                        ]}>
                        Sounds
                      </Text>
                      <Text
                        style={[
                          styles.statValue,
                          {fontSize: statValueFontSize},
                        ]}>
                        {pack.sounds ? Object.keys(pack.sounds).length : 0}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statLabel,
                          {fontSize: statLabelFontSize},
                        ]}>
                        BPM
                      </Text>
                      <Text
                        style={[
                          styles.statValue,
                          {fontSize: statValueFontSize},
                        ]}>
                        {pack.bpm}
                      </Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text
                        style={[
                          styles.statLabel,
                          {fontSize: statLabelFontSize},
                        ]}>
                        {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
                      </Text>
                      <Text
                        style={[
                          styles.lockBadgeIcon,
                          {fontSize: lockBadgeIconFontSize},
                        ]}>
                        {isUnlocked ? '🔓' : '🔒'}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.playButtonContainer,
                      {
                        marginTop: playButtonMarginTop,
                        marginBottom: playButtonMarginBottom,
                      },
                    ]}>
                    <ControlsButton
                      variant="play"
                      isPlaying={isPlaying}
                      onPress={handlePlayStop}
                      size={playButtonSize}
                    />
                  </View>
                </View>
              </View>
              <View
                style={[
                  styles.bottomButtonContainer,
                  {
                    paddingBottom: bottomButtonPaddingBottom,
                    paddingHorizontal: bottomButtonPaddingH,
                  },
                ]}>
                {isUnlocked ? (
                  <TouchableOpacity
                    style={[
                      styles.selectButton,
                      {
                        paddingVertical: selectButtonPaddingV,
                        paddingHorizontal: selectButtonPaddingH,
                        borderRadius: selectButtonRadius,
                        minWidth: selectButtonMinWidth,
                      },
                    ]}
                    onPress={() => {
                      triggerPlatformHaptic('selection');
                      handleSelectPack();
                    }}>
                    <View style={styles.buttonContent}>
                      <Image
                        source={require('../assets/images/pack.png')}
                        style={[
                          styles.buttonIcon,
                          {width: buttonIconSize, height: buttonIconSize},
                        ]}
                      />
                      <Text
                        style={[
                          styles.selectButtonText,
                          {fontSize: selectButtonFontSize},
                        ]}>
                        {getSelectButtonText()}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.unlockContainer}>
                    <TouchableOpacity
                      style={[
                        ...getUnlockButtonStyle(),
                        {
                          paddingVertical: selectButtonPaddingV,
                          paddingHorizontal: selectButtonPaddingH,
                          borderRadius: selectButtonRadius,
                          minWidth: selectButtonMinWidth,
                        },
                      ]}
                      onPress={() => {
                        triggerPlatformHaptic('selection');
                        handleUnlockPack();
                      }}
                      disabled={isUnlockButtonDisabled()}>
                      <View style={styles.buttonContent}>
                        <Image
                          source={getUnlockButtonIcon()}
                          style={[
                            styles.buttonIcon,
                            {width: buttonIconSize, height: buttonIconSize},
                          ]}
                        />
                        <Text
                          style={[
                            styles.selectButtonText,
                            {fontSize: selectButtonFontSize},
                          ]}>
                          {getUnlockButtonText()}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {getStatusMessage() && (
                      <Text
                        style={[
                          styles.preparingText,
                          {fontSize: preparingTextFontSize},
                        ]}>
                        {getStatusMessage()}
                      </Text>
                    )}
                  </View>
                )}
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
  },
  scrollableContent: {
    flex: 1,
  },
  coverContainer: {
    alignItems: 'center',
    position: 'relative',
  },
  coverImage: {},
  currentPackIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignSelf: 'center',
  },
  currentPackText: {
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },

  infoContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  packHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  packName: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
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
    textAlign: 'center',
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    color: '#aaa',
    marginBottom: 4,
  },
  statValue: {
    color: '#fff',
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
  lockBadgeIcon: {},
  playButtonContainer: {
    alignItems: 'center',
  },
  bottomButtonContainer: {
    alignItems: 'center',
  },
  selectButton: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
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
    width: '100%',
  },
  preparingText: {
    color: '#aaa',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  selectButtonText: {
    color: '#000',
    fontWeight: '600',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonIcon: {},
  absoluteFill: {
    flex: 1,
  },
});

export default SoundPackDetailScreen;
