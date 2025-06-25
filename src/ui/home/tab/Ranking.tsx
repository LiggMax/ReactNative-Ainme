import React, {useState, useCallback, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator, Image,
} from 'react-native';
import {Button, Dialog, Portal, useTheme, Chip} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AnimeService, {AnimeItem, RankingResponse} from '../../../api/bangumi/animeService.ts';
import {RootStackParamList} from '../../../types/navigation';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width - 32; // 减去padding

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Ranking() {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [rankingData, setRankingData] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'hot' | 'rating' | 'new'>('hot');

  const hideAlert = useCallback(() => {
    setAlertVisible(false);
    setAlertTitle('');
    setAlertMessage('');
  }, []);

  const showAlert = useCallback((title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  }, []);

  // 获取排行榜数据
  const getRanking = useCallback(async (type: 'hot' | 'rating' | 'new' = 'hot') => {
    try {
      setLoading(true);
      const response: RankingResponse = await AnimeService.getRankingService();
      console.log('排行榜数据:', response);

      if (response && response.list) {
        // 过滤掉非动画类型的条目 (type !== 2)
        const animeList = response.list.filter(item => item.type === 2);
        setRankingData(animeList);
      } else {
        setRankingData([]);
        showAlert('提示', '暂无排行榜数据');
      }
    } catch (error) {
      console.error('获取排行榜失败:', error);
      showAlert('错误', '获取排行榜数据失败，请检查网络连接');
      setRankingData([]);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // 处理排行榜类型切换
  const handleTypeChange = useCallback((type: 'hot' | 'rating' | 'new') => {
    setSelectedType(type);
    getRanking(type);
  }, [getRanking]);

  // 导航到动漫详情页
  const navigateToDetail = useCallback((animeId: number) => {
    navigation.navigate('AnimeDetail', {id: animeId});
  }, [navigation]);

  // 渲染排行榜项目
  const renderRankingItem = useCallback(({item, index}: {item: AnimeItem; index: number}) => {
    const rank = index + 1;
    const displayName = item.name_cn || item.name;

    return (
      <TouchableOpacity
        style={[styles.rankingItem, {backgroundColor: theme.colors.surface}]}
        onPress={() => navigateToDetail(item.id)}
        activeOpacity={0.7}
      >
        {/* 排名 */}
        <View style={[styles.rankBadge, {
          backgroundColor: rank <= 3 ? theme.colors.primary : theme.colors.outline
        }]}>
          <Text style={[styles.rankText, {
            color: rank <= 3 ? theme.colors.onPrimary : theme.colors.onSurface
          }]}>
            {rank}
          </Text>
        </View>

        {/* 动漫封面 */}
        <Image
          source={{uri: item.images.common}}
          style={styles.animeImage}
          resizeMode="cover"
        />

        {/* 动漫信息 */}
        <View style={styles.animeInfo}>
          <Text
            style={[styles.animeName, {color: theme.colors.onSurface}]}
            numberOfLines={2}
          >
            {displayName}
          </Text>

          {item.name_cn && item.name_cn !== item.name && (
            <Text
              style={[styles.animeOriginalName, {color: theme.colors.onSurfaceVariant}]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          )}

          <View style={styles.animeMetadata}>
            <Chip
              compact
              style={styles.typeChip}
              textStyle={styles.chipText}
            >
              动画
            </Chip>
            {item.air_date && (
              <Text style={[styles.airDate, {color: theme.colors.onSurfaceVariant}]}>
                {item.air_date}
              </Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [theme, navigateToDetail]);

  const renderListHeader = useCallback(() => (
    <View style={styles.header}>
      <Text style={[styles.title, {color: theme.colors.onBackground}]}>
        动漫排行榜
      </Text>
      <Text style={[styles.description, {color: theme.colors.onSurfaceVariant}]}>
        发现最受欢迎的动漫作品
      </Text>

      {/* 排行榜类型选择器 */}
      <View style={styles.typeSelector}>
        <Button
          mode={selectedType === 'hot' ? 'contained' : 'outlined'}
          onPress={() => handleTypeChange('hot')}
          style={styles.typeButton}
          compact
        >
          热门排行
        </Button>
        <Button
          mode={selectedType === 'rating' ? 'contained' : 'outlined'}
          onPress={() => handleTypeChange('rating')}
          style={styles.typeButton}
          compact
        >
          评分排行
        </Button>
        <Button
          mode={selectedType === 'new' ? 'contained' : 'outlined'}
          onPress={() => handleTypeChange('new')}
          style={styles.typeButton}
          compact
        >
          最新排行
        </Button>
      </View>
    </View>
  ), [theme, selectedType, handleTypeChange]);

  const renderListEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, {color: theme.colors.onSurfaceVariant}]}>
        {loading ? '正在加载排行榜数据...' : '暂无排行榜数据'}
      </Text>
    </View>
  ), [theme, loading]);

  // 初始化数据
  useEffect(() => {
    getRanking(selectedType);
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {loading && rankingData.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, {color: theme.colors.onBackground}]}>
            正在加载排行榜...
          </Text>
        </View>
      ) : (
        <FlatList
          data={rankingData}
          renderItem={renderRankingItem}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderListHeader}
          ListEmptyComponent={renderListEmpty}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={() => getRanking(selectedType)}
        />
      )}

      <Portal>
        <Dialog visible={alertVisible} onDismiss={hideAlert}>
          <Dialog.Title>{alertTitle}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogMessage}>{alertMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideAlert}>确定</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  typeSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    minWidth: 80,
  },
  rankingItem: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    width: ITEM_WIDTH,
  },
  rankBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    alignSelf: 'center',
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  animeImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  animeInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  animeName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    lineHeight: 22,
  },
  animeOriginalName: {
    fontSize: 14,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  animeMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeChip: {
    height: 24,
  },
  chipText: {
    fontSize: 12,
  },
  airDate: {
    fontSize: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  dialogMessage: {
    fontSize: 16,
  },
});
