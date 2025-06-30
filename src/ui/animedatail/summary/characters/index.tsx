import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, TouchableOpacity, Modal, FlatList, Dimensions} from 'react-native';
import animeDateService from '../../../../api/bangumi/anime/animeDate';
import FastImage from 'react-native-fast-image';

interface CharactersProps {
  animeId: number;
}

interface Character {
  id: number;
  name: string;
  relation: string;
  images: {
    small: string;
    grid: string;
    large: string;
    medium: string;
  };
  actors: Array<{
    id: number;
    name: string;
    images: {
      small: string;
      grid: string;
      large: string;
      medium: string;
    };
    short_summary: string;
    career: string[];
    type: number;
    locked: boolean;
  }>;
  type: number;
}

/**
 * 角色页面
 */
export default function Characters({animeId}: CharactersProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const screenHeight = Dimensions.get('window').height;

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

  // 获取主角角色
  const mainCharacters = characters.filter(char => char.relation === '主角');

  // 渲染单个角色卡片
  const renderCharacterCard = (character: Character, isCompact = false) => (
    <View key={character.id} style={[styles.characterCard, isCompact && styles.compactCard]}>
      <FastImage
        source={{uri: character.images.medium}}
        style={[styles.characterImage, isCompact && styles.compactImage]}
        resizeMode="cover"
      />
      <View style={styles.characterInfo}>
        <Text style={[styles.characterName, isCompact && styles.compactName]} numberOfLines={1}>
          {character.name}
        </Text>
        <Text style={[styles.characterRelation, isCompact && styles.compactRelation]}>
          {character.relation}
        </Text>
        {character.actors.length > 0 && (
          <Text style={[styles.actorName, isCompact && styles.compactActor]} numberOfLines={1}>
            声优：{character.actors[0].name}
          </Text>
        )}
      </View>
    </View>
  );

  // 渲染模态框中的角色列表项
  const renderModalCharacterItem = ({item}: {item: Character}) => (
    <View style={styles.modalCharacterItem}>
      <FastImage
        source={{uri: item.images.medium}}
        style={styles.modalCharacterImage}
        resizeMode="cover"
      />
      <View style={styles.modalCharacterInfo}>
        <Text style={styles.modalCharacterName}>{item.name}</Text>
        <Text style={styles.modalCharacterRelation}>{item.relation}</Text>
        {item.actors.length > 0 && (
          <View style={styles.actorInfo}>
            <FastImage
              source={{uri: item.actors[0].images.medium}}
              style={styles.actorImage}
              resizeMode="cover"
            />
            <View style={styles.actorDetails}>
              <Text style={styles.modalActorName}>声优：{item.actors[0].name}</Text>
              {item.actors[0].short_summary && (
                <Text style={styles.actorSummary} numberOfLines={3}>
                  {item.actors[0].short_summary}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </View>
  );

  useEffect(() => {
    if (animeId) {
      getCharacters();
    }
  }, [animeId]);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>角色</Text>
        {characters.length > 0 && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <Text style={styles.loadingText}>加载中...</Text>
      ) : mainCharacters.length > 0 ? (
        <View style={styles.mainCharactersContainer}>
          {mainCharacters.slice(0, 6).map(character => renderCharacterCard(character, true))}
        </View>
      ) : characters.length > 0 ? (
        <View style={styles.mainCharactersContainer}>
          {characters.slice(0, 6).map(character => renderCharacterCard(character, true))}
        </View>
      ) : (
        <Text style={styles.emptyText}>暂无角色信息</Text>
      )}

      {/* 底部抽屉模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, {maxHeight: screenHeight * 0.8}]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>角色 {characters.length}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={characters}
              renderItem={renderModalCharacterItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
  },
  viewAllText: {
    fontSize: 12,
    color: '#666',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 20,
  },
  mainCharactersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  characterCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  compactCard: {
    width: '48%',
    padding: 8,
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginBottom: 8,
  },
  compactImage: {
    width: '100%',
    height: 80,
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  compactName: {
    fontSize: 14,
  },
  characterRelation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  compactRelation: {
    fontSize: 11,
  },
  actorName: {
    fontSize: 12,
    color: '#888',
  },
  compactActor: {
    fontSize: 10,
  },
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold',
  },
  modalList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalCharacterItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalCharacterImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  modalCharacterInfo: {
    flex: 1,
  },
  modalCharacterName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  modalCharacterRelation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  actorInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  actorDetails: {
    flex: 1,
  },
  modalActorName: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
  },
  actorSummary: {
    fontSize: 11,
    color: '#999',
    lineHeight: 16,
  },
});
