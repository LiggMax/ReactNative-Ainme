import React, {useEffect, useState, useMemo} from 'react';
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import {useAppNavigation} from '../../navigation';
import animeService from '../../api/bangumi/anime/animeService.ts';
import {AnimeDetailScreenProps} from '../../types/navigation';
import {StatusBarManager, StatusBarConfigs} from '../../components/StatusBarManager';

export default function AnimeDetail({route}: AnimeDetailScreenProps) {
  const theme = useTheme();
  const navigation = useAppNavigation();
  const {id, title} = route.params;

  const [animeDetail, setAnimeDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenData, setScreenData] = useState(() => Dimensions.get('window'));

  // 监听屏幕尺寸变化
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  // 获取屏幕尺寸并计算响应式布局参数
  const screenDimensions = useMemo(() => {
    const {width, height} = screenData;
    const isTablet = width >= 768; // 平板判断
    const isLargePhone = width >= 414; // 大屏手机判断
    const isSmallPhone = width < 360; // 小屏手机判断

    return {
      width,
      height,
      isTablet,
      isLargePhone,
      isSmallPhone,
      // 根据屏幕宽度计算布局参数
      coverImageWidth: isTablet ? 160 : isLargePhone ? 140 : isSmallPhone ? 100 : 120,
      coverImageHeight: isTablet ? 213 : isLargePhone ? 187 : isSmallPhone ? 133 : 160,
      headerPadding: isTablet ? 24 : isSmallPhone ? 12 : 16,
      titleFontSize: isTablet ? 24 : isLargePhone ? 22 : isSmallPhone ? 18 : 20,
      infoFontSize: isTablet ? 16 : isSmallPhone ? 13 : 14,
      headerMinHeight: isTablet ? 300 : isSmallPhone ? 200 : 240,
    };
  }, [screenData]);

  // 获取详情数据
  const getAnimeDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔍 开始获取动漫详情，ID:', id);
      const detail = await animeService.getAnimeDetailService(id);
      console.log('✅ 动漫详情获取成功:', detail);

      setAnimeDetail(detail);
    } catch (err) {
      console.error('❌ 获取动漫详情失败:', err);
      setError('获取动漫详情失败，请稍后重试');
      Alert.alert('错误', '获取动漫详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAnimeDetail();
  }, [id]);

  // 格式化收藏数
  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toString();
  };

  // 获取评分星级
  const getStarRating = (score: number) => {
    const fullStars = Math.floor(score / 2);
    const hasHalfStar = score % 2 >= 1;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
      stars += '★';
    }
    if (hasHalfStar) {
      stars += '☆';
    }
    while (stars.length < 5) {
      stars += '☆';
    }
    return stars;
  };

  // 动态样式
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
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
    errorText: {
      fontSize: 16,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: 16,
    },
    scrollContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerBackground: {
      width: '100%',
      minHeight: screenDimensions.headerMinHeight,
      backgroundColor: theme.colors.background,
    },
    headerBlurOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    headerGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    headerContainer: {
      flexDirection: screenDimensions.isSmallPhone ? 'column' : 'row',
      padding: screenDimensions.headerPadding,
      paddingTop: 40,
      minHeight: screenDimensions.headerMinHeight,
      position: 'relative',
      alignItems: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
    },
    backButton: {
      position: 'absolute',
      top: screenDimensions.isTablet ? 60 : 50,
      left: screenDimensions.headerPadding,
      width: screenDimensions.isTablet ? 48 : 40,
      height: screenDimensions.isTablet ? 48 : 40,
      borderRadius: screenDimensions.isTablet ? 24 : 20,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    backButtonText: {
      color: '#FFFFFF',
      fontSize: screenDimensions.isTablet ? 24 : 18,
      fontWeight: 'bold',
    },
    coverImage: {
      width: screenDimensions.coverImageWidth,
      height: screenDimensions.coverImageHeight,
      borderRadius: 8,
      backgroundColor: theme.colors.surfaceVariant,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
      marginBottom: screenDimensions.isSmallPhone ? 16 : 0,
    },
    infoContainer: {
      flex: 1,
      marginLeft: screenDimensions.isSmallPhone ? 0 : 16,
      justifyContent: 'space-between',
      alignItems: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
    },
    titleContainer: {
      flex: 1,
      alignItems: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
    },
    title: {
      fontSize: screenDimensions.titleFontSize,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 6,
      lineHeight: screenDimensions.titleFontSize * 1.3,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3,
      textAlign: screenDimensions.isSmallPhone ? 'center' : 'left',
    },
    originalTitle: {
      fontSize: screenDimensions.infoFontSize,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: 12,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      textAlign: screenDimensions.isSmallPhone ? 'center' : 'left',
    },
    dateText: {
      fontSize: screenDimensions.infoFontSize,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 4,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      textAlign: screenDimensions.isSmallPhone ? 'center' : 'left',
    },
    episodeText: {
      fontSize: screenDimensions.infoFontSize,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 12,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      textAlign: screenDimensions.isSmallPhone ? 'center' : 'left',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      justifyContent: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
    },
    ratingScore: {
      fontSize: screenDimensions.isTablet ? 20 : screenDimensions.isSmallPhone ? 16 : 18,
      fontWeight: 'bold',
      color: '#FFD700',
      marginRight: 8,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3,
    },
    ratingStars: {
      fontSize: screenDimensions.isTablet ? 18 : screenDimensions.isSmallPhone ? 14 : 16,
      color: '#FFD700',
      marginRight: 4,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
    },
    ratingCount: {
      fontSize: screenDimensions.isTablet ? 14 : screenDimensions.isSmallPhone ? 11 : 12,
      color: 'rgba(255, 255, 255, 0.8)',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
    },
    collectionContainer: {
      flexDirection: screenDimensions.isSmallPhone ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
    },
    collectionItem: {
      marginRight: screenDimensions.isSmallPhone ? 0 : 16,
      marginBottom: screenDimensions.isSmallPhone ? 8 : 0,
      alignItems: 'center',
    },
    collectionNumber: {
      fontSize: screenDimensions.isTablet ? 18 : screenDimensions.isSmallPhone ? 14 : 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3,
    },
    collectionLabel: {
      fontSize: screenDimensions.isTablet ? 14 : screenDimensions.isSmallPhone ? 11 : 12,
      color: 'rgba(255, 255, 255, 0.8)',
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
    },
    actionContainer: {
      flexDirection: 'row',
      padding: screenDimensions.headerPadding,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderTopColor: theme.colors.outline,
    },
    actionButton: {
      flex: 1,
      paddingVertical: screenDimensions.isTablet ? 16 : 12,
      marginHorizontal: 4,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    watchButton: {
      backgroundColor: theme.colors.primary,
    },
    favoriteButton: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    actionButtonText: {
      fontSize: screenDimensions.isTablet ? 16 : 14,
      fontWeight: '600',
    },
    watchButtonText: {
      color: theme.colors.onPrimary,
    },
    favoriteButtonText: {
      color: theme.colors.onSurfaceVariant,
    },
    contentContainer: {
      padding: screenDimensions.headerPadding,
      maxWidth: screenDimensions.isTablet ? 800 : '100%',
      alignSelf: screenDimensions.isTablet ? 'center' : 'stretch',
    },
    sectionTitle: {
      fontSize: screenDimensions.isTablet ? 20 : 16,
      fontWeight: '600',
      color: theme.colors.onSurface,
      marginBottom: 12,
    },
    summaryText: {
      fontSize: screenDimensions.isTablet ? 16 : 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: screenDimensions.isTablet ? 24 : 20,
      marginBottom: 24,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 24,
      justifyContent: screenDimensions.isTablet ? 'flex-start' : 'flex-start',
    },
    tag: {
      backgroundColor: theme.colors.surfaceVariant,
      paddingHorizontal: screenDimensions.isTablet ? 16 : 12,
      paddingVertical: screenDimensions.isTablet ? 8 : 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      fontSize: screenDimensions.isTablet ? 14 : 12,
      color: theme.colors.onSurfaceVariant,
    },
    infoGrid: {
      marginBottom: 24,
    },
    infoRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    infoLabel: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      width: 80,
      fontWeight: '500',
    },
    infoValue: {
      fontSize: 14,
      color: theme.colors.onSurface,
      flex: 1,
    },
  }), [theme, screenDimensions]);

  if (loading) {
    return (
      <View style={dynamicStyles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={dynamicStyles.loadingText}>加载中...</Text>
      </View>
    );
  }

  if (error || !animeDetail) {
    return (
      <View style={dynamicStyles.errorContainer}>
        <Text style={dynamicStyles.errorText}>
          {error || '获取动漫详情失败'}
        </Text>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <StatusBarManager {...StatusBarConfigs.detail} />
      <ScrollView
        style={dynamicStyles.scrollContainer}
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
      >
        {/* 头部信息区域 - 带高斯模糊背景 */}
        <View style={dynamicStyles.headerBackground}>
          {/* 背景图片 */}
          <ImageBackground
            source={{uri: animeDetail.images?.large}}
            style={StyleSheet.absoluteFillObject}
            blurRadius={20}
            resizeMode="cover"
          >
            {/* 深色遮罩层 */}
            <View style={dynamicStyles.headerBlurOverlay} />

            {/* 渐变遮罩 */}
            <LinearGradient
              colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
              style={dynamicStyles.headerGradient}
            />
          </ImageBackground>

          {/* 内容区域 */}
          <View style={dynamicStyles.headerContainer}>
            {/* 封面图片 */}
            <FastImage
              source={{uri: animeDetail.images?.large}}
              style={dynamicStyles.coverImage}
              resizeMode="cover"
            />

            {/* 基本信息 */}
            <View style={dynamicStyles.infoContainer}>
              <View style={dynamicStyles.titleContainer}>
                <Text style={dynamicStyles.title} numberOfLines={3}>
                  {animeDetail.name_cn || animeDetail.name || title}
                </Text>
                {animeDetail.name && animeDetail.name_cn && (
                  <Text style={dynamicStyles.originalTitle} numberOfLines={2}>
                    {animeDetail.name}
                  </Text>
                )}
                <Text style={dynamicStyles.dateText}>
                  {animeDetail.date || '播出时间待定'}
                </Text>
                <Text style={dynamicStyles.episodeText}>
                  看过 {animeDetail.collection?.collect || 0} ({animeDetail.total_episodes || animeDetail.eps || 0}) · 全 {animeDetail.total_episodes || animeDetail.eps || 0} 话
                </Text>
              </View>

              {/* 评分信息 */}
              {animeDetail.rating && (
                <View style={dynamicStyles.ratingContainer}>
                  <Text style={dynamicStyles.ratingScore}>
                    {animeDetail.rating.score.toFixed(1)}
                  </Text>
                  <Text style={dynamicStyles.ratingStars}>
                    {getStarRating(animeDetail.rating.score)}
                  </Text>
                  <Text style={dynamicStyles.ratingCount}>
                    {formatNumber(animeDetail.rating.total)} 人评价 #{animeDetail.rating.rank}
                  </Text>
                </View>
              )}

              {/* 收藏数据 */}
              {animeDetail.collection && (
                <View style={dynamicStyles.collectionContainer}>
                  <View style={dynamicStyles.collectionItem}>
                    <Text style={dynamicStyles.collectionNumber}>
                      {formatNumber(animeDetail.collection.collect || 0)}
                    </Text>
                    <Text style={dynamicStyles.collectionLabel}>收藏</Text>
                  </View>
                  <View style={dynamicStyles.collectionItem}>
                    <Text style={dynamicStyles.collectionNumber}>
                      {formatNumber(animeDetail.collection.doing || 0)}
                    </Text>
                    <Text style={dynamicStyles.collectionLabel}>在看</Text>
                  </View>
                  <View style={dynamicStyles.collectionItem}>
                    <Text style={dynamicStyles.collectionNumber}>
                      {formatNumber(animeDetail.collection.wish || 0)}
                    </Text>
                    <Text style={dynamicStyles.collectionLabel}>想看</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={dynamicStyles.actionContainer}>
          <TouchableOpacity style={[dynamicStyles.actionButton, dynamicStyles.watchButton]}>
            <Text style={[dynamicStyles.actionButtonText, dynamicStyles.watchButtonText]}>
              继续观看 {String(animeDetail.collection?.collect || 0).padStart(2, '0')} ({animeDetail.total_episodes || animeDetail.eps || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* 详细内容 */}
        <View style={dynamicStyles.contentContainer}>
          {/* 简介 */}
          {animeDetail.summary && (
            <>
              <Text style={dynamicStyles.sectionTitle}>简介</Text>
              <Text style={dynamicStyles.summaryText}>
                {animeDetail.summary.replace(/\r\n/g, '\n')}
              </Text>
            </>
          )}

          {/* 标签 */}
          {animeDetail.meta_tags && animeDetail.meta_tags.length > 0 && (
            <>
              <Text style={dynamicStyles.sectionTitle}>标签</Text>
              <View style={dynamicStyles.tagsContainer}>
                {animeDetail.meta_tags.map((tag: string, index: number) => (
                  <View key={index} style={dynamicStyles.tag}>
                    <Text style={dynamicStyles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* 详细信息 */}
          {animeDetail.infobox && animeDetail.infobox.length > 0 && (
            <>
              <Text style={dynamicStyles.sectionTitle}>详情</Text>
              <View style={dynamicStyles.infoGrid}>
                {animeDetail.infobox.slice(0, 10).map((info: any, index: number) => (
                  <View key={index} style={dynamicStyles.infoRow}>
                    <Text style={dynamicStyles.infoLabel}>{info.key}:</Text>
                    <Text style={dynamicStyles.infoValue}>
                      {Array.isArray(info.value)
                        ? info.value.map((v: any) => v.v || v).join(', ')
                        : info.value
                      }
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
StyleSheet.create({});
