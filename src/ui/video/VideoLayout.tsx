import React, {useState, useEffect, useRef} from 'react';
import {View, TouchableOpacity, FlatList} from 'react-native';
import {VideoScreenProps} from '../../types/navigation';
import {useAppNavigation} from '../../navigation';
import Player from './player/VideoPlayer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StatusBarManager} from '../../components/StatusBarManager';
import animeDateService from '../../api/bangumi/anime/animeDate';
import {videoStyles} from './assets/style.ts';
import {Text, Card, Icon} from 'react-native-paper';
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';
import VideoData from './VideoData.tsx';

const VideoLayout: React.FC<VideoScreenProps> = ({route}) => {
  const {id, title = '视频播放'} = route.params;
  const {goBack} = useAppNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [episodes, setEpisodes] = useState<any>(null); // 动画剧集数据
  const [videoUrl, setVideoUrl] = useState<any>(null); // 视频URL数据

  // BottomDrawer ref
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);

  /**
   * 动态样式
   */
  const styles = videoStyles();

  /**
   * 获取剧集列表
   */
  const getEpisodes = async () => {
    try {
      const episodes = await animeDateService.getEpisodesService(id);
      setEpisodes(episodes);
      console.log('剧集列表:', episodes);
    } catch (err) {
      console.error('❌ 获取剧集列表失败:', err);
    }
  };

  /**
   * 打开底部抽屉
   */
  const openDrawer = () => {
    bottomDrawerRef.current?.open();
  };

  /**
   * 关闭抽屉
   */
  const closeDrawer = () => {
    bottomDrawerRef.current?.close();
  };

  /**
   * 获取剧集播放数据
   */
  const getEpisodeData = async (episodeId: number) => {
    console.log('点击剧集', episodeId);
    closeDrawer();
  };

  /**
   * 处理从VideoData组件传递回来的视频URL数据
   */
  const handleVideoUrlReceived = (videoUrlData: any) => {
    console.log('VideoLayout接收到视频URL数据:', videoUrlData);
    setVideoUrl(videoUrlData);
    setIsLoading(false);
  };

  /**
   * 视频播放器事件处理
   */
  const handleVideoLoad = () => {
    console.log('视频加载完成');
    setIsLoading(false);
  };

  const handleVideoError = (error: any) => {
    console.error('视频播放错误:', error);
    setIsLoading(false);
  };

  const handleVideoEnd = () => {
    console.log('视频播放结束');
  };

  const handleVideoProgress = (data: any) => {
    // console.log('视频播放进度:', data);
  };
  useEffect(() => {
    getEpisodes();
    setIsLoading(true);
  }, []);



  return (
    <View style={styles.container}>
      <StatusBarManager
        barStyle="light-content"
        backgroundColor="#000"
        translucent={false}
        hidden={false}
        useGlobalTheme={false}
      />

      {/* 安全区域包装 */}
      <View style={{paddingTop: insets.top}} />

      {/* 视频播放器  */}
      <View style={styles.videoPlayerWrapper}>
        <Player
          videoUrl={videoUrl?.url || videoUrl}
          autoplay={false}
          muted={false}
          repeat={false}
          showDuration={true}
          disableFullscreen={false}
          pauseOnPress={true}
          endWithThumbnail={true}
          thumbnail={{uri: 'https://via.placeholder.com/1600x900/1a1a1a/ffffff?text=Loading...'}}
          onLoad={handleVideoLoad}
          onError={handleVideoError}
          onEnd={handleVideoEnd}
          onProgress={handleVideoProgress}
        />
      </View>

      {/* 视频信息区域 */}
      <View style={[styles.infoContainer]}>
        <View style={styles.videoInfoHeader}>
          <Text style={styles.videoTitle}>{title}</Text>
          <TouchableOpacity onPress={openDrawer}>
            <Icon source="apps" size={25} />
          </TouchableOpacity>
        </View>

        <Card style={styles.data}>
          <VideoData
            animeTitle={title}
            ep={1}
            onVideoUrlReceived={handleVideoUrlReceived}
          />
        </Card>
      </View>

      {/* 底部抽屉弹窗 */}
      <BottomDrawer
        ref={bottomDrawerRef}
        gestureMode="handle"
        backdropOpacity={0.3}
        customStyles={{
          container: styles.modalContent,
        }}
        enableSnapping={true}>
        <View style={styles.drawerContainer}>
          {/* 抽屉头部 */}
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>剧集列表</Text>
          </View>

          {/* 剧集列表内容 */}
          <View style={styles.drawerScrollView}>
            {episodes && episodes.data && episodes.data.length > 0 ? (
              <FlatList
                data={episodes.data}
                keyExtractor={item => item.id.toString()}
                showsVerticalScrollIndicator={false}
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={10}
                initialNumToRender={8}
                renderItem={({item: episode}) => (
                  <Card
                    mode="contained"
                    style={styles.episodeItem}
                    onPress={() => {
                      getEpisodeData(episode.id);
                    }}>
                    <View style={styles.episodeHeader}>
                      <Text style={styles.episodeNumber}>
                        第 {episode.ep} 集
                      </Text>
                      <Text style={styles.episodeDate}>{episode.airdate}</Text>
                    </View>
                    <View style={styles.episodeBody}>
                      {episode.name_cn != '' || episode.name != '' ? (
                        <Text style={styles.episodeTitle}>
                          {episode.name_cn || episode.name}
                        </Text>
                      ) : (
                        <Text style={styles.episodeTitle}>未更新</Text>
                      )}
                      {episode.comment > 0 && (
                        <Text style={styles.episodeComment}>
                          {episode.comment} 条评论
                        </Text>
                      )}
                    </View>
                  </Card>
                )}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无剧集数据</Text>
              </View>
            )}
          </View>
        </View>
      </BottomDrawer>
    </View>
  );
};
export default VideoLayout;
