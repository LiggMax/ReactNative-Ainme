import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import SystemNavigationBar from 'react-native-system-navigation-bar';
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

  // 组件卸载时解锁屏幕方向并恢复导航栏
  useEffect(() => {
    return () => {
      Orientation.unlockAllOrientations();
      SystemNavigationBar.navigationShow();
    };
  }, []);

  const toggleFullscreen = () => {
    const newFullscreenState = !fullscreen;
    setFullscreen(newFullscreenState);

    if (newFullscreenState) {
      // 进入全屏时锁定为横屏并隐藏导航栏
      Orientation.lockToLandscape();
      SystemNavigationBar.navigationHide();
    } else {
      // 退出全屏时锁定为竖屏并显示导航栏
      Orientation.lockToPortrait();
      SystemNavigationBar.navigationShow();
    }
  };

  return (
    <View style={fullscreen ? styles.fullscreenWrapper : styles.container}>
      <StatusBarManager
        barStyle="light-content"
        backgroundColor="#000"
        translucent={fullscreen}
        hidden={fullscreen}
        useGlobalTheme={false}
      />

      {/* 非全屏时的安全区域包装 */}
      {!fullscreen && <View style={{ paddingTop: insets.top }} />}

      {/* 视频播放器  */}
      <VideoPlayer
        id={id}
        title={title}
        videoSource={videoSource}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        onBack={goBack}
      />

      {/* 视频信息区域 - 只在非全屏时显示 */}
      {!fullscreen && (
        <View style={[styles.infoContainer, { paddingBottom: insets.bottom }]}>
          <Text style={styles.videoTitle}>{title}</Text>
          <Text style={styles.videoDescription}>
            这里可以显示视频的详细描述信息
          </Text>
        </View>
      )}
    </View>
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
