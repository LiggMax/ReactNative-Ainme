import React, {useState} from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import {Chip} from 'react-native-paper';

interface SummaryProps {
  summary?: string;
  tags?: Array<{name: string; count: number}>;
  dynamicStyles: any;
}

/**
 * 简介页面
 * @param summary
 * @param tags
 * @param dynamicStyles
 * @constructor
 */
export default function Index({summary, tags, dynamicStyles}: SummaryProps) {
  const [showFullSummary, setShowFullSummary] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  return (
    <View style={dynamicStyles.tabContent}>
      {/* 简介 */}
      {summary ? (
        <>
          <Text
            style={dynamicStyles.summaryText}
            numberOfLines={showFullSummary ? undefined : 3}>
            {summary.replace(/\r\n/g, '\n')}
          </Text>
          {summary.length > 100 && (
            <TouchableOpacity
              style={dynamicStyles.showMoreButton}
              onPress={() => setShowFullSummary(!showFullSummary)}>
              <Text style={dynamicStyles.showMoreText}>
                {showFullSummary ? '收起' : '显示更多'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={dynamicStyles.summaryText}>暂无简介信息</Text>
      )}

      {/* 标签 */}
      {tags && tags.length > 0 ? (
        <>
          <Text style={dynamicStyles.sectionTitle}>标签</Text>
          <View style={dynamicStyles.tagsContainer}>
            {(showAllTags ? tags : tags.slice(0, 6)).map(
              (tag: {name: string; count: number}, index: number) => (
                <Chip
                  key={index}
                  mode="flat"
                  compact
                  style={dynamicStyles.tagChip}>
                  {tag.name} ({tag.count})
                </Chip>
              ),
            )}
          </View>
          {tags.length > 6 && (
            <TouchableOpacity
              style={dynamicStyles.showMoreButton}
              onPress={() => setShowAllTags(!showAllTags)}>
              <Text style={dynamicStyles.showMoreText}>
                {showAllTags ? '收起' : '显示更多'}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={dynamicStyles.summaryText}>暂无标签信息</Text>
      )}
    </View>
  );
}
