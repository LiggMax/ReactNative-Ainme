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
    // 底部抽屉样式
    drawerContainer: {
      flex: 1,
      padding: 20,
    },
    drawerHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    drawerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    drawerScrollView: {
      flex: 1,
    },
    episodeItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    episodeHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    episodeBody: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    episodeNumber: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    episodeDate: {
      fontSize: 12,
      color: '#999',
    },
    episodeTitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 4,
    },
    episodeComment: {
      fontSize: 12,
      color: '#666'
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200,
    },
    emptyText: {
      fontSize: 16,
      color: '#999',
    },
  });
};
