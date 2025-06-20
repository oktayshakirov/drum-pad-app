import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DrumPadScreen from './src/screens/DrumPadScreen';
import {AppProvider} from './src/contexts/AppContext';

const App = () => {
  return (
    <AppProvider>
      <LinearGradient colors={['#232526', '#414345']} style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <StatusBar barStyle="light-content" />
          <DrumPadScreen />
        </SafeAreaView>
      </LinearGradient>
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
