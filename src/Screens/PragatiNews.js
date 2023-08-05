import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const PragatiNews = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: '#000'}}>Pragati News</Text>
    </View>
  );
};

export default PragatiNews;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});
