import React from 'react';
import {View, Text} from 'react-native';
import VideoPlayer, {VideoPlayerRef} from 'react-native-video-player';
import {playerStyles} from './style';

interface PlayerProps {
  videoUrl?: string | {uri: string} | null;
  autoplay?: boolean;
  muted?: boolean;
  repeat?: boolean;
  showDuration?: boolean;
  disableFullscreen?: boolean;
  pauseOnPress?: boolean;
  endWithThumbnail?: boolean;
  thumbnail?: {uri: string};
  onLoad?: () => void;
  onError?: (error: any) => void;
  onEnd?: () => void;
  onProgress?: (data: any) => void;
}

const Player: React.FC<PlayerProps> = ({
  videoUrl,
  autoplay = false,
  muted = false,
  repeat = false,
  showDuration = true,
  disableFullscreen = false,
  pauseOnPress = true,
  endWithThumbnail = true,
  thumbnail = {uri: 'https://via.placeholder.com/1600x900/000000/FFFFFF?text=Video+Thumbnail'},
  onLoad,
  onError,
  onEnd,
  onProgress,
}) => {
  const videoPlayerRef = React.useRef<VideoPlayerRef>(null);
  const styles = playerStyles();

  // 处理视频源
  const source = React.useMemo(() => {
    if (!videoUrl) return null;
    return typeof videoUrl === 'string' ? {uri: videoUrl} : videoUrl;
  }, [videoUrl]);

  // 如果没有视频源，显示占位符
  if (!source) {
    return (
      <View style={styles.videoContainer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>等待视频加载...</Text>
        </View>
      </View>
    );
  }

  return (
    <VideoPlayer
      ref={videoPlayerRef}
      source={source}
      style={styles.videoContainer}
      videoWidth={1600}
      videoHeight={900}
      thumbnail={thumbnail}
      autoplay={autoplay}
      muted={muted}
      repeat={repeat}
      showDuration={showDuration}
      disableFullscreen={disableFullscreen}
      pauseOnPress={pauseOnPress}
      endWithThumbnail={endWithThumbnail}
      controlsTimeout={30000}
      onLoad={onLoad}
      onError={onError}
      onEnd={onEnd}
      onProgress={onProgress}
    />
  );
};

export default Player;
