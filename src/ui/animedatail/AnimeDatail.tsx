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
  Dimensions, SafeAreaView,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';
import animeService from '../../api/bangumi/anime/animeService.ts';
import {AnimeDetailScreenProps} from '../../types/navigation';
import {StatusBarManager, StatusBarConfigs} from '../../components/StatusBarManager';
import {createAnimeDetailStyles} from './style';

export default function AnimeDetail({route}: AnimeDetailScreenProps) {
  const theme = useTheme();
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
  const dynamicStyles = useMemo(() => createAnimeDetailStyles(theme, screenDimensions), [theme, screenDimensions]);

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
      <SafeAreaView style={dynamicStyles.errorContainer}>
        <Text style={dynamicStyles.errorText}>
          {error || '获取动漫详情失败'}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
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
                <View style={dynamicStyles.titleWrapper}>
                <Text style={dynamicStyles.title} numberOfLines={3}>
                  {title}
                </Text>
                  <Text style={dynamicStyles.ratingScore}>
                    {animeDetail.rating.score.toFixed(1)}
                  </Text>
                  <Text style={dynamicStyles.ratingStars}>
                    {getStarRating(animeDetail.rating.score)}
                  </Text>
                </View>
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
    </SafeAreaView>
  );
}
