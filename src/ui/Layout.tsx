import React, {useState, useMemo, useCallback} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {BottomNavigation, useTheme} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './home/HomeLayout.tsx';
import Profile from './profile/ProfileLayout.tsx';

// 定义路由接口
interface RouteItem {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
}



export default function BottomTabLayout() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  // 缓存Home组件实例，避免重新创建
  const homeInstance = useMemo(() => <Home />, []);

  // 定义屏幕组件
  const HomeScreen = useCallback(() => (
    <View style={styles.homeScreenContainer}>
      {homeInstance}
    </View>
  ), [homeInstance]);

  const CollectionScreen = useCallback(() => (
    <View style={styles.screenContainer}>
      <Text style={[styles.screenTitle, {color: theme.colors.onSurface}]}>探索</Text>
      <Text style={[styles.screenContent, {color: theme.colors.onSurfaceVariant}]}>发现更多精彩动漫</Text>
    </View>
  ), [theme.colors.onSurface]);

  const ProfileScreen = useCallback(() => (
    <Profile/>
  ), []);

  const routes: RouteItem[] = useMemo(() => [
    {
      key: 'home',
      title: '首页',
      focusedIcon: 'home',
      unfocusedIcon: 'home-outline',
    },
    {
      key: 'collection',
      title: '收藏',
      focusedIcon: 'heart',
      unfocusedIcon: 'heart-outline',
    },
    {
      key: 'profile',
      title: '我的',
      focusedIcon: 'person',
      unfocusedIcon: 'person-outline',
    },
  ], []);



  // 底部导航图标渲染
  const renderBottomNavIcon = useCallback(({route, focused, color}: {route: RouteItem, focused: boolean, color: string}) => {
    const iconName = focused ? route.focusedIcon : route.unfocusedIcon;
    return <Icon name={iconName} size={24} color={color} />;
  }, []);

  // 底部导航场景映射
  const renderScene = useMemo(() => BottomNavigation.SceneMap({
    home: HomeScreen,
    collection: CollectionScreen,
    profile: ProfileScreen,
  }), [HomeScreen, CollectionScreen, ProfileScreen]);

  // 底部导航布局
  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <BottomNavigation
        navigationState={{index, routes}}
        onIndexChange={setIndex}
        renderScene={renderScene}
        renderIcon={renderBottomNavIcon}
        barStyle={[styles.bottomNavigation, { backgroundColor: theme.colors.surface }]}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.onSurfaceVariant}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  homeScreenContainer: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  screenContent: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomNavigation: {
    elevation: 8,
    shadowOpacity: 0.1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowRadius: 8,
  },
});
