import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import DrumPadScreen from './src/screens/DrumPadScreen';
import PackLibraryScreen from './src/screens/PackLibraryScreen';
import SoundPackScreen from './src/screens/SoundPackScreen';
import {AppProvider, useAppContext} from './src/contexts/AppContext';
import {soundPacks} from './src/assets/sounds';
import ConsentDialog from './src/components/ads/ConsentDialog';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';

export type RootStackParamList = {
  DrumPad: undefined;
  PackLibrary: undefined;
  SoundPackDetail: {packId: string};
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigatorContent: React.FC = () => {
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
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DrumPad"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}>
        <Stack.Screen name="DrumPad" component={DrumPadScreen} />
        <Stack.Screen
          name="PackLibrary"
          component={PackLibraryScreen}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen
          name="SoundPackDetail"
          component={SoundPackScreen}
          options={{presentation: 'modal'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  const [consentCompleted, setConsentCompleted] = useState(false);

  return (
    <AppProvider>
      <SafeAreaProvider>
        {!consentCompleted ? (
          <ConsentDialog onConsentCompleted={() => setConsentCompleted(true)} />
        ) : (
          <SafeAreaView
            style={styles.safeArea}
            edges={['top', 'bottom', 'left', 'right']}>
            <AppNavigatorContent />
          </SafeAreaView>
        )}
      </SafeAreaProvider>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
