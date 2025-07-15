/**
 * @Author Ligg
 * @Time 2025/7/14
 *
 * 视频资源
 **/
import React, {useEffect, useRef, useState} from 'react';
import {FlatList, View} from 'react-native';
import {Button, Text, Card} from 'react-native-paper';
import {videoStyles} from './assets/style';
import BottomDrawer, {
  BottomDrawerMethods,
} from 'react-native-animated-bottom-drawer';
import {
  getEpisodesService,
  getSearchOnePieceService,
  getVideoUrlService,
} from '../../api/video/request/VideoFeed.ts';
import {EpisodeItem} from '../../api/video/parse/types.ts';

interface Data {
  animeTitle: string;
  ep: number;
  onVideoUrlReceived?: (videoUrl: any) => void; // 回调函数，用于传递视频URL数据
}

const VideoData = ({animeTitle, ep, onVideoUrlReceived}: Data) => {
  // BottomDrawer ref
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);
  const styles = videoStyles();

  /**
   * 条目列表
   */
  const [episodeList, setEpisodeList] = useState<EpisodeItem[]>([]);

  /**
   * 搜索条目
   */
  const getEntry = async () => {
    try {
      //搜索列表
      const searchList = await getSearchOnePieceService(animeTitle);
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

  /**
   * 搜索视频
   * @param {string} url - 播放页地址
   */
  const getVideoUrl = async (url: string) => {
    try {
      //先关闭抽屉弹窗
      bottomDrawerRef.current?.close();
      //搜索视频资源
      const videoUrl = await getVideoUrlService(url);
      console.log('获取到视频URL:', videoUrl);
      
      // 通过回调函数将视频URL数据传递给父组件
      if (onVideoUrlReceived && videoUrl) {
        onVideoUrlReceived(videoUrl);
      }
    } catch (error) {
      console.error('获取视频URL失败:', error);
    }
  };

  useEffect(() => {
    getEntry();
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
          <Text style={{fontWeight: 'bold', fontSize: 20, marginBottom: 10}}>
            视频资源
          </Text>

          {episodeList.length > 0 ? (
            <FlatList
              data={episodeList}
              keyExtractor={(item, index) => `${item.line}-${item.ep}-${index}`}
              renderItem={({item}) => (
                <Card
                  mode="outlined"
                  onPress={() => {
                    getVideoUrl(item.url);
                  }}
                  style={styles.chip}>
                  <View style={styles.cardContent}>
                    <View style={styles.chipContent}>
                      <Text style={styles.chipText}>{item.line}</Text>
                      <Text> 第{item.ep}集</Text>
                    </View>
                    <View style={styles.chipActions}>
                      <View>
                        <Text>123</Text>
                      </View>
                      <View>
                        <Button mode="outlined">播放</Button>
                      </View>
                    </View>
                  </View>
                </Card>
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
