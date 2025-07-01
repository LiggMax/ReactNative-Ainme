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

export const createInfoboxStyles = (theme: MD3Theme, screenDimensions: ScreenDimensions) => {
  return StyleSheet.create({
    tabContent: {
      padding: screenDimensions.headerPadding,
      backgroundColor: theme.colors.background,
    },
    summaryText: {
      fontSize: screenDimensions.isTablet ? 16 : 14,
      color: theme.colors.onSurfaceVariant,
      lineHeight: screenDimensions.isTablet ? 24 : 20,
      marginBottom: 24,
    },
    infoCard: {
      padding: 12,
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
  });
};
