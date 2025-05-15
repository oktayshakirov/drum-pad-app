import React from 'react';
import {SafeAreaView, StatusBar, StyleSheet} from 'react-native';
import DrumPadScreen from './src/screens/DrumPadScreen';
import {AppProvider} from './src/contexts/AppContext';

const App = () => {
  return (
    <AppProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" />
        <DrumPadScreen />
      </SafeAreaView>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
});

export default App;
