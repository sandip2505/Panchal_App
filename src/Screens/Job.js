import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Job = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: '#000'}}>Job</Text>
    </View>
  );
};

export default Job;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});
