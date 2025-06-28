import {StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper';

interface ScreenDimensions {
  width: number;
  height: number;
  isTablet: boolean;
  isLargePhone: boolean;
  isSmallPhone: boolean;
  coverImageWidth: number;
  coverImageHeight: number;
  headerPadding: number;
  titleFontSize: number;
  infoFontSize: number;
  headerMinHeight: number;
}

export const createAnimeDetailStyles = (theme: MD3Theme, screenDimensions: ScreenDimensions) => {
  return StyleSheet.create({
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
      paddingRight: screenDimensions.isSmallPhone ? screenDimensions.headerPadding : 8,
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
      marginRight: screenDimensions.isSmallPhone ? 0 : 8,
      paddingRight: screenDimensions.isSmallPhone ? 8 : 0,
      justifyContent: 'space-between',
      alignItems: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
    },
    titleContainer: {
      flex: 1,
      alignItems: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
      width: '100%',
    },
    titleWrapper:{
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      width: '100%',
    },
    title: {
      fontSize: screenDimensions.titleFontSize,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 6,
      marginRight: 10,
      lineHeight: screenDimensions.titleFontSize * 1.3,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 3,
      textAlign: screenDimensions.isSmallPhone ? 'center' : 'left',
      flexShrink: 1,
      maxWidth: '100%',
    },
    originalTitle: {
      fontSize: screenDimensions.infoFontSize,
      color: 'rgba(255, 255, 255, 0.9)',
      marginBottom: 12,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      textAlign: screenDimensions.isSmallPhone ? 'center' : 'left',
      flexShrink: 1,
      maxWidth: '100%',
    },
    dateText: {
      fontSize: screenDimensions.infoFontSize,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 4,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      textAlign: screenDimensions.isSmallPhone ? 'center' : 'left',
      flexShrink: 1,
      maxWidth: '100%',
    },
    episodeText: {
      fontSize: screenDimensions.infoFontSize,
      color: 'rgba(255, 255, 255, 0.8)',
      marginBottom: 12,
      textShadowColor: 'rgba(0, 0, 0, 0.8)',
      textShadowOffset: {width: 1, height: 1},
      textShadowRadius: 2,
      textAlign: screenDimensions.isSmallPhone ? 'center' : 'left',
      flexShrink: 1,
      maxWidth: '100%',
    },
    ratingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      justifyContent: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
      flexWrap: 'wrap',
      maxWidth: '100%',
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
      flexShrink: 1,
      maxWidth: '100%',
    },
    collectionContainer: {
      flexDirection: screenDimensions.isSmallPhone ? 'column' : 'row',
      alignItems: 'center',
      justifyContent: screenDimensions.isSmallPhone ? 'center' : 'flex-start',
      flexWrap: 'wrap',
      maxWidth: '100%',
      marginTop: 8,
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
      fontWeight: 'bold',
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
      marginHorizontal: -4,
    },
    tagChip: {
      margin: 4,
    },
     showMoreButton: {
      alignSelf: 'flex-end',
      marginTop: 8,
      marginBottom: 16,
    },
    showMoreText: {
      fontSize: screenDimensions.isTablet ? 14 : 12,
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
    // 新增样式
    absoluteFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
    rootContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    fixedHeaderContainer: {
      backgroundColor: theme.colors.background,
    },
    navigationBar: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface,
      elevation: 2,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      zIndex: 1000,
    },
    navigationTitle: {
      flex: 1,
      marginLeft: 16,
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
    },
    // 详细信息项目样式
    infoGridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginHorizontal: -4,
    },
    infoCard: {
      padding: 12,
      margin: 4,
      width: screenDimensions.isTablet ? '48%' : '100%',
      minWidth: screenDimensions.isTablet ? 200 : 150,
    },
    infoKeyText: {
      fontSize: 12,
      fontWeight: 'bold',
      color: theme.colors.primary,
    },
    infoValueText: {
      fontSize: 14,
      color: theme.colors.onSurface,
    },
    // TabView 相关样式
    tabViewContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    tabView: {
      flex: 1,
    },
    tabContent: {
      flex: 1,
      padding: screenDimensions.headerPadding,
      backgroundColor: theme.colors.background,
    },
    tabBar: {
      backgroundColor: theme.colors.surface,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    tabLabel: {
      fontSize: screenDimensions.isTablet ? 16 : 14,
      fontWeight: '600',
      textTransform: 'none',
    },
    tabIndicator: {
      backgroundColor: theme.colors.primary,
      height: 3,
    },
  });
};
