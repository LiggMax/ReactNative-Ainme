// Load the module
import Video, { VideoRef } from 'react-native-video';
import {useRef} from 'react';
import {StyleSheet} from 'react-native';

// Inside your render function, assuming you have a file called
// "background.mp4" in your project. You can include multiple videos
// on a single screen if needed.

const VideoPlayer = () => {
  const videoRef = useRef<VideoRef>(null);
  const background = require('./assets/video_test/123.mp4');

  function onBuffer() {

  }

  function onError() {

  }

  return (
    <Video
      // Can be a URL or a local file.
      source={background}
      // Store reference
      ref={videoRef}
      // Callback when remote video is buffering
      onBuffer={onBuffer}
      // Callback when the video cannot be loaded
      onError={onError}
      style={styles.backgroundVideo}
    />
  );
};

export default VideoPlayer;
// Later in your styles...
const styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
