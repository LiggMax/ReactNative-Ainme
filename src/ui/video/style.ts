import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const videoStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    videoContainer: {
      width: '100%',
      aspectRatio: 16 / 9,
      backgroundColor: '#000',
    },
    headerContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center',
    },
    infoContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    info: {
      fontSize: 14,
      textAlign: 'center',
    },
  });
};
