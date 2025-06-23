import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';

interface RankingProps {
  showAlert: (title: string, message: string) => void;
}

export default function Ranking({showAlert}: RankingProps) {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.interval, styles.title]}>排行榜</Text>
      <Text style={[styles.interval, styles.description]}>
        查看最受欢迎的动漫作品排行榜
      </Text>
      <View style={[styles.interval]}>
        <Button
          mode="outlined"
          onPress={() => showAlert('排行榜', '热门动漫排行榜')}>
          热门排行
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button
          mode="outlined"
          onPress={() => showAlert('排行榜', '评分最高的动漫')}>
          评分排行
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button
          mode="text"
          onPress={() => showAlert('排行榜', '查看更多排行榜数据')}>
          更多排行
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  interval: {
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
  },
});
