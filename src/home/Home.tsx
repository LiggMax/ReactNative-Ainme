import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Dialog, Portal, TextInput, Button} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function index() {
  const [visible, setVisible] = useState(false);
  const [inputText, setInputText] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

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

  // React 的 useEffect 钩子
  useEffect(() => {}, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.interval]}>Hello World</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  interval: {
    margin: 15,
  },
  dialogMessage: {
    marginBottom: 16,
    fontSize: 16,
  },
  textInput: {
    marginBottom: 8,
  },
});
