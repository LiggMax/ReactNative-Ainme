import React, {useState, useCallback} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Button, Dialog, Portal, useTheme} from 'react-native-paper';

export default function Ranking() {
  const theme = useTheme();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  // 显示弹窗的方法
  const showAlert = useCallback((title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  }, []);

  // 隐藏弹窗的方法
  const hideAlert = useCallback(() => {
    setAlertVisible(false);
    setAlertTitle('');
    setAlertMessage('');
  }, []);

  return (
    <View style={[styles.tabContent, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.interval, styles.title, { color: theme.colors.onBackground }]}>排行榜</Text>
      <Text style={[styles.interval, styles.description, { color: theme.colors.onSurfaceVariant }]}>
        查看最受欢迎的动漫作品排行榜
      </Text>
      <View style={[styles.interval]}>
        <Button
          mode="outlined"
          onPress={() => showAlert('排行榜', '热门动漫排行榜')}>
          热门排行
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button
          mode="outlined"
          onPress={() => showAlert('排行榜', '评分最高的动漫')}>
          评分排行
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button
          mode="text"
          onPress={() => showAlert('排行榜', '查看更多排行榜数据')}>
          更多排行
        </Button>
      </View>

      <Portal>
        <Dialog visible={alertVisible} onDismiss={hideAlert}>
          <Dialog.Title>{alertTitle}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>{alertMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideAlert}>确定</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  interval: {
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  dialogMessage: {
    fontSize: 16,
  },
});
