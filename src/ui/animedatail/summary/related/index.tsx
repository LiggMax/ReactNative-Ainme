/**
 * 番剧相关条目
 */
import React, {useEffect, useState} from 'react';
import {View, FlatList, Dimensions} from 'react-native';
import {Card,Text} from 'react-native-paper';
import animeDate from '../../../../api/bangumi/anime/animeDate.ts';
import {useStyles} from './style.ts';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

interface RelatedItem {
  images: {
    small: string;
    grid: string;
    large: string;
    medium: string;
    common: string;
  };
  name: string;
  name_cn: string;
  relation: string;
  type: number;
  id: number;
}

interface RelatedProps {
  animeId: number;
}

export default function index({animeId}: RelatedProps) {
  const [relatedData, setRelatedData] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width);

  /**
   *动态样式
   */
  const styles = useStyles();

  // 计算列数
  const getNumColumns = () => {
    const itemWidth = 120; // 每个项目的最小宽度
    const padding = 32; // 左右padding
    const spacing = 12; // 项目间距
    const availableWidth = screenWidth - padding;
    const columns = Math.floor((availableWidth + spacing) / (itemWidth + spacing));
    return Math.max(2, Math.min(4, columns)); // 最少2列，最多4列
  };

  /**
   * 获取相关条目
   */
  const getRelated = async () => {
    try {
      const data = await animeDate.getRelatedService(animeId);
      console.log('相关条目数据:', data);

      // 过滤掉type不等于2的数据
      const filteredData = data.filter((item: RelatedItem) => item.type === 2);
      setRelatedData(filteredData);
    } catch (error) {
      console.error('获取相关条目失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRelated();

    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setScreenWidth(window.width);
    });

    return () => subscription?.remove();
  }, [animeId]);

  const renderRelatedItem = ({item}: {item: RelatedItem}) => (
    <View style={styles.itemContainer}>
      <Card style={styles.card}>
        {item.images.common && (
          <View style={styles.imageContainer}>
            <FastImage source={{uri: item.images.common}} style={styles.image} />
            {/* relation标签在左上角 */}
            <View style={styles.relationBadge}>
              <Text style={styles.relationText}>{item.relation}</Text>
            </View>
            {/* 标题覆盖在底部 - 使用渐变蒙版 */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.7)']}
              style={styles.titleOverlay}
            >
              <Text style={styles.titleText} numberOfLines={2}>
                {item.name_cn || item.name}
              </Text>
            </LinearGradient>
          </View>
        )}
      </Card>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>加载中...</Text>
      </View>
    );
  }

  if (relatedData.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>相关条目</Text>
      <FlatList
        data={relatedData}
        renderItem={renderRelatedItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        numColumns={getNumColumns()}
        key={getNumColumns()} // 强制重新渲染当列数改变时
        columnWrapperStyle={getNumColumns() > 1 ? styles.row : undefined}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}
