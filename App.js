import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {BlurView} from '@react-native-community/blur';
import DrumPadScreen from './src/screens/DrumPadScreen';
import {AppProvider, useAppContext} from './src/contexts/AppContext';
import {soundPacks} from './src/assets/sounds';

const AppContent = () => {
  const {currentSoundPack, isLoading} = useAppContext();
  const currentPack = soundPacks[currentSoundPack];

  if (isLoading || !currentPack) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ImageBackground
        source={currentPack.cover}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="dark"
        blurAmount={25}
      />
      <SafeAreaView style={styles.safeArea}>
        <DrumPadScreen />
      </SafeAreaView>
    </View>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default App;
