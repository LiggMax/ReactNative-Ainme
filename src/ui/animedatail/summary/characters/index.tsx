import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import animeDateService from '../../../../api/bangumi/anime/animeDate';

interface CharactersProps {
  animeId: number;
}

/**
 * 角色页面
 */
export default function Characters({animeId}: CharactersProps) {
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getCharacters = async () => {
    try {
      setLoading(true);
      const res = await animeDateService.getCharactersService(animeId);
      console.log('角色信息:', res);
      setCharacters(res || []);
    } catch (error) {
      console.error('获取角色信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (animeId) {
      getCharacters();
    }
  }, [animeId]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>角色信息</Text>
      {loading ? (
        <Text style={styles.loadingText}>加载中...</Text>
      ) : characters.length > 0 ? (
        <View>
          <Text style={styles.characterCount}>共 {characters.length} 个角色</Text>
          {/* 这里可以添加角色列表的具体渲染 */}
        </View>
      ) : (
        <Text style={styles.emptyText}>暂无角色信息</Text>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  characterCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
