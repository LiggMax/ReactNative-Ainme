import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
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
import FastImage from 'react-native-fast-image'
import animeService, {AnimeItem, ScheduleItem} from '../../../api/bangumi/animeService';

// 创建Shimmer组件
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const {width} = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 每行2个卡片，考虑边距

export default function Schedules() {
  const theme = useTheme();
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeekday, setSelectedWeekday] = useState<number>(1); // 默认选择星期一
  const [dataLoaded, setDataLoaded] = useState(false); // 数据是否已加载
  const [error, setError] = useState<string | null>(null); // 错误状态

  // 图片加载状态管理
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});
  const imageLoadingTimeouts = useRef<{[key: string]: NodeJS.Timeout}>({});

  // 获取新番时间表数据 - 使用useCallback避免重复创建
  const fetchScheduleData = useCallback(async (force: boolean = false) => {
    // 如果数据已加载且不为空，且不是强制刷新，则不重复请求
    if (!force && dataLoaded && scheduleData.length > 0) {
      console.log('数据已存在，跳过请求');
      return;
    }

    try {
      setLoading(true);
      setError(null); // 清除之前的错误

      console.log('开始获取新番时间表数据...');
      // 调用真实API获取数据
      const data = await animeService.getSchedule();
      setScheduleData(data);
      setDataLoaded(true);
      console.log('新番时间表数据获取成功');
    } catch (error) {
      console.error('获取新番时间表失败:', error);
      setError('获取新番时间表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  }, [dataLoaded, scheduleData.length]);

  // 重试函数
  const handleRetry = useCallback(() => {
    setDataLoaded(false);
    setError(null);
    fetchScheduleData(true); // 强制刷新
  }, [fetchScheduleData]);

  // 组件加载时获取数据 - 只在首次加载时执行
  useEffect(() => {
    // 添加延迟，确保组件完全挂载后再请求数据
    const timer = setTimeout(() => {
      if (!dataLoaded) {
        console.log('Schedules组件首次加载，开始获取数据');
        fetchScheduleData();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []); // 空依赖数组，确保只在首次挂载时执行

  // 组件卸载时清理超时器
  useEffect(() => {
    return () => {
      // 清理所有图片加载超时器
      Object.values(imageLoadingTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      imageLoadingTimeouts.current = {};
    };
  }, []);

  // 当数据更新时清理图片加载状态
  useEffect(() => {
    if (scheduleData.length > 0) {
      // 清空之前的图片加载状态，让图片自然触发加载事件
      setImageLoadingStates({});
      // 清理所有超时器
      Object.values(imageLoadingTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
      imageLoadingTimeouts.current = {};
    }
  }, [scheduleData]);

  // 处理图片加载开始
  const handleImageLoadStart = useCallback((itemId: number) => {
    console.log(`图片开始加载: ${itemId}`);
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: true
    }));

    // 设置超时器，如果5秒后还没有收到加载完成事件，强制设置为完成
    if (imageLoadingTimeouts.current[itemId]) {
      clearTimeout(imageLoadingTimeouts.current[itemId]);
    }

    imageLoadingTimeouts.current[itemId] = setTimeout(() => {
      console.warn(`图片加载超时，强制设置为完成: ${itemId}`);
      setImageLoadingStates(prev => ({
        ...prev,
        [itemId]: false
      }));
      delete imageLoadingTimeouts.current[itemId];
    }, 5000);
  }, []);

  // 处理图片加载完成
  const handleImageLoadEnd = useCallback((itemId: number) => {
    console.log(`图片加载完成: ${itemId}`);

    // 清理超时器
    if (imageLoadingTimeouts.current[itemId]) {
      clearTimeout(imageLoadingTimeouts.current[itemId]);
      delete imageLoadingTimeouts.current[itemId];
    }

    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  }, []);

  // 处理图片加载错误
  const handleImageLoadError = useCallback((itemId: number) => {
    console.warn(`图片加载失败: ${itemId}`);

    // 清理超时器
    if (imageLoadingTimeouts.current[itemId]) {
      clearTimeout(imageLoadingTimeouts.current[itemId]);
      delete imageLoadingTimeouts.current[itemId];
    }

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
    // 错误状态样式
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 32,
    },
    errorIcon: {
      fontSize: 48,
      marginBottom: 16,
    },
    errorTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: 8,
      textAlign: 'center',
    },
    errorMessage: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      lineHeight: 20,
      marginBottom: 24,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
    },
    retryButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: 8,
    },
    // Shimmer相关样式
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: CARD_WIDTH * 1.4,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      overflow: 'hidden',
    },
    shimmerPlaceholder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      zIndex: 2,
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
        {/* 图片加载时显示Shimmer覆盖层 */}
        {imageLoadingStates[item.id] && (
          <ShimmerPlaceholder
            style={dynamicStyles.shimmerPlaceholder}
            shimmerColors={[
              theme.colors.surfaceVariant,
              theme.colors.surface,
              theme.colors.surfaceVariant,
            ]}
          />
        )}
        {/* 实际图片 */}
        <FastImage
          source={{uri: item.images.large}}
          style={styles.animeImage}
          resizeMode="cover"
          onLoadStart={() => handleImageLoadStart(item.id)}
          onLoadEnd={() => handleImageLoadEnd(item.id)}
          onError={() => handleImageLoadError(item.id)}
        />
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
    handleImageLoadError,
    theme.colors
  ]);

  // 渲染错误状态
  const renderErrorState = () => (
    <View style={dynamicStyles.errorContainer}>
      <Text style={dynamicStyles.errorIcon}>📡</Text>
      <Text style={dynamicStyles.errorTitle}>加载失败</Text>
      <Text style={dynamicStyles.errorMessage}>
        {error || '获取新番时间表失败，请检查网络连接后重试'}
      </Text>
      <TouchableOpacity style={dynamicStyles.retryButton} onPress={handleRetry}>
        <Text style={dynamicStyles.retryButtonText}>🔄 重试</Text>
      </TouchableOpacity>
    </View>
  );

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

    if (error) {
      return renderErrorState();
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
