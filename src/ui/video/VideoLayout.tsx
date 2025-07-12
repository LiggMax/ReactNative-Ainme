import React, {useState, useEffect, useRef} from 'react';
import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {VideoScreenProps} from '../../types/navigation';
import {useAppNavigation} from '../../navigation';
import VideoPlayer from './player';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StatusBarManager} from '../../components/StatusBarManager';
import animeDateService from '../../api/bangumi/anime/animeDate';
import {videoStyles} from './style';
import {Icon, MD3Colors} from 'react-native-paper';
import BottomDrawer, {BottomDrawerMethods} from 'react-native-animated-bottom-drawer';

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
        initialHeight={400}
        gestureMode="content"
        backdropOpacity={0.5}
        backdropColor="black"
      >
        <View style={styles.drawerContainer}>
          {/* 抽屉头部 */}
          <View style={styles.drawerHeader}>
            <Text style={styles.drawerTitle}>剧集列表</Text>
            <TouchableOpacity onPress={() => bottomDrawerRef.current?.close()}>
              <Icon
                source="close"
                color="#666"
                size={24}
              />
            </TouchableOpacity>
          </View>

          {/* 剧集列表内容 */}
          <ScrollView style={styles.drawerScrollView}>
            {episodes && episodes.length > 0 ? (
              episodes.map((episode: any, index: number) => (
                <TouchableOpacity
                  key={index}
                  style={styles.episodeItem}
                  onPress={() => {
                    // 这里可以添加切换剧集的逻辑
                    console.log('选择剧集:', episode);
                    bottomDrawerRef.current?.close();
                  }}
                >
                  <Text style={styles.episodeNumber}>第 {index + 1} 集</Text>
                  <Text style={styles.episodeTitle}>{episode.title || `剧集 ${index + 1}`}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>暂无剧集数据</Text>
              </View>
            )}
          </ScrollView>
        </View>
      </BottomDrawer>
    </View>
  );
};
export default VideoLayout;
