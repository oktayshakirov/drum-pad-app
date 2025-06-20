import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DrumPadScreen from './src/screens/DrumPadScreen';
import {AppProvider, useAppContext} from './src/contexts/AppContext';
import {soundPacks} from './src/assets/sounds';

const AppContent = () => {
  const {currentSoundPack} = useAppContext();

  // Get gradient colors from current sound pack or use default
  const currentPack = soundPacks[currentSoundPack];
  const background = currentPack?.background || ['#232526', '#414345'];

  return (
    <LinearGradient colors={background} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" />
        <DrumPadScreen />
      </SafeAreaView>
    </LinearGradient>
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
});

export default App;
