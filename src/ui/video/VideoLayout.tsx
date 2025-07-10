import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { VideoScreenProps } from '../../types/navigation';
import { useAppNavigation } from '../../navigation';
import VideoPlayer from './player/Player';

const VideoLayout: React.FC<VideoScreenProps> = ({ route }) => {
  const { id, title = '视频播放' } = route.params;
  const { goBack } = useAppNavigation();
  const [fullscreen, setFullscreen] = useState(false);

  // 根据id获取视频源，这里暂时使用默认视频
  const videoSource = null; // 可以根据id从API获取视频源

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={fullscreen} />
      <VideoPlayer
        id={id}
        title={title}
        videoSource={videoSource}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        onBack={goBack}
      />

      {/* 视频信息区域 */}
      {!fullscreen && (
        <View style={styles.infoContainer}>
          <Text style={styles.videoTitle}>{title}</Text>
          <Text style={styles.videoDescription}>
            这里可以显示视频的详细描述信息
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  infoContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  videoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  videoDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default VideoLayout;
