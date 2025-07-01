import React from 'react';
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

export const createSummaryStyles = (theme: MD3Theme, screenDimensions: ScreenDimensions) => {
  return StyleSheet.create({
    tabContent: {
      padding: screenDimensions.headerPadding,
      backgroundColor: theme.colors.background,
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
  });
};
