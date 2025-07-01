import React, {useEffect, useMemo, useState, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import animeDateService from '../../../../api/bangumi/anime/animeDate';
import FastImage from 'react-native-fast-image';
import {useCharacterStyles} from './style';
import BottomDrawer, {BottomDrawerMethods} from 'react-native-animated-bottom-drawer';

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
  const bottomDrawerRef = useRef<BottomDrawerMethods>(null);
  const styles = useCharacterStyles();

  const screenHeight = Dimensions.get('window').height;
  
  // 根据角色数量动态计算抽屉高度
  const drawerHeight = useMemo(() => {
    const baseHeight = screenHeight * 0.5;
    const maxHeight = screenHeight * 0.85;
    
    // 每行显示2个角色，每个角色高度约80px，加上header和padding
    const estimatedHeight = Math.ceil(characters.length / 2) * 80 + 100;
    
    return Math.min(Math.max(baseHeight, estimatedHeight), maxHeight);
  }, [characters.length, screenHeight]);

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
  const mainCharacters = characters.filter(char => char.relation === '6');

  // 渲染单个角色卡片
  const renderCharacterCard = (character: Character, isCompact = false) => (
    <View
      key={character.id}
      style={[styles.characterCard, isCompact && styles.compactCard]}>
      <FastImage
        source={{uri: character.images.grid}}
        style={[styles.characterImage, isCompact && styles.compactImage]}
        resizeMode="cover"
      />
      <View style={styles.characterInfo}>
        <View style={styles.characterNameContainer}>
          <Text
            style={[
              styles.characterRelation,
              isCompact && styles.compactRelation,
            ]}>
            {character.relation}:
          </Text>
          <Text
            style={[styles.characterName, isCompact && styles.compactName]}
            numberOfLines={1}>
            {character.name}
          </Text>
        </View>

        {character.actors.length > 0 && (
          <Text
            style={[styles.actorName, isCompact && styles.compactActor]}
            numberOfLines={1}>
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
        source={{uri: item.images.grid}}
        style={styles.modalCharacterImage}
        resizeMode="cover"
      />
      <View style={styles.modalCharacterInfo}>
        <View style={styles.characterNameContainer}>
          <Text style={styles.modalCharacterRelation}>
            {item.relation}:
          </Text>
          <Text style={styles.modalCharacterName} numberOfLines={1}>
            {item.name}
          </Text>
        </View>
        {item.actors.length > 0 && (
          <Text style={styles.modalActorName} numberOfLines={1}>
            声优：{item.actors[0].name}
          </Text>
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
            onPress={() => bottomDrawerRef.current?.open()}>
            <Text style={styles.viewAllText}>查看全部</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <Text style={styles.loadingText}>加载中...</Text>
      ) : mainCharacters.length > 0 ? (
        <View style={styles.mainCharactersContainer}>
          {mainCharacters
            .slice(0, 6)
            .map(character => renderCharacterCard(character, true))}
        </View>
      ) : characters.length > 0 ? (
        <View style={styles.mainCharactersContainer}>
          {characters
            .slice(0, 6)
            .map(character => renderCharacterCard(character, true))}
        </View>
      ) : (
        <Text style={styles.emptyText}>暂无角色信息</Text>
      )}

      {/* 底部抽屉模态框 */}
      <BottomDrawer
        ref={bottomDrawerRef}
        initialHeight={drawerHeight}
        snapPoints={[screenHeight * 0.3, screenHeight * 0.5, screenHeight * 0.85]}
        enableSnapping={true}
        customStyles={{
          container: styles.modalContent,
        }}
        onClose={() => {}}
        closeOnBackdropPress={true}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>角色 {characters.length}</Text>
        </View>
        <FlatList
          data={characters}
          renderItem={renderModalCharacterItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.modalList}
          numColumns={2}
          columnWrapperStyle={styles.modalRow}
        />
      </BottomDrawer>
    </View>
  );
}
