import {StyleSheet, Dimensions} from 'react-native';
import {useTheme} from 'react-native-paper';

export const playerStyles = () => {
  const theme = useTheme();
  const { width: screenWidth } = Dimensions.get('window');

  return StyleSheet.create({
    videoContainer: {
      width: '100%',
      height: screenWidth * (9 / 16), // 16:9 比例
      overflow: 'hidden',
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
    },
    loadingText: {
      color: theme.colors.onSurface,
      fontSize: 16,
      fontWeight: '500',
    },
    errorContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.errorContainer,
      borderRadius: 8,
    },
    errorText: {
      color: theme.colors.onErrorContainer,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      paddingHorizontal: 20,
    },
    playerWrapper: {
      borderRadius: 8,
      overflow: 'hidden',
    },
  });
};
