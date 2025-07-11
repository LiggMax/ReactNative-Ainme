import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const videoStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    videoInfoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',//两侧对齐
    },
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    fullscreenWrapper: {
      flex: 1,
      backgroundColor: '#000',
    },
    infoContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: '#fff',
    },
    videoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
    },
    videoDescription: {
      fontSize: 14,
      color: '#666',
      lineHeight: 20,
    },
  });
};
