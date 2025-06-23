import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, useWindowDimensions} from 'react-native';
import {Dialog, Portal, TextInput, Button, useTheme} from 'react-native-paper';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Recommend from './tab/Recommend';
import Schedules from './tab/Schedules';
import Ranking from './tab/Ranking';

export default function index() {
  const theme = useTheme();
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'recommend', title: '推荐'},
    {key: 'Schedules', title: '新番时间表'},
    {key: 'ranking', title: '排行榜'},
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
  };

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

  // 推荐页面
  const RecommendRoute = () => (
    <Recommend showInputAlert={showInputAlert} getData={getData} />
  );

  // 新番时间表页面
  const SchedulesRoute = () => (
    <Schedules showAlert={showAlert} />
  );

  // 排行榜页面
  const RankingRoute = () => (
    <Ranking showAlert={showAlert} />
  );

  const renderScene = SceneMap({
    recommend: RecommendRoute,
    Schedules: SchedulesRoute,
    ranking: RankingRoute,
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={[styles.tabIndicator, { backgroundColor: theme.colors.primary }]}
      style={[styles.tabBar, { backgroundColor: theme.colors.surface }]}
      labelStyle={styles.tabLabel}
      activeColor={theme.colors.primary}
      inactiveColor={theme.colors.onSurfaceVariant}
      scrollEnabled={false}
      tabStyle={styles.tabStyle}
      contentContainerStyle={styles.tabBarContent}
    />
  );

  const layout = useWindowDimensions();

  // 动态样式
  const dynamicStyles = StyleSheet.create({
    tabBar: {
      backgroundColor: theme.colors.surface,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    tabIndicator: {
      backgroundColor: theme.colors.primary,
      height: 3,
    },
  });

  // React 的 useEffect 钩子
  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{width: layout.width}}
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
    paddingTop: 0,
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
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
  },
  tabIndicator: {
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
