import {StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper';

// 渐变蒙版配置
export const GRADIENT_CONFIG = {
    colors: ['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)'],
    locations: [0, 0.5, 1],
};

export const createSchedulesStyles = (theme: MD3Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        contentContainer: {
            flex: 1,
        },
        // 紧凑的星期选择器 - 使用 Chip 组件
        weekdayContainer: {
            backgroundColor: theme.colors.surface,
            paddingVertical: 6,
            marginBottom: 4,
            elevation: 1,
            shadowColor: theme.colors.shadow,
            shadowOffset: {width: 0, height: 1},
            shadowOpacity: 0.05,
            shadowRadius: 1,
        },
        weekdayScrollContent: {
            paddingHorizontal: 12,
            alignItems: 'center',
        },
        weekdayChip: {
            marginHorizontal: 4,
            height: 32, // 紧凑高度
        },
        weekdayChipSelected: {
            backgroundColor: theme.colors.primaryContainer,
        },
        weekdayChipText: {
            fontSize: 12,
            lineHeight: 16,
        },
        weekdayChipTextSelected: {
            color: theme.colors.onPrimaryContainer,
            fontWeight: '600',
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

        animeCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            shadowColor: theme.colors.shadow,
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            overflow: 'hidden',
        },
        imageContainer: {
            position: 'relative',
            width: '100%',
            aspectRatio: 3 / 4, // 宽高比 3:4，接近海报比例
            borderRadius: 12,
            overflow: 'hidden',
        },
        shimmerPlaceholder: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            borderRadius: 12,
            zIndex: 10,
            backgroundColor: theme.colors.surfaceVariant,
        },
        animeImage: {
            width: '100%',
            height: '100%',
            borderRadius: 12,
        },
        titleOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 12,
            paddingVertical: 12,
            paddingTop: 24, // 增加顶部内边距，为渐变效果留出空间
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
        },
        // 渐变蒙版样式
        gradientOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80, // 渐变蒙版高度
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
        },
        animeTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            color: 'white',
            lineHeight: 20,
            textShadowColor: 'rgba(0, 0, 0, 0.8)', // 添加文字阴影增强可读性
            textShadowOffset: {width: 0, height: 1},
            textShadowRadius: 3,
            zIndex: 2, // 确保文字在渐变层之上
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
    });
