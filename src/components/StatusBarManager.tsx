import React, {useEffect, useState, useRef} from 'react';
import {StatusBar, Platform, Animated, useColorScheme} from 'react-native';

interface StatusBarManagerProps {
  barStyle?: 'default' | 'light-content' | 'dark-content';
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
  // 新增动态功能属性
  dynamicBarStyle?: boolean; // 是否启用动态样式
  scrollY?: Animated.Value; // 滚动位置
  scrollThreshold?: number; // 滚动阈值
  lightBarStyle?: 'light-content' | 'dark-content'; // 浅色背景时的样式
  darkBarStyle?: 'light-content' | 'dark-content'; // 深色背景时的样式
  autoDetectTheme?: boolean; // 是否自动检测系统主题
}

export const StatusBarManager: React.FC<StatusBarManagerProps> = ({
  barStyle = 'dark-content',
  backgroundColor = 'transparent',
  translucent = true,
  hidden = false,
  dynamicBarStyle = false,
  scrollY,
  scrollThreshold = 100,
  lightBarStyle = 'dark-content',
  darkBarStyle = 'light-content',
  autoDetectTheme = false,
}) => {
  const colorScheme = useColorScheme();
  const [currentBarStyle, setCurrentBarStyle] = useState(barStyle);
  const scrollListener = useRef<string | null>(null);

  // 自动检测系统主题并设置状态栏样式
  useEffect(() => {
    if (autoDetectTheme) {
      const themeBasedStyle = colorScheme === 'dark' ? darkBarStyle : lightBarStyle;
      setCurrentBarStyle(themeBasedStyle);
    } else {
      setCurrentBarStyle(barStyle);
    }
  }, [autoDetectTheme, colorScheme, barStyle, lightBarStyle, darkBarStyle]);

  // 滚动监听器 - 根据滚动位置动态改变状态栏
  useEffect(() => {
    if (dynamicBarStyle && scrollY) {
      // 移除之前的监听器
      if (scrollListener.current) {
        scrollY.removeListener(scrollListener.current);
      }

      // 添加新的监听器
      scrollListener.current = scrollY.addListener(({value}) => {
        const newBarStyle = value > scrollThreshold ? lightBarStyle : darkBarStyle;
        setCurrentBarStyle(newBarStyle);
      });

      return () => {
        if (scrollListener.current) {
          scrollY.removeListener(scrollListener.current);
        }
      };
    }
  }, [dynamicBarStyle, scrollY, scrollThreshold, lightBarStyle, darkBarStyle]);

  // 应用状态栏设置
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(translucent);
      StatusBar.setBackgroundColor(backgroundColor, true);
      StatusBar.setBarStyle(currentBarStyle, true);
      StatusBar.setHidden(hidden, 'fade');
    }
  }, [currentBarStyle, backgroundColor, translucent, hidden]);

  return (
    <StatusBar
      barStyle={currentBarStyle}
      backgroundColor={backgroundColor}
      translucent={translucent}
      hidden={hidden}
    />
  );
};

// 增强的预定义状态栏配置
export const StatusBarConfigs = {
  // 默认配置
  default: {
    barStyle: 'dark-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
    hidden: false,
    autoDetectTheme: true,
    lightBarStyle: 'dark-content' as const,
    darkBarStyle: 'light-content' as const,
  },
  // 详情页配置（深色背景，浅色文字，支持滚动动态变化）
  detail: {
    barStyle: 'light-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
    hidden: false,
    dynamicBarStyle: true,
    lightBarStyle: 'dark-content' as const,
    darkBarStyle: 'light-content' as const,
    scrollThreshold: 80,
  },
  // 隐藏状态栏
  hidden: {
    barStyle: 'light-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
    hidden: true,
  },
  // 浅色主题（固定深色文字）
  light: {
    barStyle: 'dark-content' as const,
    backgroundColor: '#FFFFFF',
    translucent: false,
    hidden: false,
  },
  // 深色主题（固定浅色文字）
  dark: {
    barStyle: 'light-content' as const,
    backgroundColor: '#000000',
    translucent: false,
    hidden: false,
  },
  // 智能主题（自动检测系统主题）
  smart: {
    barStyle: 'dark-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
    hidden: false,
    autoDetectTheme: true,
    lightBarStyle: 'dark-content' as const,
    darkBarStyle: 'light-content' as const,
  },
  // 滚动响应式（适用于有头部图片的页面）
  scrollResponsive: {
    barStyle: 'light-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
    hidden: false,
    dynamicBarStyle: true,
    lightBarStyle: 'dark-content' as const,
    darkBarStyle: 'light-content' as const,
    scrollThreshold: 120,
  },
};
