import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Button, Dialog, Portal, useTheme} from 'react-native-paper';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AnimeService, {AnimeItem, RankingResponse} from '../../../api/bangumi/anime/animeService.ts';
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

  // 动态样式
  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    listContainer: {
      padding: 16,
    },
    rankingItem: {
      flexDirection: 'row',
      padding: 20,
      marginBottom: 20,
      borderRadius: 16,
      backgroundColor: theme.colors.surface,
      elevation: 3,
      shadowColor: theme.colors.shadow,
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.15,
      shadowRadius: 6,
      width: ITEM_WIDTH,
      alignItems: 'center',
    },
    animeImage: {
      width: 120,
      height: 160,
      borderRadius: 12,
      marginRight: 20,
      backgroundColor: theme.colors.surfaceVariant,
    },
    animeInfo: {
      flex: 1,
      justifyContent: 'center',
      paddingVertical: 10,
    },
    animeName: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 8,
      lineHeight: 26,
      color: theme.colors.onSurface,
    },
    animeOriginalName: {
      fontSize: 16,
      marginBottom: 12,
      fontStyle: 'italic',
      lineHeight: 22,
      color: theme.colors.onSurfaceVariant,
    },
    airDate: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.onSurfaceVariant,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    loadingText: {
      fontSize: 16,
      marginTop: 12,
      color: theme.colors.onBackground,
    },
    emptyContainer: {
      paddingVertical: 40,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
    },
    dialogMessage: {
      fontSize: 16,
      color: theme.colors.onSurface,
    },
  }), [theme]);

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
  const getRanking = useCallback(async () => {
    try {
      setLoading(true);
      const response: RankingResponse = await AnimeService.getRankingService();
      console.log('排行榜数据:', response);

      if (response && response.list) {
        const animeList = response.list.filter(item => item.type === 2);
        setRankingData(animeList);
      } else {
        setRankingData([]);
        showAlert('提示', '暂无排行榜数据');
      }
    } catch (error) {
      console.error('获取排行榜失败:', error);
      setRankingData([]);
    } finally {
      setLoading(false);
    }
  }, [showAlert]);

  // 导航到动漫详情页
  const navigateToDetail = useCallback((animeId: number) => {
    navigation.navigate('AnimeDetail', {id: animeId});
  }, [navigation]);

  // 渲染排行榜项目
  const renderRankingItem = useCallback(({item, index}: {item: AnimeItem; index: number}) => {
    const displayName = item.name_cn || item.name;

    return (
      <TouchableOpacity
        style={dynamicStyles.rankingItem}
        onPress={() => navigateToDetail(item.id)}
        activeOpacity={0.7}
      >
        {/* 动漫封面 */}
        <FastImage
          source={{uri: item.images.large}}
          style={dynamicStyles.animeImage}
          resizeMode="cover"
        />

        {/* 动漫信息 */}
        <View style={dynamicStyles.animeInfo}>
          <Text
            style={dynamicStyles.animeName}
            numberOfLines={2}
          >
            {displayName}
          </Text>

          {item.name_cn && item.name_cn !== item.name && (
            <Text
              style={dynamicStyles.animeOriginalName}
              numberOfLines={2}
            >
              {item.name}
            </Text>
          )}

          {item.air_date && (
            <Text style={dynamicStyles.airDate}>
              {item.air_date}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }, [dynamicStyles, navigateToDetail]);

  const renderListEmpty = useCallback(() => (
    <View style={dynamicStyles.emptyContainer}>
      <Text style={dynamicStyles.emptyText}>
        {loading ? '正在加载排行榜数据...' : '暂无排行榜数据'}
      </Text>
    </View>
  ), [dynamicStyles, loading]);

  // 初始化数据
  useEffect(() => {
    getRanking();
  }, []);

  return (
    <View style={dynamicStyles.container}>
      {loading && rankingData.length === 0 ? (
        <View style={dynamicStyles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={dynamicStyles.loadingText}>
            正在加载排行榜...
          </Text>
        </View>
      ) : (
        <FlatList
          data={rankingData}
          renderItem={renderRankingItem}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={renderListEmpty}
          contentContainerStyle={dynamicStyles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
        />
      )}

      <Portal>
        <Dialog visible={alertVisible} onDismiss={hideAlert}>
          <Dialog.Title>{alertTitle}</Dialog.Title>
          <Dialog.Content>
            <Text style={dynamicStyles.dialogMessage}>{alertMessage}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideAlert}>确定</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
