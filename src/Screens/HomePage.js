import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {API_BASE_URL, API_KEY, IMAGE_URL} from '@env';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SwiperFlatList} from 'react-native-swiper-flatlist';


const HomePage = ({navigation}) => {
  const [image, setImage] = useState([]);
  const [isTestData, setIsTestData] = useState(false);

  const {width, height} = Dimensions.get('window');
  const sliderHeight = height * 0.32;

  useEffect(() => {
    fetchSliderImage();
  }, []);

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

  return (
    <View style={styles.maindiv}>
      <ScrollView>
        <View style={{height: sliderHeight, overflow: 'hidden'}}>
          <SwiperFlatList
            autoplay
            autoplayDelay={3}
            autoplayLoop
            showPagination
            autoplayLoopKeepAnimation
            paginationStyle={{
              padding: 10,
              alignItems: 'center',
            }}
            paginationStyleItemActive={{
              width: 15,
              height: 8,
              backgroundColor: '#00ff',
            }}
            paginationStyleItemInactive={{
              width: 8,
              height: 8,
              backgroundColor: '#00ff',
              opacity: 0.4,
            }}
            data={image}
            renderItem={({item, index}) =>
              item ? (
                <View key={index} style={{width, height: sliderHeight}}>
                  <Image
                    style={{width, height: sliderHeight}}
                    source={{uri: `${IMAGE_URL}/${item.image}`}}
                    alt={`image-${index}`}
                  />
                </View>
              ) : (
                <View style={{width, height: sliderHeight}}>
                  <Image
                    style={{width, height: sliderHeight}}
                    source={require('../assets/slide.jpeg')}
                    alt={`image`}
                  />
                </View>
              )
            }
          />
        </View>

        <View style={styles.container}>
          <View style={styles.row}>
            <TouchableOpacity
              activeOpacity={0.7}
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
              activeOpacity={0.7}
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

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.box}
              onPress={() => navigation.navigate('Villages')}>
              <View style={styles.circle}>
                <Image
                  style={styles.boxImage}
                  source={require('../assets/village2.png')}
                  alt="villages"
                />
              </View>
              <Text style={styles.boxText}>Villages</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.row}>
            {/* <TouchableOpacity
              activeOpacity={0.7}
              style={styles.box}
              onPress={() => navigation.navigate('job')}>
              <View style={styles.circle}>
                <Image
                  style={styles.boxImage}
                  source={require('../assets/job.png')}
                  alt="directory"
                />
              </View>
              <Text style={styles.boxText}>Job</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              style={styles.box}
              onPress={() => navigation.navigate('News')}>
              <View style={styles.circle}>
                <Image
                  style={styles.boxImage}
                  source={require('../assets/news.png')}
                  alt="News"
                />
              </View>
              <Text style={styles.boxText}>News</Text>
            </TouchableOpacity> */}

            {!isTestData && (
              <TouchableOpacity
                activeOpacity={0.7}
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
              activeOpacity={0.7}
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

          <View style={styles.row}></View>
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
    backgroundColor: '#fff',
  },

  image: {
    height: 'auto',
    width: '100%',
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

  box: {
    width: '28%',
    height: 135,
    margin: 8,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'black',
    elevation: 5,
    backgroundColor: '#fff',
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
