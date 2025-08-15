import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../../App';
import {StackNavigationProp} from '@react-navigation/stack';
import {BlurView} from '@react-native-community/blur';
import {soundPacks} from '../assets/sounds';
import {getPadConfigs, getPadConfigsSync} from '../utils/soundUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {iconMap} from '../assets/sounds/icons';
import DraggableListIOS from '../components/DraggableListIOS';
import DraggableListAndroid from '../components/DraggableListAndroid';
import {brightenColor} from '../utils/colorUtils';
import {trigger} from 'react-native-haptic-feedback';

const CustomizeScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Customize'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {packId} = route.params;
  const [customPads, setCustomPads] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const pack = soundPacks[packId];
  const originalPads = getPadConfigsSync(packId);

  const loadCustomOrder = useCallback(async (): Promise<void> => {
    try {
      const savedOrder = await AsyncStorage.getItem(`custom_order_${packId}`);
      if (savedOrder) {
        setCustomPads(JSON.parse(savedOrder));
      } else {
        const configs = await getPadConfigs(packId);
        setCustomPads(configs);
      }
    } catch (error) {
      setCustomPads(originalPads);
    }
  }, [packId, originalPads]);

  useEffect(() => {
    loadCustomOrder();
  }, [loadCustomOrder]);

  const saveCustomOrder = useCallback(
    async (newOrder: any[]): Promise<void> => {
      try {
        await AsyncStorage.setItem(
          `custom_order_${packId}`,
          JSON.stringify(newOrder),
        );
        setHasChanges(false);
      } catch (error) {
        // Silent error handling
      }
    },
    [packId],
  );

  const handleSaveChanges = (): void => {
    saveCustomOrder(customPads);
    Alert.alert('Success', 'Changes saved successfully!');
  };

  const handleReorder = useCallback(
    (fromIndex: number, toIndex: number) => {
      const newOrder = [...customPads];
      const [movedItem] = newOrder.splice(fromIndex, 1);
      newOrder.splice(toIndex, 0, movedItem);
      setCustomPads(newOrder);
      setHasChanges(true);
    },
    [customPads],
  );

  const handleResetOrder = (): void => {
    Alert.alert(
      'Reset Order',
      'Are you sure you want to reset to the original order?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const configs = getPadConfigsSync(packId);
            setCustomPads(configs);
            await AsyncStorage.removeItem(`custom_order_${packId}`);
            setHasChanges(false);
          },
        },
      ],
    );
  };

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
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Customize {pack.name}</Text>
            <TouchableOpacity
              onPress={() => {
                if (Platform.OS === 'ios') {
                  trigger('selection');
                } else {
                  trigger('soft');
                }
                navigation.goBack();
              }}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.instructions,
              customPads.length === 24
                ? styles.instructionsLarge
                : styles.instructionsSmall,
            ]}>
            <Text style={styles.instructionsText}>
              Drag and drop to reorder sounds
            </Text>
          </View>

          {Platform.OS === 'android' ? (
            <DraggableListAndroid
              data={customPads}
              renderItem={(item, index) => {
                const IconComponent = iconMap[item.icon];
                const isLargePack = customPads.length === 24;
                const channel = isLargePack ? (index < 12 ? 'A' : 'B') : null;
                const brighterColor = brightenColor(item.color, 0.9);

                return (
                  <View
                    style={[
                      styles.padItem,
                      {
                        backgroundColor: item.color,
                      },
                    ]}>
                    <View style={styles.padContent}>
                      <View style={styles.padHeader}>
                        <View style={styles.badgeContainer}>
                          <View style={styles.positionIndicator}>
                            <Text style={styles.positionText}>{index + 1}</Text>
                          </View>
                          {channel && (
                            <View style={styles.channelIndicator}>
                              <Text style={styles.channelText}>{channel}</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.dragHandle}>
                          <View style={styles.dragDot} />
                          <View style={styles.dragDot} />
                          <View style={styles.dragDot} />
                        </View>
                      </View>

                      <View style={styles.padCenter}>
                        {IconComponent && (
                          <IconComponent
                            width={32}
                            height={32}
                            fill={brighterColor}
                            style={styles.icon}
                          />
                        )}
                        <Text
                          style={[styles.padTitle, {color: brighterColor}]}
                          numberOfLines={2}>
                          {item.title}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              onReorder={handleReorder}
              keyExtractor={item => item.id}
              style={styles.content}
            />
          ) : (
            <DraggableListIOS
              data={customPads}
              renderItem={(item, index) => {
                const IconComponent = iconMap[item.icon];
                const isLargePack = customPads.length === 24;
                const channel = isLargePack ? (index < 12 ? 'A' : 'B') : null;
                const brighterColor = brightenColor(item.color, 0.9);

                return (
                  <View
                    style={[
                      styles.padItem,
                      {
                        backgroundColor: item.color,
                      },
                    ]}>
                    <View style={styles.padContent}>
                      <View style={styles.padHeader}>
                        <View style={styles.badgeContainer}>
                          <View style={styles.positionIndicator}>
                            <Text style={styles.positionText}>{index + 1}</Text>
                          </View>
                          {channel && (
                            <View style={styles.channelIndicator}>
                              <Text style={styles.channelText}>{channel}</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.dragHandle}>
                          <View style={styles.dragDot} />
                          <View style={styles.dragDot} />
                          <View style={styles.dragDot} />
                        </View>
                      </View>

                      <View style={styles.padCenter}>
                        {IconComponent && (
                          <IconComponent
                            width={32}
                            height={32}
                            fill={brighterColor}
                            style={styles.icon}
                          />
                        )}
                        <Text
                          style={[styles.padTitle, {color: brighterColor}]}
                          numberOfLines={2}>
                          {item.title}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              }}
              onReorder={handleReorder}
              keyExtractor={item => item.id}
              style={styles.content}
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  trigger('selection');
                } else {
                  trigger('soft');
                }
                handleResetOrder();
              }}>
              <Text style={styles.resetButtonText}>Reset to Original</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !hasChanges && styles.saveButtonDisabled,
              ]}
              onPress={() => {
                if (Platform.OS === 'ios') {
                  trigger('selection');
                } else {
                  trigger('soft');
                }
                handleSaveChanges();
              }}
              disabled={!hasChanges}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
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
  },
  container: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 0, // Remove horizontal padding to let draggable list handle it
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  instructions: {
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  padItem: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
  },
  padContent: {
    flex: 1,
    flexDirection: 'column',
    padding: 8,
  },
  padHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  padCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 4,
  },
  padTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  positionIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dragHandle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginVertical: 0.5,
  },
  footer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    paddingHorizontal: 20,
  },
  resetButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
    flex: 1,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
  },
  channelText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  instructionsLarge: {
    marginBottom: 30,
  },
  instructionsSmall: {
    marginBottom: 50,
  },
});

export default CustomizeScreen;
