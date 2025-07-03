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
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';

// 内部应用组件，使用主题
const AppContent: React.FC = () => {
  const { theme } = useAppTheme();
  
  return (
    <PaperProvider theme={theme}>
      <StatusBarManager {...StatusBarConfigs.smart} />
      <AppNavigator />
    </PaperProvider>
  );
};
function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default App;
