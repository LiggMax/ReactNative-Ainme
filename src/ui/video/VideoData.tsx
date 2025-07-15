/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 视频资源
 **/
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, View, TouchableOpacity} from 'react-native';
import {Button, Text, Chip} from 'react-native-paper';
import {videoStyles} from './assets/style';
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';
import {
  getEpisodesService,
  getSearchOnePieceService,
} from '../../api/video/request/VideoFeed.ts';
import {EpisodeItem} from '../../api/video/parse/types.ts';

interface Data {
  AnimeTitle: string;
  ep: number;
}

const VideoData = ({AnimeTitle, ep}: Data) => {
  // BottomDrawer ref
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);
  const styles = videoStyles();

  /**
   * 剧集列表
   */
  const [episodeList, setEpisodeList] = useState<EpisodeItem[]>([]);

  /**
   * 搜索视频
   */
  const getVideo = async () => {
    try {
      //搜索列表
      const searchList = await getSearchOnePieceService(AnimeTitle);
      console.log('搜索结果', searchList);

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
      setEpisodeList(Episodes);
      console.log('剧集数据', Episodes);
    } catch (error) {
      console.error('获取视频数据失败:', error);
    }
  };
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
        initialHeight={400}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={{padding: 16}}>
          <Text variant="headlineSmall" style={{marginBottom: 16, textAlign: 'center'}}>
            剧集列表
          </Text>

          {episodeList.length > 0 ? (
            <FlatList
              data={episodeList}
              keyExtractor={(item, index) => `${item.line}-${item.ep}-${index}`}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={{
                    marginBottom: 8,
                    padding: 12,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 8,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    console.log('选择剧集:', item);
                    // 这里可以添加播放逻辑
                    bottomDrawerRef.current?.close();
                  }}>
                  <View style={{flex: 1}}>
                    <Text variant="bodyLarge">第 {item.ep} 集</Text>
                    <Text variant="bodySmall" style={{opacity: 0.7}}>
                      {item.url}
                    </Text>
                  </View>
                  <Chip mode="outlined" compact>
                    {item.line}
                  </Chip>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              style={{maxHeight: 400}}
            />
          ) : (
            <View style={{alignItems: 'center', padding: 20}}>
              <Text variant="bodyMedium" style={{opacity: 0.7}}>
                暂无剧集数据
              </Text>
            </View>
          )}
        </View>
      </BottomDrawer>
    </View>
  );
};
export default VideoData;
