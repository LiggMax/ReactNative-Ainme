import React, {useCallback, useMemo} from 'react';
import {Text, View} from 'react-native';
import {Card, useTheme} from 'react-native-paper';
import {FlatGrid} from 'react-native-super-grid';
import {createInfoboxStyles} from './style';

interface InfoBoxProps {
  infobox?: Array<{key: string; value: any}>;
  screenDimensions: any;
}

/**
 * 详情页面
 * @param infobox
 * @param screenDimensions
 * @constructor
 */
export default function Index({
  infobox,
  screenDimensions,
}: InfoBoxProps) {
  const theme = useTheme();

  // 创建样式
  const styles = useMemo(
    () => createInfoboxStyles(theme, screenDimensions),
    [theme, screenDimensions],
  );
  // 渲染详细信息项目 - 使用Material Design Card
  const renderInfoItem = useCallback(
    ({item}: {item: any}) => (
      <Card mode='contained' style={styles.infoCard}>
        <Text style={styles.infoKeyText}>{item.key}</Text>
        <Text style={styles.infoValueText} numberOfLines={3}>
          {Array.isArray(item.value)
            ? item.value.map((v: any) => v.v || v).join(', ')
            : item.value}
        </Text>
      </Card>
    ),
    [styles],
  );

  return (
    <View style={styles.tabContent}>
      {infobox && infobox.length > 0 ? (
        <FlatGrid
          itemDimension={screenDimensions.isTablet ? 200 : 150}
          data={infobox.slice(0, 10)}
          spacing={8}
          renderItem={renderInfoItem}
          fixed={false}
          maxItemsPerRow={screenDimensions.isTablet ? 2 : 1}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.summaryText}>暂无详细信息</Text>
      )}
    </View>
  );
}
