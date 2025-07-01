import {StyleSheet} from 'react-native';
import {useTheme} from 'react-native-paper';

export const useCharacterStyles = () => {
  const theme = useTheme();

  return StyleSheet.create({
    container: {
      marginTop: 20,
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
      color: theme.colors.onSurface,
    },
    viewAllButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 15,
    },
    viewAllText: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    loadingText: {
      fontSize: 14,
      color: theme.colors.onSurfaceVariant,
      textAlign: 'center',
      paddingVertical: 20,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.outline,
      textAlign: 'center',
      paddingVertical: 20,
    },
    mainCharactersContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    characterCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 8,
      flexDirection: 'row',
      padding: 12,
      marginBottom: 12,
      shadowColor: theme.colors.shadow,
    },
    compactCard: {
      width: '48%',
      padding: 8,
    },
    characterImage: {
      width: 30,
      height: 30,
      borderRadius: 6,
      marginBottom: 8,
      marginRight: 8,
    },
    compactImage: {
      width: 40,
      height: 40,
    },
    characterInfo: {
      flex: 1,
    },
    characterName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    compactName: {
      fontSize: 10,
    },
    characterRelation: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    compactRelation: {
      fontSize: 11,
    },
    actorName: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    compactActor: {
      fontSize: 10,
    },
    // 底部抽屉样式
    modalContent: {
      backgroundColor: theme.colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 10,
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    closeButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.colors.surfaceVariant,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      fontSize: 20,
      color: theme.colors.onSurfaceVariant,
      fontWeight: 'bold',
    },
    modalList: {
      paddingHorizontal: 8,
      paddingBottom: 20,
    },
    modalRow: {
      justifyContent: 'space-between',
    },
    modalCharacterItem: {
      flexDirection: 'row',
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    modalCharacterImage: {
      borderRadius: 8,
      width: 60,
      height: 60,
      margin:10,
    },
    modalCharacterInfo: {
      padding: 8,
      marginRight: 8,
    },
    characterNameContainer: {
      marginBottom: 4,
      flexDirection: 'row',
    },
    modalCharacterName: {
      fontSize: 10,
      fontWeight: 'bold',
      color: theme.colors.onSurface,
    },
    modalCharacterRelation: {
      fontSize: 12,
      color: theme.colors.primary,
      fontWeight: '600',
    },
    modalActorName: {
      fontSize: 11,
      color: theme.colors.onSurfaceVariant,
    },
  });
};
