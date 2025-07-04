import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const playerStyles = () => {
  const theme = useTheme();
  return StyleSheet.create({
    backgroundVideo: {
      width: '100%',
      height: '100%',
    },
  });
};
