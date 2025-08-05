import React, {useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SOUND_PACKS} from '../utils/soundUtils';
import AudioService from '../services/AudioService';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import Equalizer from '../components/Equalizer';
import ControlsButton from '../components/ControlsButton';
import {UnlockService} from '../services/UnlockService';

interface PackItemProps {
  item: any;
  isPlaying: boolean;
  onSelect: (id: string) => void;
  onPlayStop: (id: string) => void;
  isLocked: boolean;
}

const PackItem: React.FC<PackItemProps> = memo(
  ({item, isPlaying, onSelect, onPlayStop, isLocked}) => (
    <TouchableOpacity style={styles.packItem} onPress={() => onSelect(item.id)}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.packImage} />
        {isPlaying && <Equalizer />}
        {isLocked && (
          <View style={styles.lockIconContainer}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.packName}>{item.name}</Text>
          <Text style={styles.packGenre}>{item.genre}</Text>
        </View>
        <ControlsButton
          variant="play"
          isPlaying={isPlaying}
          onPress={() => {
            onPlayStop(item.id);
          }}
          size={30}
        />
      </View>
    </TouchableOpacity>
  ),
);

interface ModalHeaderProps {
  onClose: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = memo(({onClose}) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>All Packs</Text>
    <TouchableOpacity
      onPress={onClose}
      style={styles.closeButton}
      hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
      <Text style={styles.closeButtonText}>X</Text>
    </TouchableOpacity>
  </View>
));

const PackLibraryScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [playingPackId, setPlayingPackId] = useState<string | null>(null);
  const packs = Object.values(SOUND_PACKS);

  const cleanupDemo = useCallback(async (): Promise<void> => {
    if (playingPackId) {
      setPlayingPackId(null);
      await AudioService.stopDemo();
    }
  }, [playingPackId]);

  const handleClose = useCallback(async (): Promise<void> => {
    await cleanupDemo();
    navigation.goBack();
  }, [cleanupDemo, navigation]);

  const handleSelect = useCallback(
    async (packId: string): Promise<void> => {
      await cleanupDemo();
      navigation.navigate('SoundPackDetail', {packId});
    },
    [cleanupDemo, navigation],
  );

  const handlePlayStop = useCallback(
    async (packId: string): Promise<void> => {
      if (playingPackId === packId) {
        setPlayingPackId(null);
        await AudioService.stopDemo();
      } else {
        setPlayingPackId(packId);
        try {
          const playPromise = await AudioService.playDemo(packId);
          if (playPromise) {
            await playPromise;
            setPlayingPackId(null);
          } else {
            setPlayingPackId(null);
          }
        } catch (error) {
          setPlayingPackId(null);
        }
      }
    },
    [playingPackId],
  );

  const renderPackItem = useCallback(
    ({item}: {item: any}) => (
      <PackItem
        item={item}
        isPlaying={playingPackId === item.id}
        onSelect={handleSelect}
        onPlayStop={handlePlayStop}
        isLocked={!UnlockService.isPackUnlocked(item.id)}
      />
    ),
    [playingPackId, handleSelect, handlePlayStop],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.modalContainer}>
        <ModalHeader onClose={handleClose} />
        <FlatList
          data={packs}
          renderItem={renderPackItem}
          keyExtractor={(item: any) => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    position: 'relative',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  packItem: {
    width: 170,
    margin: 10,
    alignItems: 'flex-start',
    flexDirection: 'column',
    marginTop: 20,
  },
  imageContainer: {
    position: 'relative',
  },
  packImage: {
    width: 170,
    height: 90,
    borderRadius: 15,
  },
  packName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  packGenre: {
    color: '#aaa',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  infoTextContainer: {
    flex: 1,
  },
  lockIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 4,
  },
  lockIcon: {
    fontSize: 18,
  },
});

export default memo(PackLibraryScreen);
