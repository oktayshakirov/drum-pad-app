import React, {useState, useEffect, memo, useRef} from 'react';
import {View, Animated, StyleSheet} from 'react-native';

const Equalizer: React.FC = memo(() => {
  const [animations] = useState<Animated.Value[]>([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const animate = (): void => {
      const sequences = animations.map(anim => {
        return Animated.sequence([
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 1,
            duration: 300 + Math.random() * 200,
            useNativeDriver: true,
          }),
        ]);
      });

      animationRef.current = Animated.parallel(sequences);
      animationRef.current.start(() => animate());
    };

    animate();

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
        animationRef.current = null;
      }
      animations.forEach(anim => anim.stopAnimation());
    };
  }, [animations]);

  return (
    <View style={styles.equalizerContainer}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.equalizerBar,
            {
              transform: [{scaleY: anim}],
            },
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  equalizerContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  equalizerBar: {
    width: 3,
    height: 12,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    borderRadius: 1.5,
  },
});

export default Equalizer;
