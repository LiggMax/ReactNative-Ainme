import React, {useState, useMemo, useEffect, useCallback} from 'react';
import {Text, StyleSheet, View, Dimensions, TouchableOpacity} from 'react-native';
import {BottomNavigation, useTheme, Surface, Divider} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import {SafeAreaView} from 'react-native-safe-area-context';
import Home from './home/HomeLayout.tsx';
import Profile from './profile/ProfileLayout.tsx';

// 定义路由接口
interface RouteItem {
  key: string;
  title: string;
  focusedIcon: string;
  unfocusedIcon: string;
}

// 响应式断点配置
const BREAKPOINTS = {
  tablet: 768,
  largePhone: 480,
};

export default function BottomTabLayout() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);
  const [screenData, setScreenData] = useState(() => Dimensions.get('window'));

  // 监听屏幕尺寸变化
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  // 计算是否应该使用侧边导航
  const shouldUseSideNavigation = useMemo(() => {
    const {width, height} = screenData;

    // 在以下情况使用侧边导航：
    // 1. 屏幕宽度大于平板断点
    // 2. 横屏模式（宽度大于高度且宽度大于大屏手机断点）
    return width >= BREAKPOINTS.tablet || (width > height && width >= BREAKPOINTS.largePhone);
  }, [screenData]);

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
  ), [theme.colors]);

  const ProfileScreen = useCallback(() => (
    <Profile/>
  ), [theme.colors]);

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

  const components = useMemo(() => [HomeScreen, CollectionScreen, ProfileScreen], [HomeScreen, CollectionScreen, ProfileScreen]);

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
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderBottomNavIcon}
      barStyle={[styles.bottomNavigation, { backgroundColor: theme.colors.surface }]}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
    />
  );
}

const styles = StyleSheet.create({
  // 平板/横屏布局样式
  tabletContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sideNavigationContainer: {
    width: 280,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  sideNavContent: {
    flex: 1,
  },
  sideNavHeader: {
    padding: 24,
    paddingBottom: 16,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  navItemsContainer: {
    flex: 1,
    paddingTop: 8,
  },
  sideNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 12,
  },
  sideNavIcon: {
    marginRight: 16,
  },
  sideNavItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },

  // 手机布局样式
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
