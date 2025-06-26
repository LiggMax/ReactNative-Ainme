import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator, NativeStackNavigationOptions} from '@react-navigation/native-stack';
import {useTheme} from 'react-native-paper';
import {useNavigation as useRNNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ResponsiveLayout from '../ui/Layout';
import AnimeDetail from '../ui/animedatail/AnimeDatail';
import {RootStackParamList} from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

// 路由配置
const ROUTE_CONFIG: Record<keyof RootStackParamList, NativeStackNavigationOptions> = {
  Main: {
    headerShown: false,
  },
  AnimeDetail: {
    headerShown: false,
    animation: 'slide_from_right',
  },
};

// 自定义导航Hook
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const useAppNavigation = () => {
  const navigation = useRNNavigation<NavigationProp>();

  return {
    navigation,
    navigateToAnimeDetail: (id: number, title?: string) => {
      navigation.navigate('AnimeDetail', {id, title});
    },
    goBack: () => {
      navigation.goBack();
    },
    canGoBack: () => {
      return navigation.canGoBack();
    },
  };
};

// 主导航器组件
export default function AppNavigator() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const screenOptions: NativeStackNavigationOptions = {
    headerTitleStyle: {
      fontWeight: '600',
    },
    headerStyle: {
      backgroundColor: theme.colors.surface,
    },
    headerTintColor: theme.colors.onSurface,
    contentStyle: {
      paddingTop: 0,
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={screenOptions}
      >
        <Stack.Screen
          name="Main"
          component={ResponsiveLayout}
          options={ROUTE_CONFIG.Main}
        />
        <Stack.Screen
          name="AnimeDetail"
          component={AnimeDetail}
          options={ROUTE_CONFIG.AnimeDetail}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
