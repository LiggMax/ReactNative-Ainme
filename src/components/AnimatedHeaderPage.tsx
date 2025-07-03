import React, {useMemo, useRef, ReactNode} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTheme} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StatusBarManager, StatusBarConfigs} from './StatusBarManager';
import { useAppTheme } from '../context/ThemeContext';

interface AnimatedHeaderPageProps {
  children: ReactNode;
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  renderCustomHeader?: (scrollY: Animated.Value) => ReactNode;
  headerBackgroundImage?: string;
  scrollThreshold?: number;
  Begin?: number;
  contentContainerStyle?: ViewStyle;
  statusBarConfig?: any;
}

export default function AnimatedHeaderPage({
  children,
  title = '页面标题',
  showBackButton = true,
  onBackPress,
  renderCustomHeader,
  Begin = 50,
  scrollThreshold = 150,
  contentContainerStyle,
  statusBarConfig = StatusBarConfigs.detail,
}: AnimatedHeaderPageProps) {
  const theme = useTheme();
  const { isDarkTheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  // 基础样式
  const baseStyles = useMemo(() => {
    return StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: theme.colors.background,
      },
      scrollContainer: {
        flex: 1,
      },
      topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 56 + insets.top,
        paddingTop: insets.top,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 5,
        zIndex: 1000,
      },
      backButtonContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      },
      backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        flex: 1,
        marginHorizontal: 16,
        fontSize: 18,
        fontWeight: '600',
      } as TextStyle,
      headerBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 200 + insets.top,
        backgroundColor: theme.colors.primary,
      },
    });
  }, [insets.top, theme]);

  // 动态样式值
  const animatedStyles = useMemo(() => {
    // 根据主题和滚动位置计算背景色透明度
    const transparentColor = 'rgba(0,0,0,0)';
    const solidColor = isDarkTheme ? theme.colors.surface : theme.colors.surface;
    
    const headerBackgroundColor = scrollY.interpolate({
      inputRange: [Begin, scrollThreshold],
      outputRange: [transparentColor, solidColor],
      extrapolate: 'clamp',
    });

    // 根据主题和滚动位置计算文字颜色
    const titleColor = scrollY.interpolate({
      inputRange: [Begin, scrollThreshold],
      outputRange: ['rgba(255,255,255,0)', theme.colors.onSurface],
      extrapolate: 'clamp',
    });

    // 根据主题和滚动位置计算返回按钮图标颜色
    const backButtonIconColor = scrollY.interpolate({
      inputRange: [Begin, scrollThreshold],
      outputRange: ['rgba(255,255,255,1)', theme.colors.onSurface],
      extrapolate: 'clamp',
    });

    // 动态阴影
    const shadowOpacity = scrollY.interpolate({
      inputRange: [Begin, scrollThreshold],
      outputRange: [0, 0.1],
      extrapolate: 'clamp',
    });

    const shadowRadius = scrollY.interpolate({
      inputRange: [Begin, scrollThreshold],
      outputRange: [0, 3],
      extrapolate: 'clamp',
    });

    const elevation = scrollY.interpolate({
      inputRange: [Begin, scrollThreshold],
      outputRange: [0, 4],
      extrapolate: 'clamp',
    });

    return {
      headerBackgroundColor,
      titleColor,
      backButtonIconColor,
      shadowOpacity,
      shadowRadius,
      elevation,
    };
  }, [scrollY, scrollThreshold, theme.colors, isDarkTheme]);

  // 默认的顶部导航栏
  const renderDefaultHeader = () => (
    <Animated.View
      style={[
        baseStyles.topBar,
        {
          backgroundColor: animatedStyles.headerBackgroundColor,
          shadowOpacity: animatedStyles.shadowOpacity,
          shadowRadius: animatedStyles.shadowRadius,
          shadowOffset: {width: 0, height: 2},
          elevation: animatedStyles.elevation,
        },
      ]}>
      {showBackButton && (
        <Animated.View style={baseStyles.backButtonContainer}>
          <TouchableOpacity
            style={baseStyles.backButton}
            onPress={onBackPress}
            activeOpacity={0.7}>
            <Animated.Text
              style={[
                {fontSize: 24},
                {color: animatedStyles.backButtonIconColor},
              ]}>
              <Icon name="chevron-back" size={24} />
            </Animated.Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <Animated.Text
        style={[baseStyles.title, {color: animatedStyles.titleColor}]}
        numberOfLines={1}>
        {title}
      </Animated.Text>
    </Animated.View>
  );

  return (
    <View style={baseStyles.container}>
      <StatusBarManager {...statusBarConfig} scrollY={scrollY} />

      {/* 顶部导航栏 */}
      {renderCustomHeader ? renderCustomHeader(scrollY) : renderDefaultHeader()}

      {/* 内容区域 */}
      <Animated.ScrollView
        style={baseStyles.scrollContainer}
        contentContainerStyle={[{flexGrow: 1}, contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        scrollEventThrottle={16}
        automaticallyAdjustContentInsets={false}
        contentInsetAdjustmentBehavior="never"
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: false},
        )}>
        {children}

        {/* 底部安全距离 */}
        <View style={{height: insets.bottom}} />
      </Animated.ScrollView>
    </View>
  );
}
