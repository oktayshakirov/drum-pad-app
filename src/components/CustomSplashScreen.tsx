import React, {useEffect, useRef, useCallback} from 'react';
import {View, Image, StyleSheet, Dimensions, Animated} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

interface CustomSplashScreenProps {
  onAnimationComplete: () => void;
  isVisible: boolean;
}

const CustomSplashScreen: React.FC<CustomSplashScreenProps> = ({
  onAnimationComplete,
  isVisible,
}) => {
  const logoRef = useRef<any>(null);
  const waveRef = useRef<any>(null);
  const waveValues = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const insets = useSafeAreaInsets();

  const handleFadeOut = useCallback(() => {
    if (logoRef.current) {
      logoRef.current.fadeOut(1000);
    }
    if (waveRef.current) {
      waveRef.current.fadeOut(1000).then(() => {
        onAnimationComplete();
      });
    }
  }, [onAnimationComplete]);

  useEffect(() => {
    if (isVisible) {
      if (logoRef.current) {
        logoRef.current.fadeIn(1200);
      }

      setTimeout(() => {
        if (waveRef.current) {
          waveRef.current.fadeIn(800);
        }

        waveValues.forEach((value, index) => {
          const delay = index * 200;
          Animated.loop(
            Animated.timing(value, {
              toValue: 1,
              duration: 1500,
              delay: delay,
              useNativeDriver: true,
            }),
          ).start();
        });
      }, 600);

      const totalDisplayTime = 1200 + 600 + 800 + 1500;
      setTimeout(() => {
        handleFadeOut();
      }, totalDisplayTime);
    }
  }, [isVisible, waveValues, handleFadeOut]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.contentContainer,
          {
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
          },
        ]}>
        {/* Logo Section */}
        <Animatable.View ref={logoRef} style={styles.logoContainer}>
          <Image
            source={require('../assets/images/splash-icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animatable.View>

        {/* Wave Animation Section */}
        <Animatable.View ref={waveRef} style={styles.waveContainer}>
          {waveValues.map((value, index) => (
            <Animated.View
              key={index}
              style={[
                styles.waveBar,
                {
                  transform: [
                    {
                      scaleY: value.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0.3, 1, 0.3],
                      }),
                    },
                  ],
                  opacity: value.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0.3, 1, 0.3],
                  }),
                },
              ]}
            />
          ))}
        </Animatable.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.85,
    height: height * 0.6,
    maxWidth: 600,
    maxHeight: 800,
  },
  waveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  waveBar: {
    width: 6,
    height: 40,
    backgroundColor: '#00D4FF',
    borderRadius: 3,
    marginHorizontal: 3,
  },
});

export default CustomSplashScreen;
