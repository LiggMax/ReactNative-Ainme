/**
 * @Author Ligg
 * @Time 2025/7/3
 **/
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  Button,
  Dialog,
  Text,
  TextInput,
  Portal,
  useTheme,
} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useAppTheme } from '../../context/ThemeContext';

// Profile组件
const Profile: React.FC = () => {
  const [text, setText] = React.useState('');
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();
  const { isDarkTheme, toggleTheme } = useAppTheme();

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleConfirm = () => {
    console.log('用户确认操作，邮箱内容:', text);
    hideDialog();
  };

  const handleCancel = () => {
    console.log('用户取消操作');
    hideDialog();
  };

  return (
    <SafeAreaView style={[styles.safeArea, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
        <TextInput
          label="邮箱地址"
          mode="outlined"
          value={text}
          onChangeText={setText}
          placeholder="请输入您的邮箱地址"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={showDialog}
          disabled={!text.trim()}>
          显示确认弹窗
        </Button>

        <Button
          style={[styles.button, styles.activeButton]}
          mode="contained"
          onPress={toggleTheme}
        >
          {isDarkTheme ? '切换到浅色主题' : '切换到深色主题'}
        </Button>
        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>确认信息</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">您输入的邮箱地址是：{text}</Text>
              <Text variant="bodySmall" style={styles.dialogSubtext}>
                请确认信息是否正确？
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={handleCancel}>取消</Button>
              <Button mode="contained" onPress={handleConfirm}>
                确认
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </SafeAreaView>
  );
};
export default Profile;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    borderRadius: 8,
    margin: 8,
  },
  button: {
    marginTop: 20,
  },
  activeButton: {
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dialogSubtext: {
    marginTop: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
