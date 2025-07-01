/**
 * 番剧相关条目
 */
import React, {useEffect, useState} from 'react';
import {Text, View, FlatList} from 'react-native';
import {Card, } from 'react-native-paper';
import animeDate from '../../../../api/bangumi/anime/animeDate.ts';
import {styles} from './style';
import FastImage from 'react-native-fast-image';

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
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        {item.images.common && (
          <FastImage source={{uri: item.images.common}} style={styles.image} />
        )}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.name_cn || item.name}</Text>
          <Text style={styles.relation}>{item.relation}</Text>
          {item.name_cn && item.name !== item.name_cn && (
            <Text style={styles.originalName}>{item.name}</Text>
          )}
        </View>
      </Card.Content>
    </Card>
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
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
