/**
 * @Author Ligg
 * @Time 2025/7/5
 *
 * 播放器控件 - 极简版本
 **/
import React, {useEffect, useState} from 'react';
import {Dimensions, TouchableOpacity, View} from 'react-native';
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
import Icon from 'react-native-vector-icons/MaterialIcons';
import controlsStyle from './style';

interface VideoControlsProps {
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onSeek?: (time: number) => void;
  onPlayPause?: () => void;
}

const {width: screenWidth} = Dimensions.get('window');
const PROGRESS_BAR_WIDTH = screenWidth - 40 - 40 - 12; // 减去左右边距、按钮宽度和间距

const VideoControls: React.FC<VideoControlsProps> = ({
  currentTime = 0,
  duration = 0,
  isPlaying = false,
  onSeek,
  onPlayPause,
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
        <View style={styles.bottomProgressContainer}>
          <View style={styles.controlsRow}>
            {/* 暂停/播放按钮 */}
            <TouchableOpacity
              style={styles.playPauseButton}
              onPress={onPlayPause}
              activeOpacity={0.7}>
              <Icon
                style={styles.playPauseIcon}
                name={isPlaying ? 'pause' : 'play-arrow'}
                size={40}
                color="white"
              />
            </TouchableOpacity>

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
          </View>
        </View>
      </GestureHandlerRootView>
  );
};

export default VideoControls;
