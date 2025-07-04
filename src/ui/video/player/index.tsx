// Load the module
import Video, {VideoRef} from 'react-native-video';
import {useRef} from 'react';
import {playerStyles} from './style'

const VideoPlayer = () => {
  const videoRef = useRef<VideoRef>(null);
  
  /**
   * 动态样式
   */
  const styles = playerStyles();


  // 视频错误回调
  function onError() {}

  // 远端视频缓冲回调
  function onBuffer() {}

  return (
    <Video
      // 可以是 URL 或本地文件。
      source={{
        uri: 'https://m3u8.girigirilove.com/addons/aplyer/atom.php?key=0&url=https://m3u8.girigirilove.com/zijian/oldanime/2025/07/cht/DanDaDanS2CHT/13/playlist.m3u8',
      }}

      ref={videoRef}
      // 远端视频缓冲回调
      onBuffer={onBuffer}
      // 视频无法加载回调
      onError={onError}
      //视频结束回调
      onEnd={() => {}}
      // 添加样式使视频可见
      style={styles.backgroundVideo}
      // 显示控制条
      controls={true}
      // 自动播放
      paused={true}
      // 调整模式
      resizeMode="contain"
    />
  );
};
export default VideoPlayer;
