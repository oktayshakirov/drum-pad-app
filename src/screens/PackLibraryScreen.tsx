import React, {useState, useCallback, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ImageBackground,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SOUND_PACKS} from '../utils/soundUtils';
import {soundPacks} from '../assets/sounds';
import AudioService from '../services/AudioService';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';
import Equalizer from '../components/Equalizer';
import ControlsButton from '../components/ControlsButton';
import {UnlockService} from '../services/UnlockService';
import {BlurView} from '@react-native-community/blur';

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
  activeTab: 'all' | 'my';
  setActiveTab: (tab: 'all' | 'my') => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = memo(
  ({onClose, activeTab, setActiveTab}) => (
    <View style={styles.header}>
      <View style={styles.tabContainer}>
        <TabButton
          title="All Packs"
          isActive={activeTab === 'all'}
          onPress={() => setActiveTab('all')}
        />
        <TabButton
          title="My Packs"
          isActive={activeTab === 'my'}
          onPress={() => setActiveTab('my')}
        />
      </View>
      <TouchableOpacity
        onPress={onClose}
        style={styles.closeButton}
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
        <Text style={styles.closeButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  ),
);

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = memo(
  ({title, isActive, onPress}) => (
    <TouchableOpacity
      style={[styles.tabButton, isActive && styles.activeTabButton]}
      onPress={onPress}>
      <Text
        style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
        {title}
      </Text>
    </TouchableOpacity>
  ),
);

const PackLibraryScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [playingPackId, setPlayingPackId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const packs = Object.values(SOUND_PACKS);
  const background = soundPacks.brabus;

  const filteredPacks =
    activeTab === 'all'
      ? packs
      : packs.filter(pack => UnlockService.isPackUnlocked(pack.id));

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
    <View style={styles.absoluteFill}>
      <ImageBackground
        source={background.cover}
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
          <ModalHeader
            onClose={handleClose}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <FlatList
            data={filteredPacks}
            renderItem={renderPackItem}
            keyExtractor={(item: any) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContainer}
          />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  closeButton: {
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  activeTabButton: {
    backgroundColor: '#666',
  },
  tabButtonText: {
    color: '#aaa',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#fff',
  },
});

export default memo(PackLibraryScreen);
