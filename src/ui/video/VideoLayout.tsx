/**
 * @Author Ligg
 * @Time 2025/7/4
 **/
import React from 'react';
import {View} from 'react-native';
import {VideoScreenProps} from '../../types/navigation';
import {videoStyles} from './style.ts';
import VideoPlayer from './player/index';
import {Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';

const VideoLayout = ({route}: VideoScreenProps) => {
  /**
   * 动态样式
   */
  const styles = videoStyles();

  /**
   * 路由参数
   */
  const {id, title} = route.params;

  return (
    <SafeAreaView style={styles.container}>
      {/* 视频播放器容器*/}
      <View style={[styles.videoContainer]}>
        <VideoPlayer />
      </View>

      {/* 信息栏 */}
      <View style={styles.infoContainer}>
        <Text style={styles.info}>视频标题: {title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default VideoLayout;
