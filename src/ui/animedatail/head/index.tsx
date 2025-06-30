import React from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import LinearGradient from 'react-native-linear-gradient';

interface HeadProps {
  animeDetail: any;
  title: string | undefined;
  dynamicStyles: any;
  insets: any;
  formatNumber: (num: number) => string;
  getStarRating: (score: number) => string;
}

export default function Head({animeDetail, title, dynamicStyles, insets, formatNumber, getStarRating}: HeadProps) {
  return (
    <View style={dynamicStyles.headerBackground}>
      {/* 背景图片 */}
      <ImageBackground
        source={{uri: animeDetail.images?.large}}
        style={dynamicStyles.absoluteFill}
        blurRadius={20}
        resizeMode="cover">
        {/* 深色遮罩层 */}
        <View style={dynamicStyles.headerBlurOverlay} />
        {/* 渐变遮罩 */}
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.7)']}
          style={dynamicStyles.headerGradient}
        />
      </ImageBackground>
      {/* 内容区域 */}
      <View
        style={[
          dynamicStyles.headerContainer,
          {paddingTop: 56 + insets.top},
        ]}>
        {/* 封面图片 */}
        <FastImage
          source={{uri: animeDetail.images?.large}}
          style={dynamicStyles.coverImage}
          resizeMode="cover"
        />
        {/* 基本信息 */}
        <View style={dynamicStyles.infoContainer}>
          <View style={dynamicStyles.titleContainer}>
            <View style={dynamicStyles.titleWrapper}>
              <Text style={dynamicStyles.title} numberOfLines={2}>
                {title || '无标题'}
              </Text>
            </View>
          </View>
          {/* 评分信息 */}
          {animeDetail.rating && (
            <View style={dynamicStyles.ratingContainer}>
              <Text style={dynamicStyles.ratingScore}>
                {animeDetail.rating.score.toFixed(1)}
              </Text>
              <Text style={dynamicStyles.ratingStars}>
                {getStarRating(animeDetail.rating.score)}
              </Text>
              <Text style={dynamicStyles.ratingCount} numberOfLines={0}>
                {formatNumber(animeDetail.rating.total)} 人评价 #{animeDetail.rating.rank}
              </Text>
            </View>
          )}
          <Text style={dynamicStyles.dateText} numberOfLines={0}>
            {animeDetail.date || '播出时间待定'}
          </Text>
          <Text style={dynamicStyles.episodeText} numberOfLines={0}>
            看过 {animeDetail.collection?.collect || 0} (
            {animeDetail.total_episodes || animeDetail.eps || 0}) · 全{' '}
            {animeDetail.total_episodes || animeDetail.eps || 0} 话
          </Text>
          {/* 收藏数据 */}
          {animeDetail.collection && (
            <View style={dynamicStyles.collectionContainer}>
              <View style={dynamicStyles.collectionItem}>
                <Text style={dynamicStyles.collectionNumber}>
                  {formatNumber(animeDetail.collection.collect || 0)}
                </Text>
                <Text style={dynamicStyles.collectionLabel}>收藏</Text>
              </View>
              <View style={dynamicStyles.collectionItem}>
                <Text style={dynamicStyles.collectionNumber}>
                  {formatNumber(animeDetail.collection.doing || 0)}
                </Text>
                <Text style={dynamicStyles.collectionLabel}>在看</Text>
              </View>
              <View style={dynamicStyles.collectionItem}>
                <Text style={dynamicStyles.collectionNumber}>
                  {formatNumber(animeDetail.collection.wish || 0)}
                </Text>
                <Text style={dynamicStyles.collectionLabel}>想看</Text>
              </View>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
