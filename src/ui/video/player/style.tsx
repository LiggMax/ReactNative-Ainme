import {StyleSheet, Dimensions} from 'react-native';
import {useTheme} from 'react-native-paper';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const playerStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    videoContainer: {
      width: screenWidth,
      height: screenWidth * (9 / 16), // 16:9 比例
      backgroundColor: '#000',
      position: 'relative',
    },
    fullscreenContainer: {
      width: screenHeight,
      height: screenWidth,
      transform: [{ rotate: '90deg' }],
      position: 'absolute',
      top: (screenHeight - screenWidth) / 2,
      left: (screenWidth - screenHeight) / 2,
    },
    videoTouchable: {
      flex: 1,
    },
    video: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    loadingContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    loadingText: {
      color: '#fff',
      marginTop: 10,
      fontSize: 16,
    },
    centerPlayButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: [{ translateX: -30 }, { translateY: -30 }],
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 30,
    },
  });
};
