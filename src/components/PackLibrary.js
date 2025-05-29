import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  FlatList,
} from 'react-native';
import {SOUND_PACKS} from '../utils/soundUtils';
import AudioService from '../services/AudioService';

const SmallPlayStopButton = ({isPlaying, onPress}) => (
  <TouchableOpacity style={styles.smallPlayButton} onPress={onPress}>
    {isPlaying ? (
      <View style={styles.smallStopIcon} />
    ) : (
      <View style={styles.smallPlayIcon} />
    )}
  </TouchableOpacity>
);

const SoundPackModal = ({isVisible, onClose, onSelectPack}) => {
  const packs = Object.values(SOUND_PACKS);
  const [playingPackId, setPlayingPackId] = useState(null);

  const handleSelect = packId => {
    onSelectPack(packId);
    onClose();
  };

  const handlePlayStop = async packId => {
    if (playingPackId === packId) {
      setPlayingPackId(null);
      if (AudioService.stopDemo) {
        AudioService.stopDemo();
      }
    } else {
      if (AudioService.stopDemo) {
        AudioService.stopDemo();
      }
      setPlayingPackId(packId);
      await AudioService.playDemo(packId);
    }
  };

  const renderPackItem = ({item}) => (
    <TouchableOpacity
      style={styles.packItem}
      onPress={() => handleSelect(item.id)}>
      <Image source={item.image} style={styles.packImage} />
      <View style={styles.infoRow}>
        <View style={styles.infoTextContainer}>
          <Text style={styles.packName}>{item.name}</Text>
          <Text style={styles.packGenre}>{item.genre}</Text>
        </View>
        <SmallPlayStopButton
          isPlaying={playingPackId === item.id}
          onPress={e => {
            e.stopPropagation && e.stopPropagation();
            handlePlayStop(item.id);
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={isVisible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>All Packs</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={packs}
          renderItem={renderPackItem}
          keyExtractor={item => item.id}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
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
  smallPlayButton: {
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
  smallPlayIcon: {
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
  smallStopIcon: {
    width: 10,
    height: 10,
    backgroundColor: '#000',
    borderRadius: 2,
  },
});

export default SoundPackModal;
