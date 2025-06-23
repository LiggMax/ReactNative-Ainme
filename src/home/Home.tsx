import React, {useEffect} from 'react';
import {Text, StyleSheet, View, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function index() {
  const showInputAlert = async () => {
    Alert.prompt(
      '输入名称',
      '请输入您的名称:',
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '确定',
          onPress: text => {
            if (text) {
              saveData(text);
            }
          },
        },
      ],
      'plain-text',
    );
  };

  // 保存数据
  const saveData = async (test: string) => {
    try {
      await AsyncStorage.setItem('name', test);
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  }

  //获取数据
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('name');
      Alert.alert('获取数据成功', value ?? undefined);
    } catch (error) {
      console.error('获取数据失败:', error);
    }
  };
  // React 的 useEffect 钩子
  useEffect(() => {}, []);

  return (
    <View>
      <Text style={[styles.interval]}>Hello World</Text>
      <View style={[styles.interval]}>
        <Button title={'存储本地数据'} onPress={showInputAlert} />
      </View>
      <View style={[styles.interval]}>
        <Button title={'获取本地数据'} onPress={getData} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  interval: {
    margin: 15,
  },
});
