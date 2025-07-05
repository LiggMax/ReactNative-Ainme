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
    listContainer: {
      paddingBottom: 16,
    },
    row: {
      justifyContent: 'space-between',
      paddingHorizontal: 6,
    },
    itemContainer: {
      flex: 1,
      maxWidth: '48%', // 确保在2列布局时不会太宽
      margin: 8
    },
    card: {
      elevation: 3,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
    },
    imageContainer: {
      position: 'relative',
      width: '100%',
      aspectRatio: 3 / 4, // 保持3:4的宽高比
    },
    image: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.colors.surfaceVariant,
    },
    relationBadge: {
      position: 'absolute',
      top: 8,
      backgroundColor: theme.colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      elevation: 2,
    },
    relationText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.colors.onPrimary,
    },
    titleOverlay: {
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: 60,
      justifyContent: 'flex-end',
      padding: 8,
    },
    titleText: {
      fontSize: 15,
      fontWeight: 'bold',
      color: 'white',
      lineHeight: 16,
    },
    originalNameText: {
      fontSize: 10,
      color: 'rgba(255, 255, 255, 0.8)',
      fontStyle: 'italic',
      marginTop: 2,
    },
  });
};
