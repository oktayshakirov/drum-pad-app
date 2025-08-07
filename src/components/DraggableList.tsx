import React, {useState, useCallback} from 'react';
import {StyleSheet, View, TouchableOpacity, Dimensions} from 'react-native';
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

const {width: screenWidth} = Dimensions.get('window');
const ITEM_MARGIN = 8;

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

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
      zIndex: zIndex.value,
    };
  });

  const panGesture = Gesture.Pan()
    .onUpdate(event => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      runOnJS(onHover)(index, event.translationY, event.translationX);
    })
    .onStart(() => {
      runOnJS(onDragStart)(index);
      zIndex.value = withTiming(1000);
      scale.value = withSpring(1.1);
    })
    .onEnd(() => {
      runOnJS(onDragEnd)(index);
      translateX.value = withTiming(0);
      translateY.value = withTiming(0);
      scale.value = withSpring(1);
      zIndex.value = withTiming(0);
    });

  return (
    <Animated.View
      style={[
        styles.draggableItem,
        {width: itemSize, height: itemSize},
        isDragging && styles.draggingItem,
        animatedStyle,
      ]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={styles.gestureContainer}>
          <TouchableOpacity
            style={styles.touchableContainer}
            activeOpacity={0.8}
            onLongPress={() => {
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

const DraggableList: React.FC<DraggableListProps> = ({
  data,
  renderItem,
  onReorder,
  keyExtractor,
  style,
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const numItems = data.length;
  const columns = numItems === 24 ? 4 : 3;
  const availableWidth = screenWidth - 42;
  const totalMarginWidth = (columns - 1) * ITEM_MARGIN;
  const itemSize = (availableWidth - totalMarginWidth) / columns;

  const handleDragStart = useCallback((index: number) => {
    setDraggingIndex(index);
    setHoveredIndex(null);
  }, []);

  const handleDragEnd = useCallback(
    (index: number) => {
      if (hoveredIndex !== null && hoveredIndex !== index) {
        onReorder(index, hoveredIndex);
      }
      setDraggingIndex(null);
      setHoveredIndex(null);
    },
    [hoveredIndex, onReorder],
  );

  const handleHover = useCallback(
    (index: number, translationY: number, translationX: number) => {
      if (draggingIndex === null) {
        return;
      }

      // Calculate the position of each item in the grid
      const itemPositions: {x: number; y: number}[] = [];
      for (let i = 0; i < data.length; i++) {
        const row = Math.floor(i / columns);
        const col = i % columns;
        const x = col * (itemSize + ITEM_MARGIN);
        const y = row * (itemSize + ITEM_MARGIN);
        itemPositions.push({x, y});
      }

      // Calculate the dragged item's current position
      const draggedItemPos = itemPositions[draggingIndex];
      const newX = draggedItemPos.x + translationX;
      const newY = draggedItemPos.y + translationY;

      // Find which item position is closest
      let closestIndex = draggingIndex;
      let minDistance = Infinity;

      for (let i = 0; i < data.length; i++) {
        const distance = Math.sqrt(
          Math.pow(newX - itemPositions[i].x, 2) +
            Math.pow(newY - itemPositions[i].y, 2),
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      }

      if (closestIndex !== hoveredIndex) {
        setHoveredIndex(closestIndex);
      }
    },
    [draggingIndex, hoveredIndex, data.length, columns, itemSize],
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
      <GestureHandlerRootView>
        <View
          style={[
            styles.gridContainer,
            {
              width: availableWidth,
              maxWidth: availableWidth,
            },
            styles.gridContainerCentered,
          ]}>
          {data.map((item, index) => renderGridItem(item, index))}
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
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  gridContainerCentered: {
    alignSelf: 'center',
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
});

export default DraggableList;
