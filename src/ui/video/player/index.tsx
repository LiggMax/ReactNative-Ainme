/**
 * @Author Ligg
 * @Time 2025/7/4
 *
 * 播放器核心组件
 */
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Text,
} from 'react-native';
import Video, { VideoRef } from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Controls from './controls/Controls.tsx';
import { playerStyles } from './style';
import { DEFAULT_VIDEO_CONFIG } from './Config';

interface VideoPlayerProps {
  id: number;
  title?: string;
  videoSource?: any;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onBack: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  title = '视频播放',
  fullscreen,
  onToggleFullscreen,
  onBack,
}) => {
  const videoRef = useRef<VideoRef>(null);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [loading, setLoading] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const [muted, setMuted] = useState(false);
  const [bufferedTime, setBufferedTime] = useState(0);

  //网络视频
  const url = 'https://lf-cdn.trae.com.cn/obj/trae-com-cn/bannerIntro425.mp4';
  const styles = playerStyles();

  // 自动隐藏控制栏
  useEffect(() => {
    if (showControls && !paused) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 300000);
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
    setBufferedTime(data.playableDuration || 0);
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

  const toggleMute = () => {
    setMuted(!muted);
  };

  const seekTo = (time: number) => {
    videoRef.current?.seek(time);
    setCurrentTime(time);
  };

  return (
    <View style={[styles.videoContainer, fullscreen && styles.fullscreenContainer]}>
      <TouchableOpacity
        style={styles.videoTouchable}
        onPress={toggleControls}
        activeOpacity={1}
      >
        <Video
          ref={videoRef}
          source={{uri: url}}
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
          {...DEFAULT_VIDEO_CONFIG}
        />

        {/* 加载指示器 */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>加载中...</Text>
          </View>
        )}


      </TouchableOpacity>

      {/* 视频控制组件 */}
      <Controls
        visible={showControls}
        paused={paused}
        currentTime={currentTime}
        duration={duration}
        bufferedTime={bufferedTime}
        title={title}
        muted={muted}
        onSeek={seekTo}
        onPlayPause={togglePlayPause}
        isFullscreen={fullscreen}
        onFullscreen={onToggleFullscreen}
        onBack={onBack}
        onMute={toggleMute}
      />
    </View>
  );
};

export default VideoPlayer;
