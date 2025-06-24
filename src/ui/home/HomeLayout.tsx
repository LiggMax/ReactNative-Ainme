import React, {useEffect, useState, useMemo, useCallback} from 'react';
import {StyleSheet, useWindowDimensions} from 'react-native';
import {useTheme} from 'react-native-paper';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {SafeAreaView} from 'react-native-safe-area-context';
import Recommend from './tab/Recommend';
import Schedules from './tab/Schedules';
import Ranking from './tab/Ranking';

export default function HomeLayout() {
  const theme = useTheme();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    {key: 'recommend', title: '推荐'},
    {key: 'schedules', title: '新番时间表'},
    {key: 'ranking', title: '排行榜'},
  ]);

  // 缓存页面组件，避免重新渲染
  const RecommendRoute = useMemo(() => () => <Recommend />, []);

  const SchedulesRoute = useMemo(() => () => <Schedules />, []);

  const RankingRoute = useMemo(() => () => <Ranking />, []);

  const renderScene = useMemo(
    () =>
      SceneMap({
        recommend: RecommendRoute,
        schedules: SchedulesRoute,
        ranking: RankingRoute,
      }),
    [RecommendRoute, SchedulesRoute, RankingRoute],
  );

  const renderTabBar = useCallback(
    (props: any) => (
      <TabBar
        {...props}
        indicatorStyle={[
          styles.tabIndicator,
          {backgroundColor: theme.colors.primary},
        ]}
        style={[styles.tabBar, {backgroundColor: theme.colors.surface}]}
        labelStyle={styles.tabLabel}
        activeColor={theme.colors.primary}
        inactiveColor={theme.colors.onSurfaceVariant}
        scrollEnabled={false}
        tabStyle={styles.tabStyle}
        contentContainerStyle={styles.tabBarContent}
        pressColor="transparent"
        pressOpacity={0}
        android_ripple={null}
      />
    ),
    [theme.colors.primary, theme.colors.surface, theme.colors.onSurfaceVariant],
  );

  const layout = useWindowDimensions();

  // React 的 useEffect 钩子
  useEffect(() => {
  }, []);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: theme.colors.background}]} edges={['top', 'bottom']}>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={renderTabBar}
        initialLayout={{width: layout.width}}
        style={[styles.tabView, {backgroundColor: theme.colors.background}]}
        tabBarPosition="top"
        swipeEnabled={true}
        lazy={true}
        lazyPreloadDistance={0}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },
  tabView: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  tabBar: {
    elevation: 0,
    shadowOpacity: 0,
  },
  tabIndicator: {
    height: 3,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'none',
    margin: 0,
    padding: 0,
  },
  interval: {
    margin: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  tabStyle: {
    flex: 1,
    paddingHorizontal: 4,
  },
  tabBarContent: {
    justifyContent: 'space-around',
  },
});
