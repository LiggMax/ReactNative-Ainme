/**
 * @Author Ligg
 * @Time 2025/7/4
 **/
import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {VideoScreenProps} from '../../types/navigation';

const VideoLayout = ({route}: VideoScreenProps) => {
  const {id, title} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        视频播放页面
      </Text>
      <Text style={styles.info}>
        动漫ID: {id}
      </Text>
      <Text style={styles.info}>
        标题: {title || '无标题'}
      </Text>
    </View>
  );
};

export default VideoLayout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
});
