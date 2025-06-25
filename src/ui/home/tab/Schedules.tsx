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
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import FastImage from 'react-native-fast-image';
import animeService, {AnimeItem, ScheduleItem} from '../../../api/bangumi/animeService';
import {RootStackParamList} from '../../../types/navigation';

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

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Schedules() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  
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

    navigation.navigate('AnimeDetail', {
      id: item.id,
      title: item.name_cn || item.name,
    });
  }, [navigation]);

  // 图片加载处理函数
  const handleImageLoadStart = useCallback((itemId: number) => {
    setImageLoadingStates(prev => ({
      ...prev,
      [itemId]: true
    }));
  }, []);

  const handleImageLoadEnd = useCallback((itemId: number) => {
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

  // 格式化收藏数
  const formatCollectionCount = useCallback((count: number): string => {
    if (count >= 10000) {
      return `${(count / 10000).toFixed(1)}万`;
    }
    return count.toString();
  }, []);

  // 获取当前选中星期的数据
  const currentWeekdayData = useMemo((): AnimeItem[] => {
    const currentWeekday = scheduleData.find(item => item.weekday.id === selectedWeekday);
    return currentWeekday?.items || [];
  }, [scheduleData, selectedWeekday]);

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
      width: CARD_WIDTH,
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
  }), [theme]);

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
    const isLoading = imageLoadingStates[item.id];

    return (
      <TouchableOpacity
        style={dynamicStyles.animeCard}
        onPress={() => handleCardPress(item)}
        activeOpacity={0.8}
      >
        <View style={dynamicStyles.imageContainer}>
          {/* 图片加载时显示Shimmer */}
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
          {/* 图片 - 使用与详情页相同的简单实现 */}
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
    );
  }, [
    dynamicStyles,
    imageLoadingStates,
    handleCardPress,
    handleImageLoadStart,
    handleImageLoadEnd,
    handleImageLoadError,
    formatCollectionCount,
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
          numColumns={NUM_COLUMNS}
          contentContainerStyle={styles.animeList}
          columnWrapperStyle={NUM_COLUMNS > 1 ? styles.row : undefined}
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

const styles = StyleSheet.create({
  animeList: {
    padding: 16,
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
});
