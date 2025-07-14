/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 视频资源
 **/
import React, {useEffect, useRef} from 'react';
import {View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {videoStyles} from './assets/style';
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';
import {getEpisodesService, getSearchOnePieceService} from '../../api/video/request/VideoFeed.ts';

interface Data{
  AnimeTitle: string;
  ep: number;
}
const VideoData = ({AnimeTitle,ep}: Data) => {
  // BottomDrawer ref
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);
  const styles = videoStyles();

  /**
   * 搜索视频
   */
  const getVideo = async () => {
    try {
      //搜索列表
      const searchList = await getSearchOnePieceService(AnimeTitle);
      console.log('搜索结果',searchList);
      
      // 检查搜索结果是否为空
      if (!searchList || searchList.length === 0) {
        console.log('没有找到搜索结果');
        return;
      }
      
      // 取第一个搜索结果
      const firstResult = searchList[0];
      if (!firstResult.link) {
        console.log('搜索结果中没有有效链接');
        return;
      }
      
      //资源列表
      const Episodes = await getEpisodesService(firstResult.link, ep);
      console.log('资源列表',Episodes);
    } catch (error) {
      console.error('获取视频数据失败:', error);
    }
  }
  useEffect(() => {
    getVideo();
  }, []);
  return (
    <View style={styles.layout}>
      <View>
        <Text>数据源</Text>
      </View>
      <View>
        <Button
          mode={'contained'}
          icon={'compare-horizontal'}
          onPress={() => {
            bottomDrawerRef.current?.open();
          }}>
          更换
        </Button>
      </View>

      {/*抽屉弹窗*/}
      <BottomDrawer
        ref={bottomDrawerRef}
        customStyles={{
          container: styles.modalContent,
        }}
        onClose={() => {}}>
        <View style={styles.drawerContainer}>
          <Text>数据源</Text>
        </View>
      </BottomDrawer>
    </View>
  );
};
export default VideoData;
