/**
 * @Author Ligg
 * @Time 2025/7/4
 *
 * 播放器
 */
import Video, {VideoRef, OnLoadData, OnProgressData} from 'react-native-video';
import {useRef, useState, useEffect} from 'react';
import {playerStyles} from './style';
import {DEFAULT_VIDEO_CONFIG} from './Config';
import {View, StatusBar} from 'react-native';
import VideoControls from './controls/VideoControls';
import {useAppNavigation} from '../../../navigation';
import Orientation from 'react-native-orientation-locker';

interface VideoPlayerProps {
  title?: string;
}

const VideoPlayer = ({ title}: VideoPlayerProps) => {
  const videoRef = useRef<VideoRef>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedTime, setBufferedTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const {goBack, canGoBack} = useAppNavigation();

  // 组件挂载时设置初始方向
  useEffect(() => {
    // 初始化为竖屏模式
    Orientation.lockToPortrait();

    // 组件卸载时解锁所有方向
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  /**
   * 动态样式
   */
  const styles = playerStyles(isFullscreen);

  // 视频加载完成回调
  const onLoad = (data: OnLoadData) => {
    console.log('视频加载完成:', data);
    setDuration(data.duration);
  };

  // 视频播放进度回调
  const onProgress = (data: OnProgressData) => {
    setCurrentTime(data.currentTime);
    // 更新缓存进度 (playableDuration 表示已缓存的时长)
    setBufferedTime(data.playableDuration || 0);
  };
  // 全屏切换函数
  const toggleFullscreen = () => {
    if (isFullscreen) {
      // 退出全屏时恢复竖屏
      Orientation.lockToPortrait();
      // 恢复状态栏显示
      StatusBar.setHidden(false, 'fade');
      setIsFullscreen(false);
    } else {
      // 进入全屏时切换到横屏
      Orientation.lockToLandscape();
      // 隐藏状态栏以获得更好的全屏体验
      StatusBar.setHidden(true, 'fade');
      setIsFullscreen(true);
    }
  };

  // 移除原生全屏回调，改用自定义全屏
  // 进度条拖拽回调
  const onSeek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.seek(time);
    }
  };

  // 播放/暂停控制
  const onPlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        // 暂停状态会通过 onPlaybackStateChanged 回调自动设置
      } else {
        videoRef.current.resume();
        // 播放状态会通过 onPlaybackStateChanged 回调自动设置
      }
    }
  };

  // 播放状态变化回调
  const onPlaybackStateChanged = (data: any) => {
    console.log('播放状态变化:', data);
    // 根据播放状态更新 isPlaying
    if (data.isPlaying !== undefined) {
      setIsPlaying(data.isPlaying);
    }
  };

  // 视频错误回调
  function onError() {}

  // 远端视频缓冲回调
  function onBuffer() {}

  let url = 'https://lf-cdn.trae.com.cn/obj/trae-com-cn/bannerIntro425.mp4';
  return (
    <View style={isFullscreen ? styles.fullscreenContainer : styles.container}>
      <Video
        // 视频源配置
        source={{
          uri: url,
        }}
        ref={videoRef}
        // 视频加载完成回调
        onLoad={onLoad}
        // 视频播放进度回调
        onProgress={onProgress}
        // 播放状态变化回调
        onPlaybackStateChanged={onPlaybackStateChanged}
        // 远端视频缓冲回调
        onBuffer={onBuffer}
        // 视频无法加载回调
        onError={onError}
        // 视频结束回调
        onEnd={() => {}}
        // 添加样式使视频可见
        style={styles.backgroundVideo}
        // 使用配置文件中的播放器配置
        {...DEFAULT_VIDEO_CONFIG}
      />
      {/*自定义控件*/}
      <VideoControls
        title={title}
        currentTime={currentTime}
        duration={duration}
        bufferedTime={bufferedTime}
        isPlaying={isPlaying}
        onSeek={onSeek}
        onPlayPause={onPlayPause}
        isFullscreen={isFullscreen}
        onFullscreen={toggleFullscreen}
        onBack={() => {
          // 返回到上一个导航页面
          if (canGoBack()) {
            goBack();
          }
        }}
      />
    </View>
  );
};
export default VideoPlayer;
