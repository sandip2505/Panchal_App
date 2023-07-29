import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import Swiper from 'react-native-swiper';
import {API_BASE_URL, API_KEY, IMAGE_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

console.log('API_BASE_URL', API_BASE_URL);

const HomePage = ({navigation}) => {
  const [image, setImage] = useState([]);

  useEffect(() => {
    fetchSliderImage();
  }, []);

  const [isTestData, setIsTestData] = useState(false);

  const keyUpdate = () => {
    AsyncStorage.getItem('isTest', function (err, value) {
      setIsTestData(JSON.parse(value));
    });
  };

  useEffect(() => {
    keyUpdate();
  }, [keyUpdate]);

  const fetchSliderImage = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/slider`);
      if (response.status === 200) {
        const data = response.data;
        setImage(data);
      } else {
        console.log('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleAboutPress = () => {
    navigation.navigate('AboutUs');
  };

  const handleDirectoryPress = () => {
    navigation.navigate('Directory');
  };

  const handleVillagesPress = () => {
    navigation.navigate('Villages');
  };
  const handleRegisterPress = () => {
    navigation.navigate('FirstForm');
  };
  const handlePaymentPage = () => {
    navigation.navigate('PaymentPage');
  };

  return (
    <View style={styles.maindiv}>
      <ScrollView>
        <View>
          <Swiper
            style={styles.swiperContainer}
            showsPagination={true}
            loop={true}>
            {image.map((img, index) => (
              <View key={index}>
                <Image
                  style={styles.image}
                  source={{uri: `${IMAGE_URL}/${img.image}`}}
                  alt={`image-${index}`}
                />
              </View>
            ))}
          </Swiper>
        </View>
        <View style={styles.container}>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.box}
              onPress={() => navigation.navigate('AboutUs')}>
              <View style={styles.circle}>
                <Image
                  style={styles.boxImage}
                  source={require('../assets/about.png')}
                  alt="about"
                />
              </View>
              <Text style={styles.boxText}>About Us</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.box}
              onPress={() => {
                navigation.navigate('Directory');
              }}>
              <View style={styles.circle}>
                <Image
                  style={styles.boxImage}
                  source={require('../assets/directory.png')}
                  alt="directory"
                />
              </View>
              <Text style={styles.boxText}>Directory</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.box} onPress={handleVillagesPress}>
              <View style={styles.circle}>
                <Image
                  style={styles.boxImage}
                  source={require('../assets/villages.png')}
                  alt="villages"
                />
              </View>
              <Text style={styles.boxText}>Villages</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            {!isTestData && (
              <TouchableOpacity
                style={styles.box}
                onPress={() => navigation.navigate('FirstForm')}>
                <View style={styles.circle}>
                  <Image
                    style={styles.boxImage}
                    source={require('../assets/register.png')}
                    alt="register"
                  />
                </View>
                <Text style={styles.boxText}>Register</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.box}
              onPress={() => navigation.navigate('SearchDirectory')}>
              <View style={styles.circle}>
                <Image
                  style={styles.boxImage}
                  source={require('../assets/search.png')}
                  alt="search"
                />
              </View>
              <Text style={styles.boxText}> Search </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  maindiv: {
    height: '100%',
    width: '100%',
  },

  swiperContainer: {
    height: 270,
  },

  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    height: '100%',
    paddingVertical: 25,
  },

  row: {
    flexDirection: 'row',
  },

  image: {
    height: 270,
    width: '100%',
  },

  box: {
    width: '28%',
    height: 135,
    backgroundColor: 'white',
    margin: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    elevation: 5,
  },

  boxText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  circle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
  },

  boxImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
