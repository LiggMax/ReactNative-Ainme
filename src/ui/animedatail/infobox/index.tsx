import React, {useCallback} from 'react';
import {Text, View} from 'react-native';
import {Card} from 'react-native-paper';
import {FlatGrid} from 'react-native-super-grid';

interface InfoBoxProps {
  infobox?: Array<{key: string; value: any}>;
  screenDimensions: any;
  dynamicStyles: any;
}

/**
 * 详情页面
 * @param infobox
 * @param screenDimensions
 * @param dynamicStyles
 * @constructor
 */
export default function Index({
  infobox,
  screenDimensions,
  dynamicStyles,
}: InfoBoxProps) {
  // 渲染详细信息项目 - 使用Material Design Card
  const renderInfoItem = useCallback(
    ({item}: {item: any}) => (
      <Card mode='contained' style={dynamicStyles.infoCard}>
        <Text style={dynamicStyles.infoKeyText}>{item.key}</Text>
        <Text style={dynamicStyles.infoValueText} numberOfLines={3}>
          {Array.isArray(item.value)
            ? item.value.map((v: any) => v.v || v).join(', ')
            : item.value}
        </Text>
      </Card>
    ),
    [dynamicStyles.infoCard, dynamicStyles.infoKeyText, dynamicStyles.infoValueText],
  );

  return (
    <View style={dynamicStyles.tabContent}>
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
        <Text style={dynamicStyles.summaryText}>暂无详细信息</Text>
      )}
    </View>
  );
}
