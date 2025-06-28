import React, {useState, useEffect, useMemo} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from 'react-native';
import {useTheme, Chip, Card} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import animeService from '../../api/bangumi/anime/animeService.ts';
import {AnimeDetailScreenProps} from '../../types/navigation';
import {useAppNavigation} from '../../navigation';
import {createAnimeDetailStyles} from './style';
import AnimatedHeaderPage from '../../components/AnimatedHeaderPage';
import {TabView} from 'react-native-tab-view';

export default function AnimeDetail({route}: AnimeDetailScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {goBack, canGoBack} = useAppNavigation();
  const {id, title} = route.params;

  const [animeDetail, setAnimeDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenData, setScreenData] = useState(() => Dimensions.get('window'));
  const [showAllTags, setShowAllTags] = useState(false);
  const [showFullSummary, setShowFullSummary] = useState(false);

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
      coverImageWidth: isTablet
        ? 200
        : isLargePhone
        ? 170
        : isSmallPhone
        ? 130
        : 150,
      coverImageHeight: isTablet
        ? 267
        : isLargePhone
        ? 227
        : isSmallPhone
        ? 173
        : 200,
      headerPadding: isTablet ? 24 : isSmallPhone ? 12 : 16,
      titleFontSize: isTablet ? 24 : isLargePhone ? 22 : isSmallPhone ? 18 : 20,
      infoFontSize: isTablet ? 16 : isSmallPhone ? 13 : 14,
      headerMinHeight: isTablet ? 320 : isSmallPhone ? 220 : 260,
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
  const dynamicStyles = useMemo(
    () => createAnimeDetailStyles(theme, screenDimensions),
    [theme, screenDimensions],
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[dynamicStyles.loadingContainer, {paddingTop: insets.top}]}
        edges={[]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={dynamicStyles.loadingText}>加载中...</Text>
      </SafeAreaView>
    );
  }

  if (error || !animeDetail) {
    return (
      <SafeAreaView
        style={[dynamicStyles.errorContainer, {paddingTop: insets.top}]}
        edges={[]}>
        <Text style={dynamicStyles.errorText}>
          {error || '获取动漫详情失败'}
        </Text>
      </SafeAreaView>
    );
  }

  // 页面内容
  const renderContent = () => (
    <>
      {/* 头部信息区域 - 带高斯模糊背景 */}
      <View style={dynamicStyles.headerBackground}>
        {/* 背景图片 */}
        <ImageBackground
          source={{uri: animeDetail.images?.large}}
          style={dynamicStyles.absoluteFill}
          blurRadius={20}
          resizeMode="cover">
          {/* 深色遮罩层 */}
          <View style={dynamicStyles.headerBlurOverlay} />

          {/* 渐变遮罩 */}
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
            style={dynamicStyles.headerGradient}
          />
        </ImageBackground>

        {/* 内容区域 */}
        <View
          style={[
            dynamicStyles.headerContainer,
            {paddingTop: 56 + insets.top},
          ]}>
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
                <Text style={dynamicStyles.title} numberOfLines={2}>
                  {title}
                </Text>
              </View>
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
                <Text style={dynamicStyles.ratingCount} numberOfLines={0}>
                  {formatNumber(animeDetail.rating.total)} 人评价 #
                  {animeDetail.rating.rank}
                </Text>
              </View>
            )}
            <Text style={dynamicStyles.dateText} numberOfLines={0}>
              {animeDetail.date || '播出时间待定'}
            </Text>
            <Text style={dynamicStyles.episodeText} numberOfLines={0}>
              看过 {animeDetail.collection?.collect || 0} (
              {animeDetail.total_episodes || animeDetail.eps || 0}) · 全{' '}
              {animeDetail.total_episodes || animeDetail.eps || 0} 话
            </Text>
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
        <TouchableOpacity
          style={[dynamicStyles.actionButton, dynamicStyles.watchButton]}>
          <Text
            style={[
              dynamicStyles.actionButtonText,
              dynamicStyles.watchButtonText,
            ]}>
            继续观看{' '}
            {String(animeDetail.collection?.collect || 0).padStart(2, '0')} (
            {animeDetail.total_episodes || animeDetail.eps || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* 详细内容 */}
      <View style={dynamicStyles.contentContainer}>
        {/* 简介 */}
        {animeDetail.summary && (
          <>
            <Text style={dynamicStyles.sectionTitle}>简介</Text>
            <Text
              style={dynamicStyles.summaryText}
              numberOfLines={showFullSummary ? undefined : 3}>
              {animeDetail.summary.replace(/\r\n/g, '\n')}
            </Text>
            {animeDetail.summary.length > 100 && (
              <TouchableOpacity
                style={dynamicStyles.showMoreButton}
                onPress={() => setShowFullSummary(!showFullSummary)}>
                <Text style={dynamicStyles.showMoreText}>
                  {showFullSummary ? '收起' : '显示更多'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* 标签 - 使用FlexWrap布局实现自适应宽度 */}
        {animeDetail.tags && animeDetail.tags.length > 0 && (
          <>
            <Text style={dynamicStyles.sectionTitle}>标签</Text>
            <View style={dynamicStyles.tagsContainer}>
              {(showAllTags
                ? animeDetail.tags
                : animeDetail.tags.slice(0, 6)
              ).map((tag: {name: string; count: number}, index: number) => (
                <Chip
                  key={index}
                  mode="flat"
                  compact
                  style={dynamicStyles.tagChip}>
                  {tag.name} ({tag.count})
                </Chip>
              ))}
            </View>
            {animeDetail.tags.length > 6 && (
              <TouchableOpacity
                style={dynamicStyles.showMoreButton}
                onPress={() => setShowAllTags(!showAllTags)}>
                <Text style={dynamicStyles.showMoreText}>
                  {showAllTags ? '收起' : '显示更多'}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* 详细信息 - 使用普通View避免VirtualizedList嵌套 */}
        {animeDetail.infobox && animeDetail.infobox.length > 0 && (
          <>
            <Text style={dynamicStyles.sectionTitle}>详情</Text>
            <View style={dynamicStyles.infoGridContainer}>
              {animeDetail.infobox
                .slice(0, 10)
                .map((item: any, index: number) => (
                  <Card
                    key={index}
                    mode="elevated"
                    style={dynamicStyles.infoCard}>
                    <Text style={dynamicStyles.infoKeyText}>{item.key}</Text>
                    <Text style={dynamicStyles.infoValueText} numberOfLines={3}>
                      {Array.isArray(item.value)
                        ? item.value.map((v: any) => v.v || v).join(', ')
                        : item.value}
                    </Text>
                  </Card>
                ))}
            </View>
          </>
        )}
      </View>
    </>
  );

  return (
    <View style={dynamicStyles.rootContainer}>
      <AnimatedHeaderPage
        title={title}
        showBackButton={canGoBack()}
        onBackPress={goBack}
        scrollThreshold={80}>
        {renderContent()}
      </AnimatedHeaderPage>
    </View>
  );
}
