/**
 * @Author Ligg
 * @Time 2025/7/5
 *
 * 播放器控件
 **/
import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import controlsStyle from './style';

interface VideoControlsProps {
  visible: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  bufferedTime: number;
  title: string;
  muted: boolean;
  onSeek: (time: number) => void;
  onPlayPause: () => void;
  isFullscreen: boolean;
  onFullscreen: () => void;
  onBack: () => void;
  onMute: () => void;
}

// 动态获取进度条宽度，适配横竖屏切换
const getProgressBarWidth = (screenWidth: number, isFullscreen: boolean) => {
  if (isFullscreen) {
    // 全屏模式使用当前屏幕宽度
    return screenWidth - 88;
  } else {
    // 非全屏模式使用容器宽度（通常是屏幕宽度）
    const {width} = Dimensions.get('window');
    return width - 88;
  }
};

// 格式化时间函数
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs
    .toString()
    .padStart(2, '0')}`;
};

const VideoControls: React.FC<VideoControlsProps> = ({
  visible,
  paused,
  currentTime,
  duration,
  bufferedTime,
  title,
  muted,
  onSeek,
  onPlayPause,
  isFullscreen,
  onFullscreen,
  onBack,
  onMute,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [screenData, setScreenData] = useState(Dimensions.get('window'));
  const progress = useSharedValue(0);
  const bufferedProgress = useSharedValue(0);
  const thumbScale = useSharedValue(1);
  const insets = useSafeAreaInsets();

  const styles = controlsStyle();

  // 监听屏幕方向变化
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenData(window);
    });
    return () => subscription?.remove();
  }, []);

  // 更新进度
  useEffect(() => {
    if (!isDragging && duration > 0) {
      progress.value = currentTime / duration;
    }
  }, [currentTime, duration, isDragging]);

  // 更新缓存进度
  useEffect(() => {
    if (duration > 0) {
      bufferedProgress.value = bufferedTime / duration;
    }
  }, [bufferedTime, duration]);

  // 手势处理
  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      runOnJS(setIsDragging)(true);
      thumbScale.value = withSpring(1.3);
    })
    .onUpdate(event => {
      'worklet';
      const progressBarWidth = getProgressBarWidth(screenData.width, isFullscreen);
      progress.value = Math.max(0, Math.min(1, event.x / progressBarWidth));
    })
    .onEnd(() => {
      'worklet';
      const seekTime = progress.value * duration;
      thumbScale.value = withSpring(1);

      if (onSeek) {
        runOnJS(onSeek)(seekTime);
      }
      runOnJS(setIsDragging)(false);
    });

  // 点击处理
  const handlePress = (event: any) => {
    if (isDragging) return;

    const touchX = event.nativeEvent.locationX;
    const progressBarWidth = getProgressBarWidth(screenData.width, isFullscreen);
    const newProgress = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const seekTime = newProgress * duration;

    progress.value = newProgress;
    onSeek?.(seekTime);
  };

  // 样式
  const progressFillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const bufferedFillStyle = useAnimatedStyle(() => ({
    width: `${bufferedProgress.value * 100}%`,
  }));

  const progressThumbStyle = useAnimatedStyle(() => ({
    left: `${progress.value * 100}%`,
    transform: [{scale: thumbScale.value}],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* 顶部控制栏 */}
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.3)', 'transparent']}
        style={styles.topGradient}>
        <View style={styles.topControls}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="more-vert" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* 底部控制栏 */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
        style={styles.bottomGradient}>
        <View style={styles.bottomControls}>
          {/* 时间标签 */}
          <View style={styles.playControls}>
            <Text style={styles.timeText}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
          </View>
          <View style={styles.progressContainer}>
            {/*播放、暂停按钮*/}
            <TouchableOpacity onPress={onPlayPause}>
              <Icon
                name={paused ? 'play-arrow' : 'pause'}
                size={28}
                color="#fff"
              />
            </TouchableOpacity>

            {/*音量按钮*/}
            <TouchableOpacity onPress={onMute}>
              <Icon
                name={muted ? 'volume-off' : 'volume-up'}
                size={24}
                color="#fff"
              />
            </TouchableOpacity>

            <View style={styles.progressBarContainer}>
              <GestureDetector gesture={gesture}>
                <TouchableOpacity
                  style={styles.progressBar}
                  onPress={handlePress}
                  activeOpacity={1}>
                  <View style={styles.progressTrack}>
                    {/* 缓存进度条 */}
                    <Animated.View
                      style={[styles.bufferedFill, bufferedFillStyle]}
                    />
                    {/* 播放进度条 */}
                    <Animated.View
                      style={[styles.progressFill, progressFillStyle]}
                    />
                    {/* 拖动按钮 */}
                    <Animated.View
                      style={[styles.progressThumb, progressThumbStyle]}
                    />
                  </View>
                </TouchableOpacity>
              </GestureDetector>
            </View>

            {/* 全屏按钮 */}
            <TouchableOpacity onPress={onFullscreen}>
              <Icon
                name={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                size={28}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </GestureHandlerRootView>
  );
};

export default VideoControls;
