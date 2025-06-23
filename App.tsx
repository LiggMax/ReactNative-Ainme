/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {Provider as PaperProvider, useTheme} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import BottomTabLayout from './src/ui/Layout.tsx';

function AppContent(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const theme = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent={true}
        backgroundColor={theme.colors.surface}
      />
      <BottomTabLayout />
    </>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AppContent />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
