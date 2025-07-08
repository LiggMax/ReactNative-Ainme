import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const playerStyles = (isFullscreen: boolean = false) => {
  const theme = useTheme();
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
    },
    fullscreenContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#000',
      zIndex: 999,
    },
    backgroundVideo: {
      width: '100%',
      height: '100%',
    },
  });
};
