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
      backgroundColor: theme.colors.background,
    },
    fullscreenWrapper: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    infoContainer: {
      flex: 1,
      padding: 16,
      backgroundColor: theme.colors.background,
    },
    videoTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    videoDescription: {
      fontSize: 14,
      lineHeight: 20,
    },
    data:{
      //内边距
      padding:16,
    },
    // 底部抽屉样式
    drawerContainer: {
      flex: 1,
      marginHorizontal: 16,
    },
    modalContent: {
      backgroundColor: theme.colors.background,
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
    },
    drawerScrollView: {
      flex: 1,
    },
    episodeItem: {
      padding: 15,
      marginVertical: 5,
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
    },
    episodeDate: {
      fontSize: 12,
    },
    episodeTitle: {
      fontSize: 14,
      marginBottom: 4,
    },
    episodeComment: {
      fontSize: 12,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 200,
    },
    emptyText: {
      fontSize: 16,
    },
    layout:{
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  });
};
