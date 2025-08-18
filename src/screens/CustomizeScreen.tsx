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
import {triggerPlatformHaptic} from '../utils/haptics';
import {getResponsiveSize} from '../utils/deviceUtils';

const CustomizeScreen: React.FC = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'Customize'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const {packId} = route.params;
  const [customPads, setCustomPads] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  const pack = soundPacks[packId];

  const containerPaddingTop = getResponsiveSize(20, 20);
  const containerPaddingBottom = getResponsiveSize(20, 10);
  const headerMarginBottom = getResponsiveSize(20, 20);
  const headerPaddingH = getResponsiveSize(20, 32);
  const headerTitleFontSize = getResponsiveSize(24, 36);
  const closeButtonPaddingH = getResponsiveSize(20, 32);
  const closeButtonPaddingV = getResponsiveSize(10, 16);
  const closeButtonRadius = getResponsiveSize(20, 28);
  const closeButtonFontSize = getResponsiveSize(16, 20);
  const instructionsPaddingH = getResponsiveSize(20, 32);
  const instructionsTextFontSize = getResponsiveSize(14, 18);
  const instructionsLargeMarginBottom = getResponsiveSize(30, 40);
  const instructionsSmallMarginBottom = getResponsiveSize(50, 70);
  const padItemBorderRadius = getResponsiveSize(10, 16);
  const padItemPadding = getResponsiveSize(8, 12);
  const iconSize = getResponsiveSize(32, 44);
  const iconMarginBottom = getResponsiveSize(4, 8);
  const padTitleFontSize = getResponsiveSize(11, 16);
  const positionIndicatorSize = getResponsiveSize(20, 28);
  const positionIndicatorRadius = getResponsiveSize(10, 14);
  const positionTextFontSize = getResponsiveSize(10, 14);
  const dragDotSize = getResponsiveSize(3, 4);
  const dragDotRadius = getResponsiveSize(1.5, 2);
  const dragDotMarginV = getResponsiveSize(0.5, 1);
  const footerMarginTop = getResponsiveSize(15, 25);
  const footerGap = getResponsiveSize(10, 15);
  const footerPaddingH = getResponsiveSize(20, 32);
  const resetButtonPaddingV = getResponsiveSize(12, 20);
  const resetButtonPaddingH = getResponsiveSize(20, 36);
  const resetButtonRadius = getResponsiveSize(20, 30);
  const resetButtonFontSize = getResponsiveSize(16, 22);
  const saveButtonPaddingV = getResponsiveSize(12, 20);
  const saveButtonPaddingH = getResponsiveSize(20, 36);
  const saveButtonRadius = getResponsiveSize(20, 30);
  const saveButtonFontSize = getResponsiveSize(16, 22);
  const channelIndicatorSize = getResponsiveSize(20, 28);
  const channelIndicatorRadius = getResponsiveSize(10, 14);
  const channelTextFontSize = getResponsiveSize(10, 14);
  const channelIndicatorMarginLeft = getResponsiveSize(5, 8);

  const loadCustomOrder = useCallback(async (): Promise<void> => {
    try {
      const savedOrder = await AsyncStorage.getItem(`custom_order_${packId}`);
      if (savedOrder) {
        setCustomPads(JSON.parse(savedOrder));
      } else {
        const configs = await getPadConfigs(packId);
        setCustomPads(configs);
      }
    } catch (error) {}
  }, [packId]);

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
      } catch (error) {}
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
        <View
          style={[
            styles.container,
            {
              paddingTop: containerPaddingTop,
              paddingBottom: containerPaddingBottom,
            },
          ]}>
          <View
            style={[
              styles.header,
              {
                marginBottom: headerMarginBottom,
                paddingHorizontal: headerPaddingH,
              },
            ]}>
            <Text style={[styles.headerTitle, {fontSize: headerTitleFontSize}]}>
              Customize {pack.name}
            </Text>
            <TouchableOpacity
              onPress={() => {
                triggerPlatformHaptic('selection');
                navigation.goBack();
              }}
              style={[
                styles.closeButton,
                {
                  paddingHorizontal: closeButtonPaddingH,
                  paddingVertical: closeButtonPaddingV,
                  borderRadius: closeButtonRadius,
                },
              ]}>
              <Text
                style={[
                  styles.closeButtonText,
                  {fontSize: closeButtonFontSize},
                ]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.instructions,
              {
                paddingHorizontal: instructionsPaddingH,
              },
              customPads.length === 24
                ? {marginBottom: instructionsLargeMarginBottom}
                : {marginBottom: instructionsSmallMarginBottom},
            ]}>
            <Text
              style={[
                styles.instructionsText,
                {fontSize: instructionsTextFontSize},
              ]}>
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
                        borderRadius: padItemBorderRadius,
                      },
                    ]}>
                    <View
                      style={[styles.padContent, {padding: padItemPadding}]}>
                      <View style={styles.padHeader}>
                        <View style={styles.badgeContainer}>
                          <View
                            style={[
                              styles.positionIndicator,
                              {
                                width: positionIndicatorSize,
                                height: positionIndicatorSize,
                                borderRadius: positionIndicatorRadius,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.positionText,
                                {fontSize: positionTextFontSize},
                              ]}>
                              {index + 1}
                            </Text>
                          </View>
                          {channel && (
                            <View
                              style={[
                                styles.channelIndicator,
                                {
                                  width: channelIndicatorSize,
                                  height: channelIndicatorSize,
                                  borderRadius: channelIndicatorRadius,
                                  marginLeft: channelIndicatorMarginLeft,
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.channelText,
                                  {fontSize: channelTextFontSize},
                                ]}>
                                {channel}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.dragHandle}>
                          <View
                            style={[
                              styles.dragDot,
                              {
                                width: dragDotSize,
                                height: dragDotSize,
                                borderRadius: dragDotRadius,
                                marginVertical: dragDotMarginV,
                              },
                            ]}
                          />
                          <View
                            style={[
                              styles.dragDot,
                              {
                                width: dragDotSize,
                                height: dragDotSize,
                                borderRadius: dragDotRadius,
                                marginVertical: dragDotMarginV,
                              },
                            ]}
                          />
                          <View
                            style={[
                              styles.dragDot,
                              {
                                width: dragDotSize,
                                height: dragDotSize,
                                borderRadius: dragDotRadius,
                                marginVertical: dragDotMarginV,
                              },
                            ]}
                          />
                        </View>
                      </View>

                      <View style={styles.padCenter}>
                        {IconComponent && (
                          <IconComponent
                            width={iconSize}
                            height={iconSize}
                            fill={brighterColor}
                            style={[
                              styles.icon,
                              {marginBottom: iconMarginBottom},
                            ]}
                          />
                        )}
                        <Text
                          style={[
                            styles.padTitle,
                            {
                              color: brighterColor,
                              fontSize: padTitleFontSize,
                            },
                          ]}
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
                        borderRadius: padItemBorderRadius,
                      },
                    ]}>
                    <View
                      style={[styles.padContent, {padding: padItemPadding}]}>
                      <View style={styles.padHeader}>
                        <View style={styles.badgeContainer}>
                          <View
                            style={[
                              styles.positionIndicator,
                              {
                                width: positionIndicatorSize,
                                height: positionIndicatorSize,
                                borderRadius: positionIndicatorRadius,
                              },
                            ]}>
                            <Text
                              style={[
                                styles.positionText,
                                {fontSize: positionTextFontSize},
                              ]}>
                              {index + 1}
                            </Text>
                          </View>
                          {channel && (
                            <View
                              style={[
                                styles.channelIndicator,
                                {
                                  width: channelIndicatorSize,
                                  height: channelIndicatorSize,
                                  borderRadius: channelIndicatorRadius,
                                  marginLeft: channelIndicatorMarginLeft,
                                },
                              ]}>
                              <Text
                                style={[
                                  styles.channelText,
                                  {fontSize: channelTextFontSize},
                                ]}>
                                {channel}
                              </Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.dragHandle}>
                          <View
                            style={[
                              styles.dragDot,
                              {
                                width: dragDotSize,
                                height: dragDotSize,
                                borderRadius: dragDotRadius,
                                marginVertical: dragDotMarginV,
                              },
                            ]}
                          />
                          <View
                            style={[
                              styles.dragDot,
                              {
                                width: dragDotSize,
                                height: dragDotSize,
                                borderRadius: dragDotRadius,
                                marginVertical: dragDotMarginV,
                              },
                            ]}
                          />
                          <View
                            style={[
                              styles.dragDot,
                              {
                                width: dragDotSize,
                                height: dragDotSize,
                                borderRadius: dragDotRadius,
                                marginVertical: dragDotMarginV,
                              },
                            ]}
                          />
                        </View>
                      </View>

                      <View style={styles.padCenter}>
                        {IconComponent && (
                          <IconComponent
                            width={iconSize}
                            height={iconSize}
                            fill={brighterColor}
                            style={[
                              styles.icon,
                              {marginBottom: iconMarginBottom},
                            ]}
                          />
                        )}
                        <Text
                          style={[
                            styles.padTitle,
                            {
                              color: brighterColor,
                              fontSize: padTitleFontSize,
                            },
                          ]}
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

          <View
            style={[
              styles.footer,
              {
                marginTop: footerMarginTop,
                gap: footerGap,
                paddingHorizontal: footerPaddingH,
              },
            ]}>
            <TouchableOpacity
              style={[
                styles.resetButton,
                {
                  paddingVertical: resetButtonPaddingV,
                  paddingHorizontal: resetButtonPaddingH,
                  borderRadius: resetButtonRadius,
                },
              ]}
              onPress={() => {
                triggerPlatformHaptic('selection');
                handleResetOrder();
              }}>
              <Text
                style={[
                  styles.resetButtonText,
                  {fontSize: resetButtonFontSize},
                ]}>
                Reset to Original
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  paddingVertical: saveButtonPaddingV,
                  paddingHorizontal: saveButtonPaddingH,
                  borderRadius: saveButtonRadius,
                },
                !hasChanges && styles.saveButtonDisabled,
              ]}
              onPress={() => {
                triggerPlatformHaptic('selection');
                handleSaveChanges();
              }}
              disabled={!hasChanges}>
              <Text style={[styles.saveButtonText, {fontSize: saveButtonFontSize}]}>
                Save Changes
              </Text>
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
    paddingHorizontal: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  instructions: {
  },
  instructionsText: {
    color: '#aaa',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  padItem: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 1,
  },
  padContent: {
    flex: 1,
    flexDirection: 'column',
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
  },
  padTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  positionIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dragHandle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragDot: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton: {
    backgroundColor: 'rgba(255, 107, 107, 0.8)',
    alignItems: 'center',
    flex: 1,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    alignItems: 'center',
    flex: 1,
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  channelIndicator: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  channelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  instructionsLarge: {
  },
  instructionsSmall: {
  },
});

export default CustomizeScreen;
