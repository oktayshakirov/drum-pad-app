import React, {useState, useCallback, useRef, useEffect, useMemo} from 'react';
import {StyleSheet, Animated, ScrollView, View} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

const ITEM_HEIGHT = 80;
const ITEM_MARGIN = 1;
const TOTAL_ITEM_HEIGHT = ITEM_HEIGHT + ITEM_MARGIN * 2;

interface DraggableItemProps {
  item: any;
  index: number;
  isDragging: boolean;
  isHovered: boolean;
  translateY: Animated.Value;
  zIndex: Animated.Value;
  onDragStart: (index: number) => void;
  onDragEnd: (index: number, translationY: number) => void;
  renderItem: (item: any, index: number) => React.ReactElement;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  index,
  isDragging,
  isHovered,
  translateY,
  zIndex,
  onDragStart,
  onDragEnd,
  renderItem,
}) => {
  const scale = translateY.interpolate({
    inputRange: [-50, 0, 50],
    outputRange: [0.95, 1, 1.05],
    extrapolate: 'clamp',
  });

  const shadowOpacity = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.3],
  });

  const shadowRadius = translateY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const onGestureEvent = Animated.event(
    [{nativeEvent: {translationY: translateY}}],
    {useNativeDriver: true},
  );

  const onHandlerStateChange = useCallback(
    (event: any) => {
      if (event.nativeEvent.state === State.BEGAN) {
        onDragStart(index);
      } else if (event.nativeEvent.state === State.END) {
        onDragEnd(index, event.nativeEvent.translationY);
      }
    },
    [index, onDragStart, onDragEnd],
  );

  return (
    <Animated.View
      style={[
        styles.draggableItem,
        isDragging && styles.draggingItem,
        isHovered && styles.hoveredItem,
        {
          transform: [{translateY}, {scale}],
          shadowOpacity,
          shadowRadius,
          zIndex: zIndex,
        },
      ]}>
      <PanGestureHandler
        onGestureEvent={onGestureEvent}
        onHandlerStateChange={onHandlerStateChange}
        minDist={10}
        shouldCancelWhenOutside={false}>
        <Animated.View style={styles.gestureContainer}>
          {renderItem(item, index)}
        </Animated.View>
      </PanGestureHandler>
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
  const scrollViewRef = useRef<ScrollView>(null);
  const translateYValues = useRef<{[key: string]: Animated.Value}>({});
  const zIndexValues = useRef<{[key: string]: Animated.Value}>({});
  const lastHoverTime = useRef<number>(0);

  const itemPositions = useMemo(() => {
    return data.map((_, index) => index * TOTAL_ITEM_HEIGHT);
  }, [data]);

  const getTranslateYValue = useCallback((key: string) => {
    if (!translateYValues.current[key]) {
      translateYValues.current[key] = new Animated.Value(0);
    }
    return translateYValues.current[key];
  }, []);

  const getZIndexValue = useCallback((key: string) => {
    if (!zIndexValues.current[key]) {
      zIndexValues.current[key] = new Animated.Value(0);
    }
    return zIndexValues.current[key];
  }, []);

  const handleDragStart = useCallback(
    (index: number) => {
      setDraggingIndex(index);
      setHoveredIndex(null);

      const draggedKey = keyExtractor(data[index], index);
      const draggedZIndex = getZIndexValue(draggedKey);
      draggedZIndex.setValue(1000);
    },
    [data, keyExtractor, getZIndexValue],
  );

  const handleDragEnd = useCallback(
    (index: number, translationY: number) => {
      const newIndex = Math.round(
        (index * TOTAL_ITEM_HEIGHT + translationY) / TOTAL_ITEM_HEIGHT,
      );
      const clampedNewIndex = Math.max(0, Math.min(data.length - 1, newIndex));

      if (clampedNewIndex !== index) {
        onReorder(index, clampedNewIndex);
      }

      Object.values(zIndexValues.current).forEach(zIndex => {
        zIndex.setValue(0);
      });

      const currentTranslateY =
        translateYValues.current[keyExtractor(data[index], index)];
      Animated.timing(currentTranslateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setDraggingIndex(null);
        setHoveredIndex(null);
      });
    },
    [data, keyExtractor, onReorder],
  );

  const checkHover = useCallback(
    (draggedPosition: number) => {
      const now = Date.now();
      if (now - lastHoverTime.current < 50) {
        return;
      }
      lastHoverTime.current = now;

      let newHoveredIndex: number | null = null;

      data.forEach((item, index) => {
        if (index !== draggingIndex) {
          const itemTop = itemPositions[index];
          const itemBottom = itemTop + TOTAL_ITEM_HEIGHT;
          const draggedTop = draggedPosition;
          const draggedBottom = draggedPosition + TOTAL_ITEM_HEIGHT;

          const isHovering = draggedTop < itemBottom && draggedBottom > itemTop;

          if (isHovering) {
            newHoveredIndex = index;
          }

          const itemKey = keyExtractor(item, index);
          const itemZIndex = getZIndexValue(itemKey);
          itemZIndex.setValue(isHovering ? 500 : 0);
        }
      });

      if (newHoveredIndex !== hoveredIndex) {
        setHoveredIndex(newHoveredIndex);
      }
    },
    [
      draggingIndex,
      data,
      keyExtractor,
      getZIndexValue,
      itemPositions,
      hoveredIndex,
    ],
  );

  useEffect(() => {
    if (draggingIndex !== null) {
      const draggedTranslateY =
        translateYValues.current[
          keyExtractor(data[draggingIndex], draggingIndex)
        ];
      let listenerId: string | null = null;

      if (draggedTranslateY) {
        listenerId = draggedTranslateY.addListener(({value}) => {
          const draggedPosition = draggingIndex * TOTAL_ITEM_HEIGHT + value;
          checkHover(draggedPosition);
        });
      }

      return () => {
        if (listenerId && draggedTranslateY) {
          draggedTranslateY.removeListener(listenerId);
        }
      };
    }
  }, [draggingIndex, data, keyExtractor, checkHover]);

  useEffect(() => {
    const translateValues = translateYValues.current;
    const zIndexValuesRef = zIndexValues.current;

    return () => {
      Object.values(translateValues).forEach(value => {
        value.stopAnimation();
      });
      Object.values(zIndexValuesRef).forEach(value => {
        value.stopAnimation();
      });
    };
  }, []);

  const handleScroll = useCallback(
    (event: any) => {
      if (draggingIndex !== null) {
        const scrollY = event.nativeEvent.contentOffset.y;
        const itemTop = draggingIndex * TOTAL_ITEM_HEIGHT;
        const itemBottom = itemTop + TOTAL_ITEM_HEIGHT;

        if (scrollY > itemTop - 100) {
          scrollViewRef.current?.scrollTo({
            y: Math.max(0, scrollY - 50),
            animated: true,
          });
        } else if (scrollY < itemBottom + 100) {
          scrollViewRef.current?.scrollTo({
            y: scrollY + 50,
            animated: true,
          });
        }
      }
    },
    [draggingIndex],
  );

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>
        <GestureHandlerRootView>
          {data.map((item, index) => (
            <DraggableItem
              key={keyExtractor(item, index)}
              item={item}
              index={index}
              isDragging={draggingIndex === index}
              isHovered={hoveredIndex === index}
              translateY={getTranslateYValue(keyExtractor(item, index))}
              zIndex={getZIndexValue(keyExtractor(item, index))}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              renderItem={renderItem}
            />
          ))}
        </GestureHandlerRootView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  draggableItem: {
    marginVertical: ITEM_MARGIN,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  draggingItem: {
    elevation: 10,
  },
  hoveredItem: {
    borderWidth: 3,
    borderColor: '#fff',
    borderStyle: 'solid',
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 15,
  },
  gestureContainer: {
    flex: 1,
  },
});

export default DraggableList;
