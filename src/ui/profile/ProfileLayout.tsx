/**
  * @Author Ligg
  * @Time 2025/7/3
  **/
import React from 'react';
import {Text, StyleSheet, View} from 'react-native';

const Profile = () => {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Hello World
        </Text>
      </View>
    );
}
export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});
