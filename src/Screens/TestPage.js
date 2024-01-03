import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from 'react-native-elements';
import RNExitApp from 'react-native-exit-app';
import api from './api';

const TestPage = () => {
  useEffect(() => {
    // Make a request using the Axios instance
    api.get('/user-list')
      .then((response) => {
        // Handle successful response
        // console.log(response.data,'response.data');
      })
      .catch((error) => {
        // Handle error
        console.error(error, 'sasas');
      });



  }, []);

  const createTwoButtonAlert = () =>
  Alert.alert('Under Maintenance', "Sorry for the inconvenience, but we're performing some maintenance at the moment. We'll be back online shortly. Thank you for your patience.", [
    {
      text: 'Cancel',
      onPress: () => console.log('Cancel Pressed'),
      style: 'cancel',
    },
    { text: 'OK', onPress: () => handleExit() },
  ]);
  const handleExit = () => {

    RNExitApp.exitApp();
  };

  return (
    <View style={styles.container}>
      {/* <Card containerStyle={styles.cardContainer}>
        <Image
          style={styles.image}
          source={require('../assets/maintenance1.png')}
          resizeMode="contain"
        />
        <Text style={styles.title}>Server Under Maintenance</Text>
        <Text style={styles.message}>
          We apologize for the inconvenience. Our server is currently undergoing maintenance.
        </Text>
        <TouchableOpacity style={styles.okButton} onPress={handleExit}>
          <Text style={styles.okButtonText}>OK</Text>
        </TouchableOpacity>
      </Card> */}
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#FF00',
  },
  cardContainer: {
    width: '80%',
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    left: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#3498db',
    textTransform: 'capitalize',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    color: '#000',
  },
  okButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});


export default TestPage;
