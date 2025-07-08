/**
 * @Author Ligg
 * @Time 2025/7/5
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
      backgroundColor: 'transparent',
      justifyContent: 'space-between',
    },
    iconColor: {
      color: '#ffffff'
    },
    topControls: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      position: 'relative',
    },
    topGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    bottomControls: {
      position: 'relative',
    },
    bottomGradient: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: -1,
    },
    backButton: {
      borderRadius: 20,
    },
    controlsRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    timeText: {
      color: 'white',
      fontSize: 12,
      marginLeft: 12,
      fontWeight: '500',
    },
    progressContainer: {
      flex: 1,
    },
    progressBar: {
      height: 40,
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
      height: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: 2,
      left: 0,
      top: 0,
    },
    progressFill: {
      position: 'absolute',
      height: 4,
      backgroundColor: theme.colors.primary,
      borderRadius: 2,
      left: 0,
      top: 0,
    },
    progressThumb: {
      position: 'absolute',
      top: -6,
      width: 16,
      height: 16,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      marginLeft: -8,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });
}

export default controlsStyle;
