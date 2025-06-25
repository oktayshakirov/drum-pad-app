import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useAppContext} from '../contexts/AppContext';
import {SOUND_PACKS} from '../utils/soundUtils';

interface CurrentPackHeaderProps {
  onOpenPackLibrary?: () => void;
}

const CurrentPackHeader: React.FC<CurrentPackHeaderProps> = ({
  onOpenPackLibrary,
}) => {
  const {currentSoundPack} = useAppContext();
  const activePack = SOUND_PACKS[currentSoundPack];

  if (!activePack) {
    return null;
  }

  const handleOpenModal = (): void => {
    if (onOpenPackLibrary) {
      onOpenPackLibrary();
    }
  };

  return (
    <View style={styles.container}>
      <Image source={activePack.image} style={styles.packImage} />
      <View style={styles.packInfo}>
        <Text style={styles.packName}>{activePack.name}</Text>
        <Text style={styles.packGenre}>{activePack.genre}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.allPacksButton}
          onPress={handleOpenModal}>
          <Text style={styles.allPacksText}>ALL PACKS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
    color: '#8c8c8c',
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  allPacksButton: {
    backgroundColor: '#FFD700',
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
});

export default CurrentPackHeader;
