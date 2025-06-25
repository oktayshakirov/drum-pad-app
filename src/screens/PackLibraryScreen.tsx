import React, {useState, useCallback, memo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
  Animated,
} from 'react-native';
import {SOUND_PACKS} from '../utils/soundUtils';
import AudioService from '../services/AudioService';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../App';

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

interface PackItemProps {
  item: any;
  isPlaying: boolean;
  onSelect: (id: string) => void;
  onPlayStop: (id: string) => void;
}

const PackItem: React.FC<PackItemProps> = memo(
  ({item, isPlaying, onSelect, onPlayStop}) => (
    <TouchableOpacity style={styles.packItem} onPress={() => onSelect(item.id)}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.packImage} />
        {isPlaying && <Equalizer />}
      </View>
      <View style={styles.infoRow}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.packName}>{item.name}</Text>
          <Text style={styles.packGenre}>{item.genre}</Text>
        </View>
        <PlayStopButton
          isPlaying={isPlaying}
          onPress={() => {
            onPlayStop(item.id);
          }}
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
  playButton: {
    width: 30,
    height: 30,
    marginTop: 7,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 0},
  },
  playIcon: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderTopWidth: 5,
    borderBottomWidth: 5,
    borderLeftWidth: 9,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: '#000',
    marginLeft: 1,
  },
  stopIcon: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  equalizerContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  equalizerBar: {
    width: 3,
    height: 12,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
});

export default memo(PackLibraryScreen);
