import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import animeService, {ScheduleItem, AnimeItem} from '../../../api/bangumi/animeService';

/**
 * 新番时间表页面
 */
interface SchedulesProps {
  showAlert: (title: string, message: string) => void;
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 每行2个卡片，考虑边距

export default function Schedules({showAlert}: SchedulesProps) {
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeekday, setSelectedWeekday] = useState<number>(1); // 默认选择星期一

  // 获取新番时间表数据
  const fetchScheduleData = async () => {
    try {
      setLoading(true);

      // 调用真实API获取数据
      const data = await animeService.getSchedule();
      setScheduleData(data);
    } catch (error) {
      console.error('获取新番时间表失败:', error);
      showAlert('错误', '获取新番时间表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchScheduleData();
  }, []);

  // 格式化收藏数
  const formatCollectionCount = (count: number): string => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  };

  // 获取当前选中星期的数据
  const getCurrentWeekdayData = (): AnimeItem[] => {
    const currentWeekday = scheduleData.find(item => item.weekday.id === selectedWeekday);
    return currentWeekday?.items || [];
  };

  // 渲染星期选择器
  const renderWeekdaySelector = () => (
    <View style={styles.weekdayContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {scheduleData.map((item) => (
          <TouchableOpacity
            key={item.weekday.id}
            style={[
              styles.weekdayButton,
              selectedWeekday === item.weekday.id && styles.weekdayButtonSelected
            ]}
            onPress={() => setSelectedWeekday(item.weekday.id)}
          >
            <Text style={[
              styles.weekdayText,
              selectedWeekday === item.weekday.id && styles.weekdayTextSelected
            ]}>
              {item.weekday.cn}
            </Text>
            <Text style={[
              styles.weekdayCountText,
              selectedWeekday === item.weekday.id && styles.weekdayCountTextSelected
            ]}>
              {item.items.length}部
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // 渲染动漫卡片
  const renderAnimeCard = ({item}: {item: AnimeItem}) => (
    <TouchableOpacity style={styles.animeCard}>
      <Image
        source={{uri: item.images.large}}
        style={styles.animeImage}
        resizeMode="cover"
      />
      <View style={styles.animeInfo}>
        <Text style={styles.animeTitle} numberOfLines={2}>
          {item.name_cn || item.name}
        </Text>
        <Text style={styles.animeDate}>
          播出：{item.air_date}
        </Text>
        <View style={styles.animeStats}>
          {item.rating && (
            <Text style={styles.animeRating}>
              ⭐ {item.rating.score.toFixed(1)}
            </Text>
          )}
          {item.collection && (
            <Text style={styles.animeCollection}>
              👥 {formatCollectionCount(item.collection.doing)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }

    if (scheduleData.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无新番时间表数据</Text>
        </View>
      );
    }

    const currentData = getCurrentWeekdayData();

    return (
      <View style={styles.contentContainer}>
        {renderWeekdaySelector()}
        <FlatList
          data={currentData}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.animeList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>今日暂无新番</Text>
            </View>
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  weekdayContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    marginBottom: 8,
  },
  weekdayButton: {
    marginHorizontal: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    minWidth: 70,
  },
  weekdayButtonSelected: {
    backgroundColor: '#007AFF',
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  weekdayTextSelected: {
    color: '#fff',
  },
  weekdayCountText: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  weekdayCountTextSelected: {
    color: '#fff',
  },
  animeList: {
    padding: 16,
  },
  animeCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  animeImage: {
    width: '100%',
    height: CARD_WIDTH * 1.4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  animeInfo: {
    padding: 12,
  },
  animeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 18,
  },
  animeDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  animeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  animeRating: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '500',
  },
  animeCollection: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
