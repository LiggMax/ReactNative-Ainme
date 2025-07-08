/**
 * @Author Ligg
 * @Time 2025/7/4
 *
 * 播放器
 */
import Video, {} from 'react-native-video';
import {DEFAULT_VIDEO_CONFIG} from './Config';
import {View} from 'react-native';

interface VideoPlayerProps {
  title?: string;
}

const VideoPlayer = ({ title}: VideoPlayerProps) => {

  let url = 'https://lf-cdn.trae.com.cn/obj/trae-com-cn/bannerIntro425.mp4';
  const locaLhVideo = require('../assets/video_test/123.mp4')
  return (
    <View>
      <Video
        // 视频源配置
        source={locaLhVideo}
          onEnd={() => {}}
        // 使用配置文件中的播放器配置
        {...DEFAULT_VIDEO_CONFIG}
      />
    </View>
  );
};
export default VideoPlayer;
