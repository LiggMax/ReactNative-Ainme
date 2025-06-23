import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import animeService, {AnimeItem, ScheduleItem} from '../../../api/bangumi/animeService';

// 创建Shimmer组件
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

/**
 * 新番时间表页面
 */
interface SchedulesProps {
  showAlert: (title: string, message: string) => void;
}

const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 每行2个卡片，考虑边距

export default function Schedules({showAlert}: SchedulesProps) {
  const theme = useTheme();
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeekday, setSelectedWeekday] = useState<number>(1); // 默认选择星期一
  const [dataLoaded, setDataLoaded] = useState(false); // 数据是否已加载

  // 图片加载状态管理
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});

  // 获取新番时间表数据 - 使用useCallback避免重复创建
  const fetchScheduleData = useCallback(async () => {
    // 如果数据已加载且不为空，则不重复请求
    if (dataLoaded && scheduleData.length > 0) {
      return;
    }

    try {
      setLoading(true);

      // 调用真实API获取数据
      const data = await animeService.getSchedule();
      setScheduleData(data);
      setDataLoaded(true);
    } catch (error) {
      console.error('获取新番时间表失败:', error);
      showAlert('错误', '获取新番时间表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [dataLoaded, scheduleData.length, showAlert]);

  // 组件加载时获取数据
  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  // 当数据更新时清理图片加载状态
  useEffect(() => {
    if (scheduleData.length > 0) {
      setImageLoadingStates({});
    }
  }, [scheduleData]);

  // 处理图片加载开始
  const handleImageLoadStart = useCallback((itemId: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: true
    }));
  }, []);

  // 处理图片加载完成
  const handleImageLoadEnd = useCallback((itemId: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  }, []);

  // 格式化收藏数 - 使用useCallback缓存函数
  const formatCollectionCount = useCallback((count: number): string => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  }, []);

  // 获取当前选中星期的数据 - 使用useMemo缓存计算结果
  const currentWeekdayData = useMemo((): AnimeItem[] => {
    const currentWeekday = scheduleData.find(item => item.weekday.id === selectedWeekday);
    return currentWeekday?.items || [];
  }, [scheduleData, selectedWeekday]);

  // 初始化图片加载状态
  useEffect(() => {
    if (currentWeekdayData.length > 0) {
      const initialStates: {[key: string]: boolean} = {};
      currentWeekdayData.forEach(item => {
        initialStates[item.id] = true; // 初始状态为加载中
      });
      setImageLoadingStates(initialStates);
    }
  }, [currentWeekdayData]);

  // 动态样式 - 使用主题颜色
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
    },
    weekdayContainer: {
      backgroundColor: theme.colors.surface,
      paddingVertical: 12,
      marginBottom: 8,
      elevation: 2,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    weekdayButton: {
      marginHorizontal: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: 'center',
      minWidth: 70,
    },
    weekdayButtonSelected: {
      backgroundColor: theme.colors.primary,
    },
    weekdayText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: theme.colors.onSurfaceVariant,
    },
    weekdayTextSelected: {
      color: theme.colors.onPrimary,
    },
    weekdayCountText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginTop: 2,
      opacity: 0.7,
    },
    weekdayCountTextSelected: {
      color: theme.colors.onPrimary,
      opacity: 1,
    },
    animeCard: {
      width: CARD_WIDTH,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 16,
      marginHorizontal: 4,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    animeTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: 6,
      lineHeight: 18,
    },
    animeDate: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      marginBottom: 8,
    },
    animeRating: {
      fontSize: 12,
      color: theme.colors.tertiary,
      fontWeight: '500',
    },
    animeCollection: {
      fontSize: 12,
      color: theme.colors.primary,
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
      color: theme.colors.onSurfaceVariant,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      opacity: 0.7,
    },
    // Shimmer相关样式
    imageContainer: {
      width: '100%',
      height: CARD_WIDTH * 1.4,
    },
    shimmerPlaceholder: {
      width: '100%',
      height: CARD_WIDTH * 1.4,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
  }), [theme]);

  // 渲染星期选择器 - 使用useMemo缓存组件
  const renderWeekdaySelector = useMemo(() => (
    <View style={dynamicStyles.weekdayContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {scheduleData.map((item) => (
          <TouchableOpacity
            key={item.weekday.id}
            style={[
              dynamicStyles.weekdayButton,
              selectedWeekday === item.weekday.id && dynamicStyles.weekdayButtonSelected
            ]}
            onPress={() => setSelectedWeekday(item.weekday.id)}
          >
            <Text style={[
              dynamicStyles.weekdayText,
              selectedWeekday === item.weekday.id && dynamicStyles.weekdayTextSelected
            ]}>
              {item.weekday.cn}
            </Text>
            <Text style={[
              dynamicStyles.weekdayCountText,
              selectedWeekday === item.weekday.id && dynamicStyles.weekdayCountTextSelected
            ]}>
              {item.items.length}部
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  ), [scheduleData, selectedWeekday, dynamicStyles]);

  // 渲染动漫卡片 - 使用useCallback避免重复渲染
  const renderAnimeCard = useCallback(({item}: {item: AnimeItem}) => (
    <TouchableOpacity style={dynamicStyles.animeCard}>
      <View style={dynamicStyles.imageContainer}>
        {/* 条件渲染：加载时显示Shimmer，否则显示图片 */}
        {imageLoadingStates[item.id] ? (
          <ShimmerPlaceholder
            style={dynamicStyles.shimmerPlaceholder}
            shimmerColors={[
              theme.colors.surfaceVariant,
              theme.colors.surface,
              theme.colors.surfaceVariant,
            ]}
          />
        ) : (
          <Image
            source={{uri: item.images.large}}
            style={styles.animeImage}
            resizeMode="cover"
            fadeDuration={300}
            onLoadStart={() => handleImageLoadStart(item.id)}
            onLoadEnd={() => handleImageLoadEnd(item.id)}
          />
        )}
      </View>
      <View style={styles.animeInfo}>
        <Text style={dynamicStyles.animeTitle} numberOfLines={2}>
          {item.name_cn || item.name}
        </Text>
        <Text style={dynamicStyles.animeDate}>
          播出：{item.air_date}
        </Text>
        <View style={styles.animeStats}>
          {item.rating && (
            <Text style={dynamicStyles.animeRating}>
              ⭐ {item.rating.score.toFixed(1)}
            </Text>
          )}
          {item.collection && (
            <Text style={dynamicStyles.animeCollection}>
              👥 {formatCollectionCount(item.collection.doing)}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  ), [
    formatCollectionCount,
    dynamicStyles,
    imageLoadingStates,
    handleImageLoadStart,
    handleImageLoadEnd,
    theme.colors
  ]);

  // 渲染内容
  const renderContent = () => {
    if (loading) {
      return (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={dynamicStyles.loadingText}>加载中...</Text>
        </View>
      );
    }

    if (scheduleData.length === 0) {
      return (
        <View style={dynamicStyles.emptyContainer}>
          <Text style={dynamicStyles.emptyText}>暂无新番时间表数据</Text>
        </View>
      );
    }

    return (
      <View style={dynamicStyles.contentContainer}>
        {renderWeekdaySelector}
        <FlatList
          data={currentWeekdayData}
          renderItem={renderAnimeCard}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.animeList}
          showsVerticalScrollIndicator={false}
          // 性能优化配置
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={8}
          windowSize={10}
          ListEmptyComponent={
            <View style={dynamicStyles.emptyContainer}>
              <Text style={dynamicStyles.emptyText}>今日暂无新番</Text>
            </View>
          }
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={dynamicStyles.container}>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  animeList: {
    padding: 16,
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
  animeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
