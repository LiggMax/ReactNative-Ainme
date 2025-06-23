import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import animeService, {AnimeItem} from '../../../api/bangumi/animeService';

/**
 * 新番时间表页面
 */
interface SchedulesProps {
  showAlert: (title: string, message: string) => void;
}


export default function Schedules({showAlert}: SchedulesProps) {
  const [scheduleData, setScheduleData] = useState<{[key: string]: AnimeItem[]}>();
  const [loading, setLoading] = useState(false);

  // 获取新番时间表数据
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const data = await animeService.getSchedule();
      setScheduleData(data);
    } catch (error) {
      console.error('获取新番时间表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchScheduleData();
  }, []);

  return (
    <View style={styles.tabContent}>
      <Text style={[styles.interval, styles.title]}>新番时间表</Text>
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
  dataInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});
