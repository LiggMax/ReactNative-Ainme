/**
 * 布局计算工具类
 */
import { Dimensions } from 'react-native';

// 布局配置接口
export interface LayoutConfig {
  minCardWidth: number;    // 最小卡片宽度
  cardMargin: number;      // 卡片间距
  containerPadding: number; // 容器内边距
  aspectRatio?: number;    // 卡片宽高比（宽/高），可选
}

// 布局计算结果接口
export interface LayoutResult {
  screenWidth: number;     // 屏幕宽度
  numColumns: number;      // 每行列数
  cardWidth: number;       // 实际卡片宽度
  cardHeight: number;      // 卡片高度（如果设置了宽高比）
  spacing: number;         // 实际间距
}

/**
 * 布局计算工具类
 */
export class LayoutCalculator {
  private static instance: LayoutCalculator;
  
  private constructor() {}
  
  /**
   * 获取单例实例
   */
  static getInstance(): LayoutCalculator {
    if (!LayoutCalculator.instance) {
      LayoutCalculator.instance = new LayoutCalculator();
    }
    return LayoutCalculator.instance;
  }
  
  /**
   * 计算网格布局参数
   * @param config 布局配置
   * @returns 布局计算结果
   */
  calculateGridLayout(config: LayoutConfig): LayoutResult {
    const { width: screenWidth } = Dimensions.get('window');
    const { minCardWidth, cardMargin, containerPadding, aspectRatio } = config;
    
    // 可用宽度 = 屏幕宽度 - 容器内边距
    const availableWidth = screenWidth - containerPadding;
    
    // 计算每行最多能放几个卡片
    const maxColumns = Math.floor(availableWidth / (minCardWidth + cardMargin));
    const numColumns = Math.max(1, maxColumns);
    
    // 计算实际卡片宽度
    const totalMarginWidth = (numColumns - 1) * cardMargin;
    const cardWidth = (availableWidth - totalMarginWidth) / numColumns;
    
    // 计算卡片高度（如果设置了宽高比）
    const cardHeight = aspectRatio ? cardWidth / aspectRatio : cardWidth;
    
    return {
      screenWidth,
      numColumns,
      cardWidth,
      cardHeight,
      spacing: cardMargin,
    };
  }
  
  /**
   * 获取响应式布局参数
   * @param breakpoints 断点配置
   * @returns 当前屏幕对应的布局配置
   */
  getResponsiveLayout(breakpoints: ResponsiveBreakpoints): ResponsiveLayout {
    const { width } = Dimensions.get('window');
    
    if (width >= breakpoints.tablet) {
      return {
        isTablet: true,
        isLargePhone: false,
        isSmallPhone: false,
        screenType: 'tablet'
      };
    } else if (width >= breakpoints.largePhone) {
      return {
        isTablet: false,
        isLargePhone: true,
        isSmallPhone: false,
        screenType: 'largePhone'
      };
    } else if (width < breakpoints.smallPhone) {
      return {
        isTablet: false,
        isLargePhone: false,
        isSmallPhone: true,
        screenType: 'smallPhone'
      };
    } else {
      return {
        isTablet: false,
        isLargePhone: false,
        isSmallPhone: false,
        screenType: 'phone'
      };
    }
  }
}

// 响应式断点配置接口
export interface ResponsiveBreakpoints {
  tablet: number;      // 平板断点
  largePhone: number;  // 大屏手机断点
  smallPhone: number;  // 小屏手机断点
}

// 响应式布局结果接口
export interface ResponsiveLayout {
  isTablet: boolean;
  isLargePhone: boolean;
  isSmallPhone: boolean;
  screenType: 'tablet' | 'largePhone' | 'phone' | 'smallPhone';
}

// 默认断点配置
export const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  tablet: 768,
  largePhone: 414,
  smallPhone: 360,
};

/**
 * 便捷函数：计算动漫卡片布局
 */
export const calculateAnimeCardLayout = (
  minCardWidth: number = 150,
  cardMargin: number = 16,
  containerPadding: number = 32,
  aspectRatio: number = 1.4
): LayoutResult => {
  const calculator = LayoutCalculator.getInstance();
  return calculator.calculateGridLayout({
    minCardWidth,
    cardMargin,
    containerPadding,
    aspectRatio,
  });
};

/**
 * 便捷函数：获取响应式布局
 */
export const getResponsiveLayout = (
  breakpoints: ResponsiveBreakpoints = DEFAULT_BREAKPOINTS
): ResponsiveLayout => {
  const calculator = LayoutCalculator.getInstance();
  return calculator.getResponsiveLayout(breakpoints);
};

/**
 * 便捷函数：计算自适应列数布局
 * @param itemWidth 项目宽度
 * @param spacing 间距
 * @param padding 容器内边距
 * @param maxColumns 最大列数（可选）
 */
export const calculateAutoColumns = (
  itemWidth: number,
  spacing: number = 16,
  padding: number = 32,
  maxColumns?: number
): LayoutResult => {
  const calculator = LayoutCalculator.getInstance();
  const config: LayoutConfig = {
    minCardWidth: itemWidth,
    cardMargin: spacing,
    containerPadding: padding,
  };
  
  const result = calculator.calculateGridLayout(config);
  
  // 如果设置了最大列数，则限制列数
  if (maxColumns && result.numColumns > maxColumns) {
    const numColumns = maxColumns;
    const totalMarginWidth = (numColumns - 1) * spacing;
    const availableWidth = result.screenWidth - padding;
    const cardWidth = (availableWidth - totalMarginWidth) / numColumns;
    
    return {
      ...result,
      numColumns,
      cardWidth,
    };
  }
  
  return result;
}; 