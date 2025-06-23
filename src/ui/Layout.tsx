import React, {useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {BottomNavigation, useTheme} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './home/HomeLayout';

// 定义屏幕组件
function HomeScreen() {
  return (
    <View style={styles.homeScreenContainer}>
      <Home/>
    </View>
  );
}

function CollectionScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>探索</Text>
      <Text style={styles.screenContent}>发现更多精彩动漫</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenTitle}>个人资料</Text>
      <Text style={styles.screenContent}>我的动漫收藏</Text>
    </View>
  );
}

export default function BottomTabLayout() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  const routes = [
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
  ];

  const renderScene = BottomNavigation.SceneMap({
    home: HomeScreen,
    collection: CollectionScreen,
    profile: ProfileScreen,
  });

  const renderIcon = ({route, focused, color}: {route: any, focused: boolean, color: string}) => {
    const iconName = focused ? route.focusedIcon : route.unfocusedIcon;
    return <Icon name={iconName} size={24} color={color} />;
  };

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderIcon}
      barStyle={[styles.bottomNavigation, { backgroundColor: theme.colors.surface }]}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
    />
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  homeScreenContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  screenContent: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  bottomNavigation: {
    elevation: 8,
    shadowOpacity: 0.1,
  },
});
