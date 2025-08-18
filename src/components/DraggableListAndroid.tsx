import React, {useState, useCallback, useRef, useEffect} from 'react';
import {StyleSheet, View, Dimensions, PanResponder} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
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

const DraggableItemAndroid: React.FC<DraggableItemProps> = ({
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
  const lastHoverUpdate = useRef(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {scale: scale.value},
      ],
      zIndex: isDragging ? 1000 : 1,
      elevation: isDragging ? 10 : 2,
    };
  }, [isDragging]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > 8 || Math.abs(gestureState.dy) > 8;
    },
    onPanResponderGrant: () => {
      onDragStart(index);
      scale.value = withSpring(1.05, {
        damping: 20,
        stiffness: 200,
      });
    },
    onPanResponderMove: (_, gestureState) => {
      translateX.value = gestureState.dx;
      translateY.value = gestureState.dy;

      const now = Date.now();
      if (now - lastHoverUpdate.current > 100) {
        lastHoverUpdate.current = now;
        onHover(index, gestureState.dy, gestureState.dx);
      }
    },
    onPanResponderRelease: () => {
      onDragEnd(index);
      translateX.value = withTiming(0, {duration: 250});
      translateY.value = withTiming(0, {duration: 250});
      scale.value = withSpring(1, {
        damping: 20,
        stiffness: 200,
      });
    },
    onPanResponderTerminate: () => {
      onDragEnd(index);
      translateX.value = withTiming(0, {duration: 200});
      translateY.value = withTiming(0, {duration: 200});
      scale.value = withSpring(1);
    },
  });

  return (
    <Animated.View
      style={[
        styles.draggableItem,
        {width: itemSize, height: itemSize},
        isDragging && styles.draggingItem,
        animatedStyle,
      ]}
      renderToHardwareTextureAndroid={true}
      {...panResponder.panHandlers}>
      <View style={styles.gestureContainer}>{renderItem(item, index)}</View>
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

const DraggableListAndroid: React.FC<DraggableListProps> = ({
  data,
  renderItem,
  onReorder,
  keyExtractor,
  style,
}) => {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const hoveredIndexRef = useRef<number | null>(null);
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
    hoveredIndexRef.current = null;
  }, []);

  const handleDragEnd = useCallback(
    (index: number) => {
      try {
        const finalHoveredIndex = hoveredIndexRef.current;
        if (
          finalHoveredIndex !== null &&
          finalHoveredIndex !== index &&
          finalHoveredIndex >= 0 &&
          finalHoveredIndex < data.length &&
          index >= 0 &&
          index < data.length
        ) {
          onReorder(index, finalHoveredIndex);
        }
      } catch (error) {
        console.warn('DraggableList reorder error:', error);
      } finally {
        setDraggingIndex(null);
        hoveredIndexRef.current = null;
      }
    },
    [onReorder, data.length],
  );

  const handleHover = useCallback(
    (index: number, translationY: number, translationX: number) => {
      if (draggingIndex === null || !data || data.length === 0) {
        return;
      }

      try {
        const threshold = itemSize * 0.4;
        if (
          Math.abs(translationX) < threshold &&
          Math.abs(translationY) < threshold
        ) {
          return;
        }

        const draggedRow = Math.floor(draggingIndex / columns);
        const draggedCol = draggingIndex % columns;

        const itemWidth = itemSize + ITEM_MARGIN;
        const itemHeight = itemSize + ITEM_MARGIN;

        const deltaCol = Math.round(translationX / itemWidth);
        const deltaRow = Math.round(translationY / itemHeight);
        const newCol = Math.max(
          0,
          Math.min(columns - 1, draggedCol + deltaCol),
        );
        const newRow = Math.max(0, draggedRow + deltaRow);

        const targetIndex = newRow * columns + newCol;

        if (
          targetIndex >= 0 &&
          targetIndex < data.length &&
          targetIndex !== draggingIndex &&
          targetIndex !== hoveredIndexRef.current &&
          (Math.abs(deltaCol) > 0 || Math.abs(deltaRow) > 0)
        ) {
          hoveredIndexRef.current = targetIndex;
        }
      } catch (error) {}
    },
    [draggingIndex, data, columns, itemSize],
  );

  const renderGridItem = useCallback(
    (item: any, index: number) => {
      const col = index % columns;
      const isDragging = draggingIndex === index;

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
          <DraggableItemAndroid
            item={item}
            index={index}
            isDragging={isDragging}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onHover={handleHover}
            renderItem={renderItem}
            itemSize={itemSize}
          />
        </View>
      );
    },
    [
      columns,
      draggingIndex,
      handleDragStart,
      handleDragEnd,
      handleHover,
      renderItem,
      itemSize,
      keyExtractor,
    ],
  );

  return (
    <View style={[styles.container, style]}>
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
    elevation: 2,
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
});

export default DraggableListAndroid;
