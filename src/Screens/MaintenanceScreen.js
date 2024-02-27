import React from 'react';
import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-elements';
import RNExitApp from 'react-native-exit-app';

const MaintenanceScreen = () => {
  const handleExit = () => {
    RNExitApp.exitApp();
  };

  return (
    <ImageBackground
      style={styles.container}
      source={require('../assets/maintenancebg.png')} // Replace with your background image path
    >
      <View style={styles.background}>
        <Card containerStyle={styles.cardContainer}>
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
        </Card>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dae4f0',
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

export default MaintenanceScreen;
