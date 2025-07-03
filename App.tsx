/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { PaperProvider} from 'react-native-paper';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation';
import {
  StatusBarManager,
  StatusBarConfigs,
} from './src/components/StatusBarManager.tsx';
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <StatusBarManager {...StatusBarConfigs.smart} />
        <AppNavigator />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

export default App;
