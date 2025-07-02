import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      color: theme.colors.onBackground,
    },
    row: {
      justifyContent: 'space-between',
      paddingHorizontal: 4,
    },
    gridItem: {
      flex: 1,
      marginBottom: 10,
      maxWidth: '48%',
    },
    card: {
      elevation: 2,
      backgroundColor: theme.colors.surface,
      overflow: 'hidden',
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      aspectRatio: 3/4,
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.surfaceVariant,
    },
    overlay: {
      position: 'absolute',
      top: 8,
      left: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
    },
    titleOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    titleGradient: {
      padding: 8,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
    },
    relation: {
      fontSize: 10,
      color: '#FFFFFF',
      fontWeight: '500',
    },
    originalName: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      fontStyle: 'italic',
    },
  });
};
