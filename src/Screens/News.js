import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const News = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: '#000'}}>News</Text>
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});
