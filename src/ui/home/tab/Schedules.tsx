import React, {useCallback, useEffect, useMemo, useState} from 'react';
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
import AnimeDetail from '../../animedetail/AnimeDetail';

// 创建Shimmer组件
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const {width} = Dimensions.get('window');

// 动态计算卡片布局参数
const MIN_CARD_WIDTH = 150; // 最小卡片宽度
const CARD_MARGIN = 16; // 卡片间距
const CONTAINER_PADDING = 32; // 容器左右内边距总和

// 计算每行卡片数量
const NUM_COLUMNS = Math.floor((width - CONTAINER_PADDING) / (MIN_CARD_WIDTH + CARD_MARGIN));
// 计算实际卡片宽度
const CARD_WIDTH = (width - CONTAINER_PADDING - (NUM_COLUMNS - 1) * CARD_MARGIN) / NUM_COLUMNS;

export default function Schedules() {
  const theme = useTheme();
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false); // 数据是否已加载
  const [error, setError] = useState<string | null>(null); // 错误状态
  
  // 添加页面状态管理
  const [showDetail, setShowDetail] = useState(false);
  const [selectedAnimeId, setSelectedAnimeId] = useState<number | null>(null);

  //获取当前星期
  const getCurrentWeekday = () => {
    const today = new Date();
    const day = today.getDay(); // 0-6分别表示星期天到星期六
    return day === 0 ? 7 : day; // 星期天为7
  };
  //默认选择当前星期
  const [selectedWeekday, setSelectedWeekday] = useState<number>(getCurrentWeekday());

  // 图片加载状态管理
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});

  // 获取新番时间表数据 - 使用useCallback避免重复创建
  const fetchScheduleData = useCallback(async (force: boolean = false) => {
    // 如果数据已加载且不为空，且不是强制刷新，则不重复请求
    if (!force && dataLoaded && scheduleData.length > 0) {
      console.log('数据已存在，跳过请求');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 调用API获取数据
      const data = await animeService.getSchedule();
      setScheduleData(data);
      setDataLoaded(true);
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

  // 处理图片加载错误
  const handleImageLoadError = useCallback((itemId: number) => {
    console.warn(`图片加载失败: ${itemId}`);
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
      marginBottom: 12,
      marginHorizontal: CARD_MARGIN / 2,
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
    // FlatList 样式
    animeList: {
      padding: 16,
      paddingHorizontal: 16,
    },
    row: {
      justifyContent: 'space-between',
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

  // 处理卡片点击
  const handleAnimeCardPress = useCallback((animeId: number) => {
    console.log('🎯 点击动漫卡片，ID:', animeId);
    setSelectedAnimeId(animeId);
    setShowDetail(true);
  }, []);

  // 返回列表
  const handleBackToList = useCallback(() => {
    console.log('🔙 返回动漫列表');
    setShowDetail(false);
    setSelectedAnimeId(null);
  }, []);

  // 渲染动漫卡片 - 使用useCallback避免重复渲染
  const renderAnimeCard = useCallback(({item}: {item: AnimeItem}) => (
    <TouchableOpacity 
      style={dynamicStyles.animeCard}
      onPress={() => handleAnimeCardPress(item.id)}
    >
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
          style={dynamicStyles.animeImage}
          resizeMode="cover"
          onLoadStart={() => handleImageLoadStart(item.id)}
          onLoadEnd={() => handleImageLoadEnd(item.id)}
          onError={() => handleImageLoadError(item.id)}
        />
      </View>
      <View style={dynamicStyles.animeInfo}>
        <Text style={dynamicStyles.animeTitle} numberOfLines={2}>
          {item.name_cn || item.name}
        </Text>
        <Text style={dynamicStyles.animeDate}>
          播出：{item.air_date}
        </Text>
        <View style={dynamicStyles.animeStats}>
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
    handleAnimeCardPress,
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
          numColumns={NUM_COLUMNS}
          contentContainerStyle={dynamicStyles.animeList}
          columnWrapperStyle={NUM_COLUMNS > 1 ? dynamicStyles.row : undefined}
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
      {showDetail && selectedAnimeId ? (
        <AnimeDetail 
          id={selectedAnimeId}
          onBack={handleBackToList}
          showBackButton={true}
        />
      ) : (
        renderContent()
      )}
    </SafeAreaView>
  );
}
