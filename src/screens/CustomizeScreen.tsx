import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
  ScrollView,
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

const CustomizeScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Customize'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {packId} = route.params;
  const [customPads, setCustomPads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
      console.error('Error loading custom order:', error);
      setCustomPads(originalPads);
    } finally {
      setIsLoading(false);
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
        console.error('Error saving custom order:', error);
      }
    },
    [packId],
  );

  const handleSaveChanges = (): void => {
    saveCustomOrder(customPads);
    Alert.alert('Success', 'Changes saved successfully!');
  };

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
            const configs = await getPadConfigs(packId);
            setCustomPads(configs);
            await AsyncStorage.removeItem(`custom_order_${packId}`);
            setHasChanges(false);
          },
        },
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
              onPress={() => navigation.goBack()}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Sound order customization coming soon!
            </Text>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}>
            {customPads.map((item, index) => {
              const IconComponent = iconMap[item.icon];

              return (
                <View
                  key={item.id}
                  style={[
                    styles.padItem,
                    {
                      backgroundColor: item.color,
                    },
                  ]}>
                  <View style={styles.padContent}>
                    {IconComponent && (
                      <IconComponent
                        width={24}
                        height={24}
                        fill="#000"
                        style={styles.icon}
                      />
                    )}
                    <Text style={styles.padTitle}>{item.title}</Text>
                    <View style={styles.positionIndicator}>
                      <Text style={styles.positionText}>{index + 1}</Text>
                    </View>
                    <View style={styles.dragHandle}>
                      <View style={styles.dragDot} />
                      <View style={styles.dragDot} />
                      <View style={styles.dragDot} />
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetOrder}>
              <Text style={styles.resetButtonText}>Reset to Original</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                !hasChanges && styles.saveButtonDisabled,
              ]}
              onPress={handleSaveChanges}
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
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
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
    marginBottom: 20,
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
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    height: 80,
  },
  padContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    gap: 12,
  },
  icon: {
    marginRight: 8,
  },
  padTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  positionIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dragHandle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  dragDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginVertical: 1,
  },
  footer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CustomizeScreen;
