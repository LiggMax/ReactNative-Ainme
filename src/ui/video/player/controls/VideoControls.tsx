/**
 * @Author Ligg
 * @Time 2025/7/5
 *
 * 播放器控件 - 极简版本
 **/
import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
import {IconButton} from 'react-native-paper';

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
import controlsStyle from './style';

interface VideoControlsProps {
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  onPlayPause?: () => void;
  isFullscreen?: boolean;
  onFullscreen?: () => void;
}

const {width: screenWidth} = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = screenWidth - 88; // 减去左右边距和IconButton宽度

const VideoControls: React.FC<VideoControlsProps> = ({
  currentTime = 0,
  duration = 0,
  isPlaying = false,
  onSeek,
  onPlayPause,
  isFullscreen = false, //全屏状态
  onFullscreen, //全屏回调
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const progress = useSharedValue(0);
  const thumbScale = useSharedValue(1);

  // 更新进度
  useEffect(() => {
    if (!isDragging && duration > 0) {
      progress.value = currentTime / duration;
    }
  }, [currentTime, duration, isDragging]);

  // 手势处理
  const gesture = Gesture.Pan()
    .onBegin(() => {
      'worklet';
      runOnJS(setIsDragging)(true);
      thumbScale.value = withSpring(1.3);
    })
    .onUpdate(event => {
      'worklet';
      progress.value = Math.max(0, Math.min(1, event.x / PROGRESS_BAR_WIDTH));
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
    const newProgress = Math.max(0, Math.min(1, touchX / PROGRESS_BAR_WIDTH));
    const seekTime = newProgress * duration;

    progress.value = newProgress;
    onSeek?.(seekTime);
  };

  // 样式
  const progressFillStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const progressThumbStyle = useAnimatedStyle(() => ({
    left: `${progress.value * 100}%`,
    transform: [{scale: thumbScale.value}],
  }));

  const styles = controlsStyle();

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.controlsRow}>
        {/* 暂停/播放按钮 */}
        <IconButton
          icon={isPlaying ? 'pause' : 'play'}
          size={32}
          iconColor={styles.progressFill.backgroundColor}
          onPress={onPlayPause}
        />
        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <GestureDetector gesture={gesture}>
            <TouchableOpacity
              style={styles.progressBar}
              onPress={handlePress}
              activeOpacity={1}>
              <View style={styles.progressTrack}>
                <Animated.View
                  style={[styles.progressFill, progressFillStyle]}
                />
                <Animated.View
                  style={[styles.progressThumb, progressThumbStyle]}
                />
              </View>
            </TouchableOpacity>
          </GestureDetector>
        </View>
        {/*全屏按钮*/}
        <IconButton
          icon={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
          size={35}
          iconColor={styles.progressFill.backgroundColor}
          onPress={onFullscreen}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default VideoControls;
