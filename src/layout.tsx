import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from './home/Home';

// 定义屏幕组件
function HomeScreen() {
  return (
    <View style={styles.screenContainer}>
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

const Tab = createBottomTabNavigator();

export default function BottomTabLayout() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarInactiveTintColor: 'black',//未激活状态时的颜色
          tabBarActiveTintColor: 'rgba(46,46,46,0.85)',//激活状态时的颜色
          tabBarStyle: {
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: '首页',
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) => (
              <Icon
                name={focused ? 'home' : 'home-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Explore"
          component={CollectionScreen}
          options={{
            tabBarLabel: '收藏',
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) => (
              <Icon
                name={focused ? 'heart' : 'heart-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: '我的',
            // eslint-disable-next-line react/no-unstable-nested-components
            tabBarIcon: ({color, size, focused}) => (
              <Icon
                name={focused ? 'person' : 'person-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});
