import {StyleSheet, Text, View, Image,Pressable} from 'react-native';
import React from 'react';

const CheckConnection = () => {
  const handleReloadApp = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 1000); // Optional delay before reloading
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/NoInternet.png')}
          alt="No Internet"
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>Oops !</Text>
        <Text style={styles.text2}>
          Please check your internet connection and try again !
        </Text>
      </View>
      <View style={styles.btnContainer}>
        <Pressable style={styles.button}>
          <Text style={styles.btnText}>Try Again</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default CheckConnection;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  imageContainer: {},

  image: {
    height: 300,
    width: 300,
  },

  textContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },

  text1: {
    color: '#652',
    fontSize: 30,
    textTransform: 'capitalize',
    textAlign: 'center',
  },

  text2: {
    color: '#652',
    fontSize: 15,
    fontWeight: 'bold',
    opacity: 0.5,
    textAlign: 'center',
  },


  btnText: {
color: "#000",
fontSize: 18,
textAlign: "center",
  },
});
