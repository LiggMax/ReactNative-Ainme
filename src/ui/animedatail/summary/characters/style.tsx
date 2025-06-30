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
    // 模态框样式
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
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
      paddingHorizontal: 20,
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
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    modalCharacterItem: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 15,
      marginVertical: 8,
      shadowColor: theme.colors.shadow,
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
      color: theme.colors.onSurface,
      marginBottom: 4,
    },
    modalCharacterRelation: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
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
      color: theme.colors.onSurfaceVariant,
      marginBottom: 4,
    },
    actorSummary: {
      fontSize: 11,
      color: theme.colors.outline,
      lineHeight: 16,
    },
    characterNameContainer: {
      flexDirection: 'row',
    },
  });
};
