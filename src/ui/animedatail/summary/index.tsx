import React, {useState, useMemo} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Chip, useTheme} from 'react-native-paper';
import Characters from './characters';
import Related from './related';
import {createSummaryStyles} from './style';

interface SummaryProps {
  summary?: string;
  tags?: Array<{name: string; count: number}>;
  animeId: number;
  screenDimensions: any;
}

/**
 * 简介页面
 * @param summary
 * @param tags
 * @param animeId
 * @param screenDimensions
 * @constructor
 */
export default function Index({summary, tags, animeId, screenDimensions}: SummaryProps) {
  const theme = useTheme();
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // 创建样式
  const styles = useMemo(
    () => createSummaryStyles(theme, screenDimensions),
    [theme, screenDimensions],
  );

  return (
    <View style={styles.tabContent}>
      {/* 简介 */}
      {summary ? (
        <>
          <Text
            style={styles.summaryText}
            numberOfLines={showFullSummary ? undefined : 3}>
            {summary.replace(/\r\n/g, '\n')}
          </Text>
          {summary.length > 100 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowFullSummary(!showFullSummary)}>
              <Text style={styles.showMoreText}>
                {showFullSummary ? '收起' : '显示更多'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.summaryText}>暂无简介信息</Text>
      )}

      {/* 标签 */}
      {tags && tags.length > 0 ? (
        <>
          <Text style={styles.sectionTitle}>标签</Text>
          <View style={styles.tagsContainer}>
            {(showAllTags ? tags : tags.slice(0, 6)).map(
              (tag: {name: string; count: number}, index: number) => (
                <Chip
                  key={index}
                  mode="flat"
                  compact
                  style={styles.tagChip}>
                  {tag.name} ({tag.count})
                </Chip>
              ),
            )}
          </View>
          {tags.length > 6 && (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={() => setShowAllTags(!showAllTags)}>
              <Text style={styles.showMoreText}>
                {showAllTags ? '收起' : '显示更多'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.summaryText}>暂无标签信息</Text>
      )}

      {/* 角色信息 */}
      <Characters animeId={animeId} />

      {/*相关条目数据*/}
      <Related animeId={animeId} />
    </View>
  );
}
