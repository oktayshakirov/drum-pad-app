import React from 'react';
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

const SoundPackModal = ({isVisible, onClose, onSelectPack}) => {
  const packs = Object.values(SOUND_PACKS);

  const handleSelect = packId => {
    onSelectPack(packId);
    onClose();
  };

  const renderPackItem = ({item}) => (
    <TouchableOpacity
      style={styles.packItem}
      onPress={() => handleSelect(item.id)}>
      <Image source={item.image} style={styles.packImage} />
      <Text style={styles.packName}>{item.name}</Text>
      <Text style={styles.packGenre}>{item.genre}</Text>
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
    flex: 1,
    margin: 10,
    alignItems: 'center',
  },
  packImage: {
    width: '100%',
    height: 160,
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
});

export default SoundPackModal;
