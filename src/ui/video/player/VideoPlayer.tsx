import React from 'react';
import {View} from 'react-native';
import VideoPlayer from 'react-native-video-player';

const Player = () => (
  <View style={{ flex: 1 }}>
    <VideoPlayer
      source={{ uri: 'https://lf-cdn.trae.com.cn/obj/trae-com-cn/bannerIntro425.mp4' }}
      thumbnail={{ uri: 'https://example.com/thumbnail.jpg' }}
      autoplay
    />
  </View>
);

export default Player;
