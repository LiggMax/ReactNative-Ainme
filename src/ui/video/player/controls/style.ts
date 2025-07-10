/**
 * @Author Ligg
 * @Time 2025/7/5
 *
 * 视频控制组件样式
 **/
import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

const controlsStyle = () => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'space-between',
    },
    topControls: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 60,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    backButton: {
      padding: 8,
    },
    title: {
      flex: 1,
      color: '#fff',
      fontSize: 16,
      fontWeight: '500',
      marginHorizontal: 16,
    },
    moreButton: {
      padding: 8,
    },
    bottomControls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingHorizontal: 16,
      paddingVertical: 5,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    playControls: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    timeText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: 'bold',
      minWidth: 40,
      textAlign: 'center',
    },
    progressBarContainer: {
      flex: 1,
      marginHorizontal: 12,
    },
    progressBar: {
      height: 20,
      justifyContent: 'center',
    },
    progressTrack: {
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: 2,
      position: 'relative',
    },
    bufferedFill: {
      position: 'absolute',
      height: '100%',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: 2,
    },
    progressFill: {
      position: 'absolute',
      height: '100%',
      backgroundColor: theme.colors.primary || '#ff6b6b',
      borderRadius: 2,
    },
    progressThumb: {
      position: 'absolute',
      top: -6,
      width: 16,
      height: 16,
      backgroundColor: theme.colors.primary || '#ff6b6b',
      borderRadius: 8,
      transform: [{ translateX: -8 }],
    },
  });
}

export default controlsStyle;
