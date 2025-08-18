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
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';

interface PackItemProps {
  item: any;
  isPlaying: boolean;
  onSelect: (id: string) => void;
  onPlayStop: (id: string) => void;
  isLocked: boolean;
}

const PackItem: React.FC<PackItemProps> = memo(
  ({item, isPlaying, onSelect, onPlayStop, isLocked}) => {
    const packItemWidth = getResponsiveSize(170, 280);
    const packItemMargin = getResponsiveSize(10, 20);
    const packItemMarginTop = getResponsiveSize(20, 25);
    const packImageHeight = getResponsiveSize(90, 150);
    const packImageBorderRadius = getResponsiveSize(15, 25);
    const packNameFontSize = getResponsiveSize(16, 24);
    const packGenreFontSize = getResponsiveSize(14, 20);
    const packNameMarginTop = getResponsiveSize(8, 16);
    const infoRowMarginTop = getResponsiveSize(8, 16);
    const lockIconSize = getResponsiveSize(18, 28);
    const lockIconPadding = getResponsiveSize(4, 8);
    const lockIconBorderRadius = getResponsiveSize(10, 16);
    const playButtonSize = getResponsiveSize(30, 50);

    return (
      <TouchableOpacity
        style={[
          styles.packItem,
          {
            width: packItemWidth,
            margin: packItemMargin,
            marginTop: packItemMarginTop,
          },
        ]}
        onPress={() => {
          triggerPlatformHaptic('selection');
          onSelect(item.id);
        }}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={[
              styles.packImage,
              {
                width: packItemWidth,
                height: packImageHeight,
                borderRadius: packImageBorderRadius,
              },
            ]}
          />
          {isPlaying && <Equalizer />}
          {isLocked && (
            <View
              style={[
                styles.lockIconContainer,
                {
                  padding: lockIconPadding,
                  borderRadius: lockIconBorderRadius,
                },
              ]}>
              <Text
                style={[
                  styles.lockIcon,
                  {
                    fontSize: lockIconSize,
                  },
                ]}>
                🔒
              </Text>
            </View>
          )}
        </View>
        <View
          style={[
            styles.infoRow,
            {
              marginTop: infoRowMarginTop,
            },
          ]}>
          <View style={styles.infoTextContainer}>
            <Text
              style={[
                styles.packName,
                {
                  fontSize: packNameFontSize,
                  marginTop: packNameMarginTop,
                },
              ]}>
              {item.name}
            </Text>
            <Text
              style={[
                styles.packGenre,
                {
                  fontSize: packGenreFontSize,
                },
              ]}>
              {item.genre}
            </Text>
          </View>
          <ControlsButton
            variant="play"
            isPlaying={isPlaying}
            onPress={() => {
              triggerPlatformHaptic('selection');
              onPlayStop(item.id);
            }}
            size={playButtonSize}
          />
        </View>
      </TouchableOpacity>
    );
  },
);

interface ModalHeaderProps {
  onClose: () => void;
  activeTab: 'all' | 'my';
  setActiveTab: (tab: 'all' | 'my') => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = memo(
  ({onClose, activeTab, setActiveTab}) => {
    const headerPadding = getResponsiveSize(15, 20);
    const closeButtonPadding = getResponsiveSize(5, 12);
    const closeButtonFontSize = getResponsiveSize(24, 40);

    return (
      <View
        style={[
          styles.header,
          {
            padding: headerPadding,
          },
        ]}>
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
          style={[
            styles.closeButton,
            {
              padding: closeButtonPadding,
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
  },
);

interface TabButtonProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = memo(
  ({title, isActive, onPress}) => {
    const tabButtonPaddingH = getResponsiveSize(20, 36);
    const tabButtonPaddingV = getResponsiveSize(8, 16);
    const tabButtonMarginH = getResponsiveSize(5, 12);
    const tabButtonBorderRadius = getResponsiveSize(20, 30);
    const tabButtonFontSize = getResponsiveSize(16, 22);

    return (
      <TouchableOpacity
        style={[
          styles.tabButton,
          {
            paddingHorizontal: tabButtonPaddingH,
            paddingVertical: tabButtonPaddingV,
            marginHorizontal: tabButtonMarginH,
            borderRadius: tabButtonBorderRadius,
          },
          isActive && styles.activeTabButton,
        ]}
        onPress={() => {
          triggerPlatformHaptic('selection');
          onPress();
        }}>
        <Text
          style={[
            styles.tabButtonText,
            {
              fontSize: tabButtonFontSize,
            },
            isActive && styles.activeTabButtonText,
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  },
);

const PackLibraryScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [playingPackId, setPlayingPackId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');
  const packs = Object.values(SOUND_PACKS);
  const background = soundPacks.brabus;

  const modalMaxWidth = getResponsiveSize(400, 800);
  const listContainerPaddingH = getResponsiveSize(10, 30);

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
        <View
          style={[
            styles.modalContainer,
            {
              maxWidth: modalMaxWidth,
            },
          ]}>
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
            contentContainerStyle={[
              styles.listContainer,
              {
                paddingHorizontal: listContainerPaddingH,
              },
            ]}
            showsVerticalScrollIndicator={false}
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
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packItem: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  imageContainer: {
    position: 'relative',
  },
  packImage: {
    borderRadius: 15,
  },
  packName: {
    color: '#fff',
    fontWeight: '600',
  },
  packGenre: {
    color: '#aaa',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoTextContainer: {
    flex: 1,
  },
  lockIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#1a1a1a',
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
    backgroundColor: '#333',
  },
  activeTabButton: {
    backgroundColor: '#666',
  },
  tabButtonText: {
    color: '#aaa',
    fontWeight: '600',
  },
  activeTabButtonText: {
    color: '#fff',
  },
});

export default memo(PackLibraryScreen);
