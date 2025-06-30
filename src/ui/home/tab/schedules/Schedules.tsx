import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTheme, Chip} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import FastImage from 'react-native-fast-image';
import {FlatGrid} from 'react-native-super-grid';
import animeService, {AnimeItem, ScheduleItem} from '../../../../api/bangumi/anime/anime.ts';
import {useAppNavigation} from '../../../../navigation';
import {createSchedulesStyles, GRADIENT_CONFIG} from './style.tsx';

// 创建Shimmer组件
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default function Schedules() {
  const theme = useTheme();
  const navigation = useAppNavigation();

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
    // 添加小延迟确保shimmer效果能被看到，避免闪烁
    setTimeout(() => {
      setImageLoadingStates(prev => ({
        ...prev,
        [itemId]: false
      }));
    }, 100);
  }, []);

  const handleImageLoadError = useCallback((itemId: number) => {
    console.warn(`❌ 图片加载失败: ${itemId}`);
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

  // 当数据更新时，重置所有图片的加载状态
  useEffect(() => {
    const newLoadingStates: {[key: string]: boolean} = {};
    currentWeekdayData.forEach(item => {
      newLoadingStates[item.id] = true; // 始终设为加载中状态
    });

    if (Object.keys(newLoadingStates).length > 0) {
      setImageLoadingStates(newLoadingStates); // 直接替换而不是合并，避免旧状态影响
    }
  }, [currentWeekdayData]);

  // 动态样式
  const dynamicStyles = createSchedulesStyles(theme);

  // 渲染紧凑的星期选择器
  const renderWeekdaySelector = useMemo(() => {
    if (scheduleData.length === 0) return null;

    return (
      <View style={dynamicStyles.weekdayContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={dynamicStyles.weekdayScrollContent}
        >
          {scheduleData.map((item) => (
            <Chip
              key={item.weekday.id}
              selected={selectedWeekday === item.weekday.id}
              onPress={() => setSelectedWeekday(item.weekday.id)}
              style={[
                dynamicStyles.weekdayChip,
                selectedWeekday === item.weekday.id && dynamicStyles.weekdayChipSelected
              ]}
              textStyle={[
                dynamicStyles.weekdayChipText,
                selectedWeekday === item.weekday.id && dynamicStyles.weekdayChipTextSelected
              ]}
              compact
              mode="outlined"
            >
              {item.weekday.cn} {item.items.length}部
            </Chip>
          ))}
        </ScrollView>
      </View>
    );
  }, [scheduleData, selectedWeekday, dynamicStyles]);



  // 渲染动漫卡片
  const renderAnimeCard = useCallback(({item}: {item: AnimeItem}) => {
    // 检查加载状态，默认为true（加载中）
    const isLoading = imageLoadingStates[item.id]; // 只有明确设置为false时才不显示加载状态
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

          {/* 渐变蒙版 - 从透明到半透明黑色的自然过渡 */}
          <LinearGradient
            colors={GRADIENT_CONFIG.colors}
            locations={GRADIENT_CONFIG.locations}
            style={dynamicStyles.gradientOverlay}
            pointerEvents="none"
          />

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
        <FlatGrid
          itemDimension={100} // 最小卡片宽度，自动计算列数
          data={currentWeekdayData}
          spacing={8} // 卡片间距
          renderItem={renderAnimeCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          maxItemsPerRow={6} // 最大列数限制
          staticDimension={undefined} // 让网格自适应容器宽度
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={8}
          windowSize={10}
          scrollEventThrottle={20}//优化滑动响应，减少与TabView冲突
          directionalLockEnabled={true} // 启用方向锁定
          alwaysBounceVertical={false}
          bounces={false}
          overScrollMode="never"
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
