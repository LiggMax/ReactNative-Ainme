import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';
import {useTheme} from 'react-native-paper';
import animeService from '../../api/bangumi/animeService.ts';

interface AnimeDetailProps {
  route?: {
    params?: {
      id?: number;
    };
  };
  // 为了支持直接传递id属性
  id?: number;
  // 添加返回回调函数
  onBack?: () => void;
  // 是否显示返回按钮
  showBackButton?: boolean;
}

/**
 * 动漫详情页
 */
export default function AnimeDetail({route, id, onBack, showBackButton = false}: AnimeDetailProps) {
  const theme = useTheme();
  // 获取传递的id，支持两种方式
  const animeId = route?.params?.id || id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取anime详情
  const fetchAnimeDetail = async () => {
    if (!animeId) {
      console.error('❌ 动漫ID未提供');
      setError('动漫ID未提供');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('🔄 开始获取动漫详情，ID:', animeId);
      const animeDetail = await animeService.getAnimeDetailService(animeId);
      console.log('✅ 动漫详情获取成功:', animeDetail);

    } catch (error) {
      console.error('❌ 获取动漫详情失败:', error);
      setError('获取动漫详情失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimeDetail();
  }, [animeId]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    backButton: {
      position: 'absolute',
      top: 40,
      left: 20,
      padding: 12,
      borderRadius: 20,
      backgroundColor: theme.colors.surface,
      flexDirection: 'row',
      alignItems: 'center',
      zIndex: 999,
      elevation: 5,
      shadowColor: theme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
    },
    backButtonText: {
      color: theme.colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors.onSurface,
    },
    info: {
      fontSize: 16,
      marginBottom: 12,
      color: theme.colors.onSurfaceVariant,
    },
    status: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
    },
    error: {
      fontSize: 14,
      color: theme.colors.error,
    },
    success: {
      fontSize: 14,
      color: theme.colors.primary,
    },
  });

  return (
    <View style={styles.container}>
      {showBackButton && onBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Text style={styles.backButtonText}>← 返回列表</Text>
        </TouchableOpacity>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.title}>
          动漫详情页
        </Text>
        <Text style={styles.info}>
          动漫ID: {animeId || '未提供'}
        </Text>
        {loading && (
          <Text style={styles.status}>🔄 加载中...</Text>
        )}
        {error && (
          <Text style={styles.error}>❌ {error}</Text>
        )}
        {!loading && !error && animeId && (
          <Text style={styles.success}>✅ 请查看控制台获取详情数据</Text>
        )}
      </View>
    </View>
  );
}
