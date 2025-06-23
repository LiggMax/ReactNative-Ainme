import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, useWindowDimensions} from 'react-native';
import {Dialog, Portal, TextInput, Button} from 'react-native-paper';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function index() {
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'storage', title: '存储管理' },
    { key: 'settings', title: '设置' },
    { key: 'about', title: '关于' },
  ]);

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const hideAlert = () => {
    setAlertVisible(false);
  };

  const showInputAlert = () => {
    setInputText('');
    setVisible(true);
  };

  const hideDialog = () => {
    setVisible(false);
    setInputText('');
  };

  const handleConfirm = () => {
    if (inputText.trim()) {
      saveData(inputText.trim());
    }
    hideDialog();
  };

  // 保存数据
  const saveData = async (test: string) => {
    try {
      await AsyncStorage.setItem('name', test);
      showAlert('成功', '数据保存成功！');
    } catch (error) {
      console.error('保存数据失败:', error);
      showAlert('错误', '保存数据失败');
    }
  }

  //获取数据
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('name');
      showAlert('获取数据成功', value || '暂无数据');
    } catch (error) {
      console.error('获取数据失败:', error);
      showAlert('错误', '获取数据失败');
    }
  };

  // 存储管理页面
  const StorageRoute = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.interval]}>存储管理</Text>
      <View style={[styles.interval]}>
        <Button mode="contained" onPress={showInputAlert}>
          存储本地数据
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button mode="contained" onPress={getData}>
          获取本地数据
        </Button>
      </View>
    </View>
  );

  // 设置页面
  const SettingsRoute = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.interval, styles.title]}>应用设置</Text>
      <View style={[styles.interval]}>
        <Button mode="outlined" onPress={() => showAlert('设置', '主题设置功能')}>
          主题设置
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button mode="outlined" onPress={() => showAlert('设置', '语言设置功能')}>
          语言设置
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button mode="outlined" onPress={() => showAlert('设置', '通知设置功能')}>
          通知设置
        </Button>
      </View>
    </View>
  );

  // 关于页面
  const AboutRoute = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.interval, styles.title]}>关于应用</Text>
      <Text style={[styles.interval, styles.description]}>
        这是一个使用 React Native 和 Paper 组件库构建的示例应用。
      </Text>
      <Text style={[styles.interval, styles.description]}>
        版本：1.0.0
      </Text>
      <View style={[styles.interval]}>
        <Button mode="text" onPress={() => showAlert('关于', '感谢使用本应用！')}>
          更多信息
        </Button>
      </View>
    </View>
  );

  const renderScene = SceneMap({
    storage: StorageRoute,
    settings: SettingsRoute,
    about: AboutRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={styles.tabIndicator}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor="#6200ee"
      inactiveColor="#666"
      scrollEnabled={false}
      tabStyle={styles.tabStyle}
      contentContainerStyle={styles.tabBarContent}
    />
  );

  const layout = useWindowDimensions();

  // React 的 useEffect 钩子
  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.container}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{ width: layout.width }}
        style={styles.tabView}
        tabBarPosition="top"
        swipeEnabled={true}
      />

      {/* 输入弹窗 */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>输入名称</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>请输入您的名称:</Text>
            <TextInput
              mode="outlined"
              value={inputText}
              onChangeText={setInputText}
              placeholder="请输入名称"
              autoFocus={true}
              style={styles.textInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>取消</Button>
            <Button onPress={handleConfirm}>确定</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* 提示弹窗 */}
      <Portal>
        <Dialog visible={alertVisible} onDismiss={hideAlert}>
          <Dialog.Title>{alertTitle}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>{alertMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideAlert}>确定</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  tabBar: {
    backgroundColor: '#ffffff',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabIndicator: {
    backgroundColor: '#6200ee',
    height: 3,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'none',
    margin: 0,
    padding: 0,
  },
  interval: {
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
  dialogMessage: {
    marginBottom: 16,
    fontSize: 16,
  },
  textInput: {
    marginBottom: 8,
  },
  tabStyle: {
    flex: 1,
    paddingHorizontal: 4,
  },
  tabBarContent: {
    justifyContent: 'space-around',
  },
});
