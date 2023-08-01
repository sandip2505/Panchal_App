import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';

const CheckConnection = () => {
  const [isReloading, setIsReloading] = useState(false);

  const handleReloadApp = () => {
    setIsReloading(true);
    setTimeout(() => setIsReloading(false), 8000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.text1}>Panchal Samaj</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/NoInternet.png')}
          alt="No Internet"
          style={styles.image}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text2}>Oops !</Text>
        <Text style={styles.text3}>
          Please check your internet connectivity and try again !
        </Text>
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
  },

  titleContainer: {
    marginTop: '10%',
    paddingVertical: 30,
  },
  imageContainer: {
    marginTop: '15%',
  },

  image: {
    height: 300,
    width: 300,
  },

  textContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },

  text1: {
    fontFamily: "serif",
    color: '#666',
    fontSize: 30,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text2: {
    fontFamily: "serif",
    color: '#652',
    fontSize: 30,
    textTransform: 'capitalize',
    textAlign: 'center',
    paddingVertical: 10,
  },

  text3: {
    fontFamily: "serif",
    color: '#652',
    fontSize: 15,
    fontWeight: 'bold',
    opacity: 0.7,
    textAlign: 'center',
  },

  btnContainer: {
    marginTop: 50,
    width: '45%',
  },

  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#652',
    paddingHorizontal: 30,
    borderRadius: 30,
    height: '25%',
  },

  btnText: {
    color: '#652',
    fontSize: 18,
    textAlign: 'center',
  },
});
