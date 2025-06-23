import React, { useState, useEffect } from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';
import animeService, { AnimeItem } from '../../../api/bangumi/animeService';
/**
 * 新番时间表页面
 */
interface SchedulesProps {
  showAlert: (title: string, message: string) => void;
}


export default function Schedules({ showAlert }: SchedulesProps) {
  const [scheduleData, setScheduleData] = useState<{[key: string]: AnimeItem[]}>();
  const [loading, setLoading] = useState(false);

  // 获取新番时间表数据
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      const data = await animeService.getSchedule();
      setScheduleData(data);
      showAlert('成功', '新番时间表数据加载成功');
    } catch (error) {
      console.error('获取新番时间表失败:', error);
      showAlert('错误', '获取新番时间表失败');
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

      <View style={[styles.interval]}>
        <Button
          mode="outlined"
          onPress={fetchScheduleData}
          loading={loading}
          disabled={loading}
        >
          {loading ? '加载中...' : '刷新时间表'}
        </Button>
      </View>

      <View style={[styles.interval]}>
        <Button mode="outlined" onPress={() => showAlert('时间表', '今日新番更新列表')}>
          今日更新11
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

      {/* 显示数据统计 */}
      {scheduleData && (
        <View style={[styles.interval]}>
          <Text style={styles.dataInfo}>
            已加载 {Object.keys(scheduleData).length} 天的时间表数据
          </Text>
        </View>
      )}
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
