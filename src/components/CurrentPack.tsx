import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import {useAppContext} from '../contexts/AppContext';
import {SOUND_PACKS} from '../utils/soundUtils';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import AudioService from '../services/AudioService';
import {triggerPlatformHaptic} from '../utils/haptics';

interface CurrentPackHeaderProps {
  onOpenPackLibrary?: () => void;
}

const CurrentPackHeader: React.FC<CurrentPackHeaderProps> = ({
  onOpenPackLibrary,
}) => {
  const {currentSoundPack} = useAppContext();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const activePack = SOUND_PACKS[currentSoundPack];

  if (!activePack) {
    return null;
  }

  const handleOpenModal = (): void => {
    triggerPlatformHaptic('selection');

    if (onOpenPackLibrary) {
      onOpenPackLibrary();
    }
  };

  const handlePackPress = async (): Promise<void> => {
    triggerPlatformHaptic('selection');

    await AudioService.stopMetronome();
    navigation.navigate('SoundPackDetail', {packId: currentSoundPack});
  };

  const blurType = Platform.OS === 'ios' ? 'ultraThinMaterialDark' : 'dark';

  return (
    <View style={styles.container}>
      <View style={styles.glassCard}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType={blurType}
          blurAmount={18}
          reducedTransparencyFallbackColor="#101418"
        />
        <View style={styles.glassTint} />
        <View style={styles.contentRow}>
          <TouchableOpacity
            style={styles.packInfoTouchable}
            onPress={handlePackPress}
            activeOpacity={0.8}>
            <Image source={activePack.image} style={styles.packImage} />
            <View style={styles.packInfo}>
              <Text style={styles.packName}>{activePack.name}</Text>
              <Text style={styles.packGenre}>{activePack.genre}</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.allPacksButton}
              onPress={handleOpenModal}>
              <Text style={styles.allPacksText}>ALL PACKS</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    width: '100%',
    marginTop: 15,
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
    width: '100%',
  },
  glassTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  packImage: {
    width: 100,
    height: 60,
    borderRadius: 12,
  },
  packInfo: {
    marginLeft: 12,
    flex: 1,
  },
  packName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  packGenre: {
    color: '#D9DEE4',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allPacksButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginLeft: 10,
  },
  allPacksText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 14,
  },
  packInfoTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});

export default CurrentPackHeader;
