import React, {useState, useCallback, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {getResponsiveSize} from '../utils/deviceUtils';

const ITEM_MARGIN = 6;

interface DraggableItemProps {
  item: any;
  index: number;
  isDragging: boolean;
  onDragStart: (index: number) => void;
  onDragEnd: (index: number) => void;
  onHover: (index: number, translationY: number, translationX: number) => void;
  renderItem: (item: any, index: number) => React.ReactElement;
  itemSize: number;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  isDragging,
  onDragStart,
  onDragEnd,
  onHover,
  renderItem,
  itemSize,
}) => {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(0);
  const isActive = useSharedValue(false);

  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
      zIndex: zIndex.value,
      elevation: Platform.OS === 'android' ? zIndex.value : 0,
    };
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      'worklet';
      if (isActive.value) {
        translateX.value = event.translationX;
        translateY.value = event.translationY;
        runOnJS(onHover)(index, event.translationY, event.translationX);
      }
    })
    .onStart(() => {
      'worklet';
      isActive.value = true;
      runOnJS(onDragStart)(index);
      zIndex.value = 1000;
      scale.value = withSpring(1.1, {
        damping: Platform.OS === 'android' ? 20 : 15,
        stiffness: Platform.OS === 'android' ? 200 : 150,
      });
    })
    .onEnd(() => {
      'worklet';
      isActive.value = false;
      runOnJS(onDragEnd)(index);
      translateX.value = withTiming(0, {
        duration: Platform.OS === 'android' ? 200 : 150,
      });
      translateY.value = withTiming(0, {
        duration: Platform.OS === 'android' ? 200 : 150,
      });
      scale.value = withSpring(1, {
        damping: Platform.OS === 'android' ? 20 : 15,
      });
      zIndex.value = 0;
    })
    .onTouchesDown(() => {
      'worklet';
    })
    .onTouchesCancelled(() => {
      'worklet';
      isActive.value = false;
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      scale.value = withSpring(1);
      zIndex.value = 0;
    })
    .minDistance(Platform.OS === 'android' ? 8 : 2)
    .maxPointers(1);

  return (
    <Animated.View
      style={[
        styles.draggableItem,
        {width: itemSize, height: itemSize},
        isDragging && styles.draggingItem,
        animatedStyle,
      ]}
      renderToHardwareTextureAndroid={Platform.OS === 'android'}
      needsOffscreenAlphaCompositing={Platform.OS === 'android'}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.gestureContainer}>
          <TouchableOpacity
            style={styles.touchableContainer}
            activeOpacity={0.8}
            disabled={isDragging}
            onLongPress={() => {
              if (Platform.OS === 'android') {
                return;
              }
              onDragStart(index);
            }}>
            {renderItem(item, index)}
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

interface DraggableListProps {
  data: any[];
  renderItem: (item: any, index: number) => React.ReactElement;
  onReorder: (fromIndex: number, toIndex: number) => void;
  keyExtractor: (item: any, index: number) => string;
  style?: any;
}

const DraggableListIOS: React.FC<DraggableListProps> = ({
  data,
  renderItem,
  onReorder,
  keyExtractor,
  style,
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [screenDimensions, setScreenDimensions] = useState(() =>
    Dimensions.get('window'),
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const numItems = data.length;

  const columns = numItems === 24 ? 4 : 3;

  const horizontalPadding = getResponsiveSize(20, 140);
  const availableWidth = screenDimensions.width - horizontalPadding;

  let itemSize;
  if (numItems === 24) {
    const totalMarginWidth = (4 - 1) * ITEM_MARGIN;
    const baseItemSize = Math.floor((availableWidth - totalMarginWidth) / 4);
    itemSize = getResponsiveSize(baseItemSize, Math.floor(baseItemSize * 0.8));
  } else {
    const totalMarginWidth = (3 - 1) * ITEM_MARGIN;
    const baseItemSize = Math.floor((availableWidth - totalMarginWidth) / 3);
    itemSize = getResponsiveSize(baseItemSize, Math.floor(baseItemSize * 0.8));
  }

  const handleDragStart = useCallback((index: number) => {
    setDraggingIndex(index);
    setHoveredIndex(null);
  }, []);

  const handleDragEnd = useCallback(
    (index: number) => {
      try {
        if (
          hoveredIndex !== null &&
          hoveredIndex !== index &&
          hoveredIndex >= 0 &&
          hoveredIndex < data.length &&
          index >= 0 &&
          index < data.length
        ) {
          onReorder(index, hoveredIndex);
        }
      } catch (error) {
        console.warn('DraggableList reorder error:', error);
      } finally {
        setDraggingIndex(null);
        setHoveredIndex(null);
      }
    },
    [hoveredIndex, onReorder, data.length],
  );

  const handleHover = useCallback(
    (index: number, translationY: number, translationX: number) => {
      try {
        if (draggingIndex === null || !data || data.length === 0) {
          return;
        }

        const itemPositions: {x: number; y: number}[] = [];
        for (let i = 0; i < data.length; i++) {
          const row = Math.floor(i / columns);
          const col = i % columns;
          const x = col * (itemSize + ITEM_MARGIN);
          const y = row * (itemSize + ITEM_MARGIN);
          itemPositions.push({x, y});
        }

        const draggedItemPos = itemPositions[draggingIndex];
        if (!draggedItemPos) {
          return;
        }

        const newX = draggedItemPos.x + translationX;
        const newY = draggedItemPos.y + translationY;

        let closestIndex = draggingIndex;
        let minDistance = Infinity;
        const threshold =
          Platform.OS === 'android' ? itemSize * 0.4 : itemSize * 0.2;

        for (let i = 0; i < data.length; i++) {
          const distance = Math.sqrt(
            Math.pow(newX - itemPositions[i].x, 2) +
              Math.pow(newY - itemPositions[i].y, 2),
          );
          if (distance < minDistance && distance < threshold) {
            minDistance = distance;
            closestIndex = i;
          }
        }

        if (
          closestIndex !== hoveredIndex &&
          closestIndex >= 0 &&
          closestIndex < data.length
        ) {
          setHoveredIndex(closestIndex);
        }
      } catch (error) {}
    },
    [draggingIndex, hoveredIndex, data, columns, itemSize],
  );

  const renderGridItem = (item: any, index: number) => {
    const col = index % columns;

    return (
      <View
        key={keyExtractor(item, index)}
        style={[
          {
            width: itemSize,
            height: itemSize,
          },
          col < columns - 1 ? styles.gridItemWithMargin : null,
          styles.gridItemWithBottomMargin,
        ]}>
        <DraggableItem
          item={item}
          index={index}
          isDragging={draggingIndex === index}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onHover={handleHover}
          renderItem={renderItem}
          itemSize={itemSize}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      <GestureHandlerRootView style={styles.gestureRootView}>
        <View
          style={[
            styles.gridContainer,
            {
              width: screenDimensions.width,
              paddingHorizontal: horizontalPadding / 2,
            },
          ]}>
          {data &&
            data.length > 0 &&
            data.map((item, index) =>
              item ? renderGridItem(item, index) : null,
            )}
        </View>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridItemWithMargin: {
    marginRight: ITEM_MARGIN,
  },
  gridItemWithBottomMargin: {
    marginBottom: ITEM_MARGIN,
  },
  draggableItem: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  draggingItem: {
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    zIndex: 1000,
  },
  gestureContainer: {
    flex: 1,
  },
  touchableContainer: {
    flex: 1,
  },
  gestureRootView: {
    flex: 1,
  },
});

export default DraggableListIOS;
