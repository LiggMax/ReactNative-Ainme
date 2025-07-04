// Load the module
import Video, {VideoRef} from 'react-native-video';
import {useRef} from 'react';
import {playerStyles} from './style'

/**
 * 动态样式
 */
const styles = playerStyles();

const VideoPlayer = () => {

  const videoRef = useRef<VideoRef>(null);


  // 视频错误回调
  function onError() {}

  // 远端视频缓冲回调
  function onBuffer() {}

  return (
    <Video
      // 可以是 URL 或本地文件。
      source={{
        uri: 'https://hydownload.pan.wo.cn/openapi/download?fid=cuMwJ_Awyv/9Vz90UFRmmYt0tBkUEjxpzM%2B1farvUAsAM4oFwLFCvpwYx4V930TI7mwaZA1Q0ns%2BY5fuhs2U7N85AHKw==',
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
