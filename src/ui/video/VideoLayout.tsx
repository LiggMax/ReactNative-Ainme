import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {VideoScreenProps} from '../../types/navigation';
import {useAppNavigation} from '../../navigation';
import VideoPlayer from './player';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StatusBarManager} from '../../components/StatusBarManager';
import animeDateService from '../../api/bangumi/anime/animeDate';
import {videoStyles} from './style';
import {Card,Icon, MD3Colors} from 'react-native-paper';
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';

const VideoLayout: React.FC<VideoScreenProps> = ({route}) => {
  const {id, title = '视频播放'} = route.params;
  const {goBack} = useAppNavigation();
  const [fullscreen, setFullscreen] = useState(false);
  const insets = useSafeAreaInsets();
  const [episodes, setEpisodes] = useState<any>(null); // 动画剧集数据

  // BottomDrawer ref
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);

  /**
   * 动态样式
   */
  const styles = videoStyles();

  // 根据id获取视频源，这里暂时使用默认视频
  const videoSource = null; // 可以根据id从API获取视频源

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
  }

  /**
   * 获取剧集播放数据
   */
  const getEpisodeData = async (episodeId: number) => {
    console.log('点击剧集', episodeId);
    closeDrawer()
  }
  // 组件卸载时解锁屏幕方向并恢复导航栏
  useEffect(() => {
    getEpisodes();
    return () => {
      Orientation.unlockAllOrientations();
      SystemNavigationBar.navigationShow();
    };
  }, []);

  const toggleFullscreen = () => {
    const newFullscreenState = !fullscreen;
    setFullscreen(newFullscreenState);

    if (newFullscreenState) {
      // 进入全屏时锁定为横屏并隐藏导航栏
      Orientation.lockToLandscape();
      SystemNavigationBar.navigationHide();
    } else {
      // 退出全屏时锁定为竖屏并显示导航栏
      Orientation.lockToPortrait();
      SystemNavigationBar.navigationShow();
    }
  };

  return (
    <View style={fullscreen ? styles.fullscreenWrapper : styles.container}>
      <StatusBarManager
        barStyle="light-content"
        backgroundColor="#000"
        translucent={fullscreen}
        hidden={fullscreen}
        useGlobalTheme={false}
      />

      {/* 非全屏时的安全区域包装 */}
      {!fullscreen && <View style={{paddingTop: insets.top}} />}

      {/* 视频播放器  */}
      <VideoPlayer
        id={id}
        title={title}
        videoSource={videoSource}
        fullscreen={fullscreen}
        onToggleFullscreen={toggleFullscreen}
        onBack={goBack}
      />

      {/* 视频信息区域 - 只在非全屏时显示 */}
      {!fullscreen && (
        <View style={[styles.infoContainer, {paddingBottom: insets.bottom}]}>
          <ScrollView>
            <View style={styles.videoInfoHeader}>
              <Text style={styles.videoTitle}>{title}</Text>
              <TouchableOpacity onPress={openDrawer}>
                <Icon
                  source="apps"
                  color={MD3Colors.neutralVariant0}
                  size={25}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      )}

      {/* 底部抽屉弹窗 */}
      <BottomDrawer
        ref={bottomDrawerRef}
        gestureMode="handle"
        backdropOpacity={0.3}
        customStyles={{
          container: styles.modalContent,
        }}
        initialHeight={Dimensions.get('window').height * 0.5}
        snapPoints={[
          Dimensions.get('window').height * 0.5,
          Dimensions.get('window').height,
        ]}
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
                getItemLayout={(data, index) => ({
                  length: 80, // 估算每个item的高度
                  offset: 80 * index,
                  index,
                })}
                renderItem={({item: episode}) => (
                  <Card mode="contained" style={styles.episodeItem} onPress={() => {
                    getEpisodeData(episode.id)
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
