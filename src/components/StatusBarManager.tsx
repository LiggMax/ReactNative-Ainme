import React, {useEffect} from 'react';
import {StatusBar, Platform} from 'react-native';

interface StatusBarManagerProps {
  barStyle?: 'default' | 'light-content' | 'dark-content';
  backgroundColor?: string;
  translucent?: boolean;
  hidden?: boolean;
}

export const StatusBarManager: React.FC<StatusBarManagerProps> = ({
  barStyle = 'dark-content',
  backgroundColor = 'transparent',
  translucent = true,
  hidden = false,
}) => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      StatusBar.setTranslucent(translucent);
      StatusBar.setBackgroundColor(backgroundColor, true);
      StatusBar.setBarStyle(barStyle, true);
      StatusBar.setHidden(hidden, 'fade');
    }
  }, [barStyle, backgroundColor, translucent, hidden]);

  return (
    <StatusBar
      barStyle={barStyle}
      backgroundColor={backgroundColor}
      translucent={translucent}
      hidden={hidden}
    />
  );
};

// 预定义的状态栏配置
export const StatusBarConfigs = {
  // 默认配置
  default: {
    barStyle: 'dark-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
    hidden: false,
  },
  // 详情页配置（深色背景，浅色文字）
  detail: {
    barStyle: 'light-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
    hidden: false,
  },
  // 隐藏状态栏
  hidden: {
    barStyle: 'light-content' as const,
    backgroundColor: 'transparent',
    translucent: true,
    hidden: true,
  },
  // 浅色主题
  light: {
    barStyle: 'dark-content' as const,
    backgroundColor: '#FFFFFF',
    translucent: false,
    hidden: false,
  },
}; 