import React from 'react';
import {Text, StyleSheet, View} from 'react-native';
import {Button} from 'react-native-paper';


export default function Recommend() {
  return (
    <View style={styles.tabContent}>
      <Text style={[styles.interval]}>推荐内容</Text>
      <View style={[styles.interval]}>
        <Button mode="contained">
          存储本地数据
        </Button>
      </View>
      <View style={[styles.interval]}>
        <Button mode="contained" >
          获取本地数据
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  interval: {
    margin: 10,
  },
});
