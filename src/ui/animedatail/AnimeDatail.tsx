import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  ScrollView,
  PanResponder,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

import animeService from '../../api/bangumi/anime/animeService.ts';
import {AnimeDetailScreenProps} from '../../types/navigation';
import {useAppNavigation} from '../../navigation';
import {createAnimeDetailStyles} from './style';
import AnimatedHeaderPage from '../../components/AnimatedHeaderPage';
import Summary from './summary/Summary';
import InfoBox from './infobox/InfoBox';

export default function AnimeDetail({route}: AnimeDetailScreenProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {goBack, canGoBack} = useAppNavigation();
  const {id, title} = route.params;

  const [animeDetail, setAnimeDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screenData, setScreenData] = useState(() => Dimensions.get('window'));
  const [currentPage, setCurrentPage] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const [indicatorWidths, setIndicatorWidths] = useState([0, 0]);

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

  // 处理水平滑动
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageIndex = Math.round(offsetX / screenDimensions.width);
    setCurrentPage(pageIndex);
  };

  // 滑动到指定页面
  const scrollToPage = (pageIndex: number) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: pageIndex * screenDimensions.width,
        animated: true,
      });
    }
    // setCurrentPage(pageIndex); // 只在handleScroll中更新currentPage，避免跳动
  };

  // 创建手势响应器
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
    },
    onPanResponderMove: () => {},
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.dx > 50 && currentPage > 0) {
        scrollToPage(currentPage - 1);
      } else if (gestureState.dx < -50 && currentPage < 1) {
        scrollToPage(currentPage + 1);
      }
    },
  });

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

      {/* 水平滑动内容区域 */}
      <View style={dynamicStyles.horizontalScrollContainer}>
        {/* 页面指示器 */}
        <View style={dynamicStyles.pageIndicatorContainer}>
          <TouchableOpacity
            style={dynamicStyles.pageIndicatorButton}
            onPress={() => {
              if (currentPage !== 0) scrollToPage(0);
            }}>
            <View>
              <Text
                style={[
                  dynamicStyles.pageIndicatorText,
                  currentPage === 0 && dynamicStyles.pageIndicatorTextActive,
                ]}
                onLayout={e => {
                  const w = e.nativeEvent.layout.width;
                  if (indicatorWidths[0] !== w) {
                    setIndicatorWidths([w, indicatorWidths[1]]);
                  }
                }}>
                简介
              </Text>
              {currentPage === 0 && (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -2,
                    height: 2,
                    backgroundColor: dynamicStyles.pageIndicatorTextActive.color,
                    width: indicatorWidths[0],
                    alignSelf: 'center',
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicStyles.pageIndicatorButton}
            onPress={() => {
              if (currentPage !== 1) scrollToPage(1);
            }}>
            <View>
              <Text
                style={[
                  dynamicStyles.pageIndicatorText,
                  currentPage === 1 && dynamicStyles.pageIndicatorTextActive,
                ]}
                onLayout={e => {
                  const w = e.nativeEvent.layout.width;
                  if (indicatorWidths[1] !== w) {
                    setIndicatorWidths([indicatorWidths[0], w]);
                  }
                }}>
                详情
              </Text>
              {currentPage === 1 && (
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: -2,
                    height: 2,
                    backgroundColor: dynamicStyles.pageIndicatorTextActive.color,
                    width: indicatorWidths[1],
                    alignSelf: 'center',
                  }}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* 水平滑动内容 */}
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={dynamicStyles.horizontalScrollView}
          {...panResponder.panHandlers}>
          {/* 简介页面 */}
          <View style={[dynamicStyles.pageContainer, {width: screenDimensions.width}]}>
            <Summary
              summary={animeDetail.summary}
              tags={animeDetail.tags}
              dynamicStyles={dynamicStyles}
            />
          </View>

          {/* 详情页面 */}
          <View style={[dynamicStyles.pageContainer, {width: screenDimensions.width}]}>
            <InfoBox
              infobox={animeDetail.infobox}
              screenDimensions={screenDimensions}
              dynamicStyles={dynamicStyles}
            />
          </View>
        </ScrollView>
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
