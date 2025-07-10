import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { VideoScreenProps } from '../../types/navigation';
import { useAppNavigation } from '../../navigation';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const VideoPlayer: React.FC<VideoScreenProps> = ({ route }) => {
  const { id, title = '视频播放' } = route.params;
  const { goBack } = useAppNavigation();
  const videoRef = useRef<VideoRef>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [muted, setMuted] = useState(false);

  // 根据id获取视频源，这里暂时使用默认视频
  const background = require('./assets/video_test/123.mp4');

  // 自动隐藏控制栏
  useEffect(() => {
    if (showControls && !paused) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showControls, paused]);

  const onBuffer = () => {
    setLoading(true);
  };

  const onError = (error: any) => {
    console.error('视频播放错误:', error);
    setLoading(false);
  };

  const onLoad = (data: any) => {
    setDuration(data.duration);
    setLoading(false);
  };

  const onProgress = (data: any) => {
    setCurrentTime(data.currentTime);
  };

  const onEnd = () => {
    setPaused(true);
    setCurrentTime(0);
    videoRef.current?.seek(0);
  };

  const togglePlayPause = () => {
    setPaused(!paused);
    setShowControls(true);
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const seekTo = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={fullscreen} />
      
      {/* 视频播放器 */}
      <View style={[styles.videoContainer, fullscreen && styles.fullscreenContainer]}>
        <TouchableOpacity
          style={styles.videoTouchable}
          onPress={toggleControls}
          activeOpacity={1}
        >
          <Video
            ref={videoRef}
            source={background}
            style={styles.video}
            paused={paused}
            volume={volume}
            muted={muted}
            resizeMode="contain"
            onBuffer={onBuffer}
            onError={onError}
            onLoad={onLoad}
            onProgress={onProgress}
            onEnd={onEnd}
            progressUpdateInterval={1000}
          />
          
          {/* 加载指示器 */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          )}
          
          {/* 播放/暂停按钮 (中央) */}
          {showControls && (
            <TouchableOpacity
              style={styles.centerPlayButton}
              onPress={togglePlayPause}
            >
              <Icon
                name={paused ? 'play-arrow' : 'pause'}
                size={60}
                color="rgba(255, 255, 255, 0.9)"
              />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        
        {/* 控制栏 */}
        {showControls && (
          <>
            {/* 顶部控制栏 */}
            <View style={styles.topControls}>
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              <TouchableOpacity style={styles.moreButton}>
                <Icon name="more-vert" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            {/* 底部控制栏 */}
            <View style={styles.bottomControls}>
              {/* 播放控制按钮 */}
              <View style={styles.playControls}>
                <TouchableOpacity onPress={togglePlayPause}>
                  <Icon
                    name={paused ? 'play-arrow' : 'pause'}
                    size={28}
                    color="#fff"
                  />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={toggleMute} style={styles.muteButton}>
                  <Icon
                    name={muted ? 'volume-off' : 'volume-up'}
                    size={24}
                    color="#fff"
                  />
                </TouchableOpacity>
              </View>
              
              {/* 进度条和时间 */}
              <View style={styles.progressContainer}>
                <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${progressPercentage}%` },
                      ]}
                    />
                    <TouchableOpacity
                      style={[
                        styles.progressThumb,
                        { left: `${progressPercentage}%` },
                      ]}
                      onPress={() => {
                        // 这里可以添加拖拽进度条的逻辑
                      }}
                    />
                  </View>
                </View>
                
                <Text style={styles.timeText}>{formatTime(duration)}</Text>
              </View>
              
              {/* 全屏按钮 */}
              <TouchableOpacity onPress={toggleFullscreen}>
                <Icon
                  name={fullscreen ? 'fullscreen-exit' : 'fullscreen'}
                  size={24}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      
      {/* 非全屏时的额外内容区域 */}
      {!fullscreen && (
        <View style={styles.contentArea}>
          <Text style={styles.videoTitle}>{title}</Text>
          <Text style={styles.videoDescription}>
            这里可以添加视频描述、评论等内容
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
  topControls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginHorizontal: 16,
  },
  moreButton: {
    padding: 8,
  },
  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
  },
  playControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  muteButton: {
    marginLeft: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  progressBarContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ff6b6b',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    transform: [{ translateX: -8 }],
  },
  contentArea: {
    flex: 1,
    padding: 16,
    backgroundColor: '#1a1a1a',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  videoDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default VideoPlayer;
