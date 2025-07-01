import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const useStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
      color: theme.colors.onBackground,
    },
    card: {
      marginBottom: 12,
      elevation: 2,
      backgroundColor: theme.colors.surface,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
    },
    image: {
      width: 60,
      height: 80,
      borderRadius: 4,
      marginRight: 12,
      backgroundColor: theme.colors.surfaceVariant,
    },
    textContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 4,
      color: theme.colors.onSurface,
    },
    relation: {
      fontSize: 14,
      color: theme.colors.primary,
      marginBottom: 2,
    },
    originalName: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
      fontStyle: 'italic',
    },
  });
};

// 导出静态样式供不使用hook的地方使用
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: 60,
    height: 80,
    borderRadius: 4,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  relation: {
    fontSize: 14,
    marginBottom: 2,
  },
  originalName: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
