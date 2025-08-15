import React, {useState, useEffect, createContext, useCallback} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import OnboardingScreen from './src/screens/OnboardingScreen';
import DrumPadScreen from './src/screens/DrumPadScreen';
import PackLibraryScreen from './src/screens/PackLibraryScreen';
import SoundPackScreen from './src/screens/SoundPackScreen';
import PackUnlockedScreen from './src/screens/PackUnlockedScreen';
import CustomizeScreen from './src/screens/CustomizeScreen';
import {AppProvider, useAppContext} from './src/contexts/AppContext';

import ConsentDialog from './src/components/ads/ConsentDialog';
import CustomSplashScreen from './src/components/CustomSplashScreen';
import {StyleSheet, View, ActivityIndicator, StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {OnboardingService} from './src/services/OnboardingService';
import {UnlockService} from './src/services/UnlockService';

export type RootStackParamList = {
  Onboarding: undefined;
  DrumPad: undefined;
  PackLibrary: undefined;
  SoundPackDetail: {packId: string};
  PackUnlocked: {packId: string};
  Customize: {packId: string};
};

export const OnboardingContext = createContext<{
  completeOnboarding: () => void;
}>({
  completeOnboarding: () => {},
});

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigatorContent: React.FC = () => {
  const {isLoading} = useAppContext();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  const completeOnboarding = useCallback(() => {
    setShowOnboarding(false);
  }, []);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        await UnlockService.initialize();
        const unlockedPacks = UnlockService.getUnlockedPacks();
        const isCompleted = await OnboardingService.isOnboardingCompleted();

        setShowOnboarding(!isCompleted || unlockedPacks.size === 0);
      } catch (error) {
        setShowOnboarding(true);
      } finally {
        setOnboardingChecked(true);
      }
    };

    checkOnboardingStatus();
  }, []);

  if (isLoading || !onboardingChecked) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (showOnboarding) {
    return (
      <OnboardingContext.Provider value={{completeOnboarding}}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
              cardStyle: {backgroundColor: 'transparent'},
            }}>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </OnboardingContext.Provider>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DrumPad"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
          cardStyle: {backgroundColor: 'transparent'},
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
        <Stack.Screen
          name="PackUnlocked"
          component={PackUnlockedScreen}
          options={{presentation: 'modal'}}
        />
        <Stack.Screen
          name="Customize"
          component={CustomizeScreen}
          options={{presentation: 'modal'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  const [consentCompleted, setConsentCompleted] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <AppProvider>
        <SafeAreaProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent={true}
          />
          {showSplash ? (
            <CustomSplashScreen
              isVisible={showSplash}
              onAnimationComplete={handleSplashComplete}
            />
          ) : !consentCompleted ? (
            <ConsentDialog
              onConsentCompleted={() => setConsentCompleted(true)}
            />
          ) : (
            <AppNavigatorContent />
          )}
        </SafeAreaProvider>
      </AppProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});

export default App;
