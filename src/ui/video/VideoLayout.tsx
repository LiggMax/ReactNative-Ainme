import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Orientation from 'react-native-orientation-locker';
import { VideoScreenProps } from '../../types/navigation';
import { useAppNavigation } from '../../navigation';
import VideoPlayer from './player/Player';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBarManager } from '../../components/StatusBarManager';

const VideoLayout: React.FC<VideoScreenProps> = ({ route }) => {
  const { id, title = '视频播放' } = route.params;
  const { goBack } = useAppNavigation();
  const [fullscreen, setFullscreen] = useState(false);
  const insets = useSafeAreaInsets();

  // 根据id获取视频源，这里暂时使用默认视频
  const videoSource = null; // 可以根据id从API获取视频源

  // 组件卸载时解锁屏幕方向
  useEffect(() => {
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  const toggleFullscreen = () => {
    const newFullscreenState = !fullscreen;
    setFullscreen(newFullscreenState);
    
    if (newFullscreenState) {
      // 进入全屏时锁定为横屏
      Orientation.lockToLandscape();
    } else {
      // 退出全屏时锁定为竖屏
      Orientation.lockToPortrait();
    }
  };

  if (fullscreen) {
    return (
      <View style={styles.fullscreenWrapper}>
        <StatusBarManager hidden={true} />
        <VideoPlayer
          id={id}
          title={title}
          videoSource={videoSource}
          fullscreen={fullscreen}
          onToggleFullscreen={toggleFullscreen}
          onBack={goBack}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <StatusBarManager 
        barStyle="light-content" 
        backgroundColor="#000" 
        translucent={false} 
        hidden={false}
        useGlobalTheme={false}
      />
      <VideoPlayer
        id={id}
        title={title}
        videoSource={videoSource}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        onBack={goBack}
      />

      {/* 视频信息区域 */}
      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>{title}</Text>
        <Text style={styles.videoDescription}>
          这里可以显示视频的详细描述信息
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenWrapper: {
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
