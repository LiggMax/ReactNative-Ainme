import React, {useState, useEffect, useMemo, useRef} from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  PanResponder,
} from 'react-native';
import {useTheme} from 'react-native-paper';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import animeDateService from '../../api/bangumi/anime/animeDate';
import {AnimeDetailScreenProps} from '../../types/navigation';
import {useAppNavigation} from '../../navigation';
import {createAnimeDetailStyles} from './style';
import AnimatedHeaderPage from '../../components/AnimatedHeaderPage';
import Summary from './summary';
import Infobox from './infobox';
import Head from './head';

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

      const detail = await animeDateService.getAnimeDetailService(id);
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
    onMoveShouldSetPanResponder: (_evt, gestureState) => {
      return (
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
        Math.abs(gestureState.dx) > 10
      );
    },
    onPanResponderMove: () => {},
    onPanResponderRelease: (_evt, gestureState) => {
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
      {/* 头部信息区域 - 拆分为 Head 组件 */}
      <Head
        animeDetail={animeDetail}
        title={title}
        dynamicStyles={dynamicStyles}
        insets={insets}
      />
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
            style={[
              dynamicStyles.pageIndicatorButton,
              currentPage === 0 && dynamicStyles.pageIndicatorButtonActive,
            ]}
            onPress={() => {
              if (currentPage !== 0) scrollToPage(0);
            }}>
            <Text
              style={[
                dynamicStyles.pageIndicatorText,
                currentPage === 0 && dynamicStyles.pageIndicatorTextActive,
              ]}>
              简介
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              dynamicStyles.pageIndicatorButton,
              currentPage === 1 && dynamicStyles.pageIndicatorButtonActive,
            ]}
            onPress={() => {
              if (currentPage !== 1) scrollToPage(1);
            }}>
            <Text
              style={[
                dynamicStyles.pageIndicatorText,
                currentPage === 1 && dynamicStyles.pageIndicatorTextActive,
              ]}>
              详情
            </Text>
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
          nestedScrollEnabled={false}
          {...panResponder.panHandlers}>
          {/* 简介页面 */}
          <View style={[dynamicStyles.pageContainer, {width: screenDimensions.width}]}>
            <ScrollView 
              style={{flex: 1}} 
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <Summary
                summary={animeDetail.summary}
                tags={animeDetail.tags}
                animeId={id}
                screenDimensions={screenDimensions}
              />
            </ScrollView>
          </View>

          {/* 详情页面 */}
          <View style={[dynamicStyles.pageContainer, {width: screenDimensions.width}]}>
            <ScrollView 
              style={{flex: 1}} 
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <Infobox
                infobox={animeDetail.infobox}
                screenDimensions={screenDimensions}
              />
            </ScrollView>
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
        Begin={50}
        scrollThreshold={150}>
        {renderContent()}
      </AnimatedHeaderPage>
    </View>
  );
}
