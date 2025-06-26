import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
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
import FastImage from 'react-native-fast-image';
import animeService, {AnimeItem, ScheduleItem} from '../../../api/bangumi/anime/animeService.ts';
import {useAppNavigation} from '../../../navigation';
import {calculateAnimeCardLayout} from '../../../util/layoutUtils.ts';

// 创建Shimmer组件
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

// 布局配置常量
const LAYOUT_CONFIG = {
  MIN_CARD_WIDTH: 120,     // 最小卡片宽度
  CARD_MARGIN: 8,          // 卡片间距
  CONTAINER_PADDING: 16,   // 容器左右内边距总和
  ASPECT_RATIO: 3 / 4,     // 卡片宽高比（3:4，接近海报比例）
};

export default function Schedules() {
  const theme = useTheme();
  const navigation = useAppNavigation();

  // 使用布局工具计算参数
  const layoutParams = useMemo(() => {
    return calculateAnimeCardLayout(
      LAYOUT_CONFIG.MIN_CARD_WIDTH,
      LAYOUT_CONFIG.CARD_MARGIN,
      LAYOUT_CONFIG.CONTAINER_PADDING,
      LAYOUT_CONFIG.ASPECT_RATIO
    );
  }, []);

  // 状态管理
  const [scheduleData, setScheduleData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadingStates, setImageLoadingStates] = useState<{[key: string]: boolean}>({});

  // 获取当前星期
  const getCurrentWeekday = () => {
    const today = new Date();
    const day = today.getDay(); // 0-6分别表示星期天到星期六
    return day === 0 ? 7 : day; // 星期天为7
  };

  const [selectedWeekday, setSelectedWeekday] = useState<number>(getCurrentWeekday());

  // 获取新番时间表数据
  const fetchScheduleData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 开始获取新番时间表数据...');

      const data = await animeService.getSchedule();
      console.log('✅ 新番时间表数据获取成功:', data);

      setScheduleData(data);
    } catch (err) {
      console.error('❌ 获取新番时间表失败:', err);
      setError('获取新番时间表失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  }, []);

  // 组件挂载时获取数据
  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);

  // 处理卡片点击事件
  const handleCardPress = useCallback((item: AnimeItem) => {
    console.log('🎯 点击卡片，跳转到详情页:', {
      id: item.id,
      title: item.name_cn || item.name
    });

    navigation.navigateToAnimeDetail(item.id, item.name_cn || item.name);
  }, [navigation]);

  // 图片加载处理函数
  const handleImageLoadStart = useCallback((itemId: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: true
    }));
  }, []);

  const handleImageLoad = useCallback((itemId: number) => {
    // 图片加载完成
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  }, []);

  const handleImageLoadError = useCallback((itemId: number) => {
    console.warn(`图片加载失败: ${itemId}`);
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: false
    }));
  }, []);

  // 获取当前选中星期的数据
  const currentWeekdayData = useMemo((): AnimeItem[] => {
    const currentWeekday = scheduleData.find(item => item.weekday.id === selectedWeekday);
    return currentWeekday?.items || [];
  }, [scheduleData, selectedWeekday]);

  // 当数据更新时，初始化所有图片的加载状态
  useEffect(() => {
    const newLoadingStates: {[key: string]: boolean} = {};
    currentWeekdayData.forEach(item => {
      if (imageLoadingStates[item.id] === undefined) {
        newLoadingStates[item.id] = true;
      }
    });

    if (Object.keys(newLoadingStates).length > 0) {
      setImageLoadingStates(prev => ({
        ...prev,
        ...newLoadingStates
      }));
    }
  }, [currentWeekdayData]);

  // 动态样式
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      marginTop: 16,
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
    },
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
    },
    retryButtonText: {
      color: theme.colors.onPrimary,
      fontSize: 16,
      fontWeight: '600',
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
      width: layoutParams.cardWidth,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginBottom: 16,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      height: layoutParams.cardHeight,
      borderRadius: 12,
      overflow: 'hidden',
    },
    shimmerPlaceholder: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: 12,
      zIndex: 10,
      backgroundColor: theme.colors.surfaceVariant,
    },
    animeImage: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
    },
    titleOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderBottomLeftRadius: 13,
      borderBottomRightRadius: 13,
    },
    animeTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 4,
      lineHeight: 24,
    },
    animeList: {
      padding: 8,
    },
    row: {
      justifyContent: 'space-between',
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
  }), [theme, layoutParams]);

  // 渲染星期选择器
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

  // 渲染动漫卡片
  const renderAnimeCard = useCallback(({item}: {item: AnimeItem}) => {
    // 检查加载状态，默认为true（加载中）
    const isLoading = imageLoadingStates[item.id];
    const imageUrl = item.images.large;

    return (
      <TouchableOpacity
        style={dynamicStyles.animeCard}
        onPress={() => handleCardPress(item)}
        activeOpacity={0.8}
      >
        <View style={dynamicStyles.imageContainer}>
          {/* 图片 */}
          <FastImage
            source={{uri: imageUrl}}
            style={dynamicStyles.animeImage}
            resizeMode="cover"
            onLoadStart={() => handleImageLoadStart(item.id)}
            onLoad={() => handleImageLoad(item.id)}
            onError={() => handleImageLoadError(item.id)}
          />

          {/* 图片加载时显示Shimmer - 放在图片后面，通过条件渲染控制 */}
          {isLoading && (
            <ShimmerPlaceholder
              style={dynamicStyles.shimmerPlaceholder}
              shimmerColors={[
                theme.colors.surfaceVariant,
                theme.colors.surface,
                theme.colors.surfaceVariant,
              ]}
            />
          )}

          {/* 标题覆盖层 */}
          <View style={dynamicStyles.titleOverlay}>
            <Text style={dynamicStyles.animeTitle} numberOfLines={2}>
              {item.name_cn || item.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [
    dynamicStyles,
    imageLoadingStates,
    handleCardPress,
    handleImageLoadStart,
    handleImageLoad,
    handleImageLoadError,
    theme.colors,
  ]);

  // 渲染错误状态
  const renderErrorState = () => (
    <View style={dynamicStyles.errorContainer}>
      <Text style={dynamicStyles.errorIcon}>📡</Text>
      <Text style={dynamicStyles.errorTitle}>加载失败</Text>
      <Text style={dynamicStyles.errorMessage}>
        {error || '获取新番时间表失败，请检查网络连接后重试'}
      </Text>
      <TouchableOpacity style={dynamicStyles.retryButton} onPress={fetchScheduleData}>
        <Text style={dynamicStyles.retryButtonText}>🔄 重试</Text>
      </TouchableOpacity>
    </View>
  );

  // 主渲染函数
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
          numColumns={layoutParams.numColumns}
          contentContainerStyle={dynamicStyles.animeList}
          columnWrapperStyle={layoutParams.numColumns > 1 ? dynamicStyles.row : undefined}
          showsVerticalScrollIndicator={false}
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
