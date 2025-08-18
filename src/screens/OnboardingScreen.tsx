import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {soundPacks} from '../assets/sounds';
import AudioService from '../services/AudioService';
import {useAppContext} from '../contexts/AppContext';
import {UnlockService} from '../services/UnlockService';
import {OnboardingService} from '../services/OnboardingService';
import {useContext} from 'react';
import {OnboardingContext} from '../../App';
import ControlsButton from '../components/ControlsButton';
import Equalizer from '../components/Equalizer';
import {ImageBackground} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';

const {width: screenWidth} = Dimensions.get('window');

interface PackCardProps {
  pack: any;
  packId: string;
  onSelect: (packId: string) => void;
  isSelected: boolean;
}

const PackCard: React.FC<PackCardProps> = ({
  pack,
  packId,
  onSelect,
  isSelected,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const packNameFontSize = getResponsiveSize(24, 32);
  const packGenreFontSize = getResponsiveSize(16, 22);
  const packBpmFontSize = getResponsiveSize(14, 18);
  const packCardPadding = getResponsiveSize(20, 28);
  const packCardMarginBottom = getResponsiveSize(20, 30);
  const packCardBorderRadius = getResponsiveSize(20, 28);
  const coverWidthMultiplier = getResponsiveSize(0.8, 0.7);
  const coverBorderRadius = getResponsiveSize(16, 24);
  const selectionIndicatorFontSize = getResponsiveSize(14, 18);

  const handlePlayStop = useCallback(
    async (event: any) => {
      event.stopPropagation();

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
          setIsPlaying(false);
        }
      }
    },
    [isPlaying, packId],
  );

  const handleCardPress = useCallback(() => {
    triggerPlatformHaptic('selection');
    onSelect(packId);
  }, [packId, onSelect]);

  return (
    <TouchableOpacity
      style={[
        styles.packCard,
        isSelected && styles.selectedPackCard,
        {
          padding: packCardPadding,
          marginBottom: packCardMarginBottom,
          borderRadius: packCardBorderRadius,
        },
      ]}
      onPress={handleCardPress}
      activeOpacity={0.8}>
      <View style={styles.coverContainer}>
        <Image
          source={pack.cover}
          style={[
            styles.coverImage,
            {
              width: screenWidth * coverWidthMultiplier,
              borderRadius: coverBorderRadius,
            },
          ]}
        />
        {isPlaying && <Equalizer />}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.packInfo}>
          <Text style={[styles.packName, {fontSize: packNameFontSize}]}>
            {pack.name}
          </Text>
          <Text style={[styles.packGenre, {fontSize: packGenreFontSize}]}>
            {pack.genre}
          </Text>
          <Text style={[styles.packBpm, {fontSize: packBpmFontSize}]}>
            {pack.bpm} BPM
          </Text>
        </View>

        <TouchableOpacity
          style={styles.demoButton}
          onPress={handlePlayStop}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <ControlsButton
            variant="play"
            isPlaying={isPlaying}
            onPress={handlePlayStop}
            size={getResponsiveSize(40, 56)}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.selectionIndicator}>
        <Text
          style={[
            styles.selectionIndicatorText,
            {fontSize: selectionIndicatorFontSize},
          ]}>
          {isSelected ? '✓ SELECTED' : 'TAP TO SELECT'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const OnboardingScreen: React.FC = () => {
  const {setCurrentSoundPack} = useAppContext();
  const {completeOnboarding} = useContext(OnboardingContext);
  const [availablePacks, setAvailablePacks] = useState<string[]>([]);
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const titleFontSize = getResponsiveSize(28, 36);
  const subtitleFontSize = getResponsiveSize(16, 20);
  const continueButtonFontSize = getResponsiveSize(18, 24);
  const headerPaddingTop = getResponsiveSize(40, 60);
  const headerPaddingBottom = getResponsiveSize(30, 45);
  const headerPaddingH = getResponsiveSize(20, 32);
  const continueButtonPaddingV = getResponsiveSize(16, 24);
  const continueButtonPaddingH = getResponsiveSize(30, 48);
  const continueButtonRadius = getResponsiveSize(25, 35);
  const scrollContentPaddingH = getResponsiveSize(20, 100);

  useEffect(() => {
    const loadAllPacks = async () => {
      try {
        await UnlockService.initialize();
        const allPackIds = Object.keys(soundPacks);
        setAvailablePacks(allPackIds);

        if (allPackIds.length > 0) {
          setSelectedPack(allPackIds[0]);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadAllPacks();
  }, []);

  const handlePackSelect = useCallback((packId: string) => {
    triggerPlatformHaptic('impactLight');
    setSelectedPack(packId);
  }, []);

  const handleContinue = useCallback(async () => {
    if (!selectedPack) {
      return;
    }

    try {
      triggerPlatformHaptic('notificationSuccess');

      await UnlockService.unlockPack(selectedPack);
      await setCurrentSoundPack(selectedPack);
      await OnboardingService.markOnboardingCompleted();

      completeOnboarding();
    } catch (error) {}
  }, [selectedPack, setCurrentSoundPack, completeOnboarding]);

  if (isLoading) {
    return (
      <View style={styles.absoluteFill}>
        <ImageBackground
          source={soundPacks.brabus.cover}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={70}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00D4FF" />
        </View>
      </View>
    );
  }

  if (availablePacks.length === 0) {
    return (
      <View style={styles.absoluteFill}>
        <ImageBackground
          source={soundPacks.brabus.cover}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={70}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No packs available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.absoluteFill}>
      <ImageBackground
        source={soundPacks.brabus.cover}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={70}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.header,
              {
                paddingTop: headerPaddingTop,
                paddingBottom: headerPaddingBottom,
                paddingHorizontal: headerPaddingH,
              },
            ]}>
            <Text
              style={[styles.title, {fontSize: titleFontSize}]}
              adjustsFontSizeToFit={Platform.OS === 'ios'}
              numberOfLines={2}
              minimumFontScale={0.9}>
              Welcome to Shape Beats!
            </Text>
            <Text style={[styles.subtitle, {fontSize: subtitleFontSize}]}>
              Choose your first sound pack to start creating beats and begin
              your musical journey
            </Text>
          </View>

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={[
              styles.scrollContent,
              {paddingHorizontal: scrollContentPaddingH},
            ]}
            showsVerticalScrollIndicator={false}>
            {availablePacks.map((packId: string) => {
              const pack = soundPacks[packId];
              if (!pack) {
                return null;
              }

              return (
                <PackCard
                  key={packId}
                  pack={pack}
                  packId={packId}
                  onSelect={handlePackSelect}
                  isSelected={selectedPack === packId}
                />
              );
            })}
          </ScrollView>

          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !selectedPack && styles.disabledButton,
                {
                  paddingVertical: continueButtonPaddingV,
                  paddingHorizontal: continueButtonPaddingH,
                  borderRadius: continueButtonRadius,
                },
              ]}
              onPress={handleContinue}
              disabled={!selectedPack}>
              <Text
                style={[
                  styles.continueButtonText,
                  {fontSize: continueButtonFontSize},
                ]}>
                START MAKING BEATS!
              </Text>
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
    backgroundColor: 'transparent',
  },
  modalContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: Platform.OS === 'ios' ? undefined : 36,
  },
  subtitle: {
    color: '#D9DEE4',
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
  },
  packCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedPackCard: {
    borderColor: '#00D4FF',
    backgroundColor: 'hsla(193, 100%, 50%, 0.10)',
  },
  coverContainer: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  coverImage: {
    height: (screenWidth * 0.8 * 9) / 16,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  packInfo: {
    flex: 1,
    alignItems: 'flex-start',
  },
  packName: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 8,
  },
  packGenre: {
    color: '#D9DEE4',
    textAlign: 'left',
    marginBottom: 4,
  },
  packBpm: {
    color: '#aaa',
    textAlign: 'left',
  },

  demoButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  continueButton: {
    backgroundColor: '#00B8E6',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  continueButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  selectionIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectionIndicatorText: {
    color: '#D9DEE4',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default OnboardingScreen;
