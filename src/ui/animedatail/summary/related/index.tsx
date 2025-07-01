/**
 * 番剧相关条目
 */
import React, {useEffect, useState} from 'react';
import {Text, View, FlatList, Dimensions} from 'react-native';
import {Card, } from 'react-native-paper';
import animeDate from '../../../../api/bangumi/anime/animeDate.ts';
import {useStyles} from './style';
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
  const styles = useStyles();

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
  }, [animeId]);

  const renderRelatedItem = ({item}: {item: RelatedItem}) => (
    <View style={styles.gridItem}>
      <Card style={styles.card}>
        <View style={styles.imageContainer}>
          {item.images.common && (
            <FastImage source={{uri: item.images.common}} style={styles.image} />
          )}
          <View style={styles.overlay}>
            <Text style={styles.relation}>{item.relation}</Text>
          </View>
          <View style={styles.titleOverlay}>
            <LinearGradient
              colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.8)']}
              style={styles.titleGradient}
            >
              <Text style={styles.title} numberOfLines={2}>{item.name_cn || item.name}</Text>
            </LinearGradient>
          </View>
        </View>
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
      <Text  style={styles.sectionTitle}>相关条目</Text>
      <FlatList
        data={relatedData}
        renderItem={renderRelatedItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}
