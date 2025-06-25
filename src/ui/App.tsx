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
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabLayout from './Layout.tsx';
import AnimeDetail from './animedatail/AnimeDatail.tsx';
import {RootStackParamList} from '../types/navigation.ts';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Main"
          screenOptions={{
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerTintColor: theme.colors.onSurface,
            headerTitleStyle: {
              fontWeight: '600',
            },
          }}
        >
          <Stack.Screen
            name="Main"
            component={BottomTabLayout}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AnimeDetail"
            component={AnimeDetail}
            options={({route}) => ({
              title: route.params?.title || '动漫详情',
              headerBackTitle: '返回',
            })}
          />
        </Stack.Navigator>
      </NavigationContainer>
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
