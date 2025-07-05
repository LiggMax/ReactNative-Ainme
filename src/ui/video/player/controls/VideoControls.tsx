/**
 * @Author Ligg
 * @Time 2025/7/5
 *
 * 播放器控件
 **/
import React, {useState, useRef, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
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
  onSeek?: (time: number) => void;
}

const {width: screenWidth} = Dimensions.get('window');

const VideoControls: React.FC<VideoControlsProps> = ({
  currentTime = 0,
  duration = 0,
  onSeek,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<View>(null);
  const progressBarWidth = useMemo(() => screenWidth - 40, []);

  // 使用 react-native-reanimated 的 SharedValue
  const initialProgress = duration > 0 ? currentTime / duration : 0;
  const progressValue = useSharedValue(initialProgress);
  const thumbScale = useSharedValue(1);
  const thumbPosition = useSharedValue(initialProgress);
  const isDraggingValue = useSharedValue(false);

  // 将需要在 worklet 中使用的值转换为共享值
  const progressBarWidthValue = useSharedValue(progressBarWidth);
  const durationValue = useSharedValue(duration);

  // 动画更新进度
  const animateToProgress = useCallback((progress: number, animationDuration: number = 200) => {
    progressValue.value = withTiming(progress, { duration: animationDuration });
    thumbPosition.value = withTiming(progress, { duration: animationDuration });
  }, [progressValue, thumbPosition]);

  // 监听进度变化并触发动画
  useEffect(() => {
    if (!isDragging) {
      const progress = duration > 0 ? currentTime / duration : 0;
      // 直接设置值，避免不必要的动画
      progressValue.value = progress;
      thumbPosition.value = progress;
    }
    // 更新共享值
    durationValue.value = duration;
  }, [currentTime, duration, isDragging, progressValue, thumbPosition, durationValue]);

  // 更新进度条宽度共享值
  useEffect(() => {
    progressBarWidthValue.value = progressBarWidth;
  }, [progressBarWidth, progressBarWidthValue]);

  // 延迟设置拖拽状态的函数
  const setDraggingWithDelay = useCallback(() => {
    setTimeout(() => {
      setIsDragging(false);
    }, 100);
  }, []);

  // 手势处理
  const panGesture = useMemo(() => {
    const onBeginWorklet = (event: any) => {
      'worklet';
      isDraggingValue.value = true;
      runOnJS(setIsDragging)(true);

      const progress = Math.max(0, Math.min(1, event.x / progressBarWidthValue.value));
      progressValue.value = progress;
      thumbPosition.value = progress;

      // 拖拽开始时的缩放动画效果
      thumbScale.value = withSpring(1.3, {
        damping: 15,
        stiffness: 150,
      });
    };

    const onUpdateWorklet = (event: any) => {
      'worklet';
      const progress = Math.max(0, Math.min(1, event.x / progressBarWidthValue.value));
      progressValue.value = progress;
      thumbPosition.value = progress;
    };

    const onEndWorklet = () => {
      'worklet';
      isDraggingValue.value = false;
      
      const seekTime = progressValue.value * durationValue.value;
      if (onSeek) {
        runOnJS(onSeek)(seekTime);
      }

      // 拖拽结束时的缩放动画效果
      thumbScale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });

      // 延迟设置isDragging状态，避免useEffect立即触发动画
      runOnJS(setDraggingWithDelay)();
    };

    return Gesture.Pan()
      .onBegin(onBeginWorklet)
      .onUpdate(onUpdateWorklet)
      .onEnd(onEndWorklet);
  }, [progressBarWidthValue, durationValue, onSeek, progressValue, thumbPosition, thumbScale, isDraggingValue, setDraggingWithDelay]);

  // 进度条点击处理
  const handleProgressPress = useCallback((evt: any) => {
    const touchX = evt.nativeEvent.locationX;
    const progress = Math.max(0, Math.min(1, touchX / progressBarWidth));
    const seekTime = progress * duration;
    onSeek?.(seekTime);

    // 点击时的动画效果
    animateToProgress(progress, 300);
  }, [progressBarWidth, duration, onSeek, animateToProgress]);

  // 注意：进度显示现在完全由动画值控制，不再需要displayProgress变量

  /**
   * 动态样式
   */
  const styles =controlsStyle();

  // 进度条填充动画样式
  const progressFillAnimStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value * 100}%`,
    };
  });

  // 进度条拖拽圆点动画样式
  const progressThumbAnimStyle = useAnimatedStyle(() => {
    return {
      left: `${thumbPosition.value * 100}%`,
      transform: [
        {
          scale: thumbScale.value,
        },
      ],
    };
  });

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* 底部进度条 */}
      <View style={styles.bottomProgressContainer}>
        <GestureDetector gesture={panGesture}>
          <TouchableOpacity
            style={styles.progressBar}
            onPress={handleProgressPress}
            activeOpacity={1}>
            <View style={styles.progressTrack} ref={progressBarRef}>
              <Animated.View
                style={[
                  styles.progressFill,
                  progressFillAnimStyle,
                ]}
              />
              <Animated.View
                style={[
                  styles.progressThumb,
                  progressThumbAnimStyle,
                ]}
              />
            </View>
          </TouchableOpacity>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
};
export default VideoControls;
