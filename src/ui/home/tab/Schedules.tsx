import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';

interface SchedulesProps {
  showAlert: (title: string, message: string) => void;
}

export default function Schedules({ showAlert }: SchedulesProps) {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.interval, styles.title]}>新番时间表</Text>
      <View style={[styles.interval]}>
        <Button mode="outlined" onPress={() => showAlert('时间表', '今日新番更新列表')}>
          今日更新
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button mode="outlined" onPress={() => showAlert('时间表', '本周新番时间安排')}>
          本周时间表
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button mode="outlined" onPress={() => showAlert('时间表', '订阅提醒设置')}>
          订阅提醒
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  interval: {
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
