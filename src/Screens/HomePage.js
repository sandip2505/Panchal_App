import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  ImageBackground
} from 'react-native';
import { IMAGE_URL } from '@env';
import api from '../context/api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import MaintenanceScreen from './MaintenanceScreen';
import { useTranslation, initReactI18next } from 'react-i18next';
import i18n from '../context/i18n';

const HomePage = ({ navigation }) => {


  const [image, setImage] = useState([]);
  const [isTestData, setIsTestData] = useState(false);
  const [language, setLanguage] = useState('');

  const { width, height } = Dimensions.get('window');
  const sliderHeight = height * 0.32;
  const { t } = useTranslation();


  useEffect(() => {
    fetchSliderImage();
  }, []);

  useEffect(() => {
    const getSelectedLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (storedLanguage) {
          i18n.changeLanguage(storedLanguage).catch((error) => {
            console.error('Error changing language:', error);
          });
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error retrieving language:', error);
      }
    };

    getSelectedLanguage();
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
      const response = await api.get(`/slider`);
      if (response.status === 200) {
        const data = response.data;
        setImage(data);

      } else {
        return response.status
        console.log('slider Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('slider Request failed:', error.message);
    }
  };

  return (
    <ImageBackground source={require('../assets/bg3.jpg')}>
      <View style={styles.maindiv}>
        <ScrollView>
          <View style={{ height: sliderHeight }}>
            <SwiperFlatList
              autoplay
              autoplayDelay={2}
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
                backgroundColor: '#383dc9',
              }}
              paginationStyleItemInactive={{
                width: 8,
                height: 8,
                backgroundColor: '#f5f5f5',
                opacity: 0.4,
              }}
              data={image}
              renderItem={({ item, index }) =>
                item ? (
                  <View key={index} style={{ width, height: sliderHeight }}>
                    <Image
                      style={{ width, height: sliderHeight }}
                      source={{ uri: `${IMAGE_URL}/${item.image}` }}
                      alt={`image-${index}`}
                    />
                  </View>
                ) : (
                  <View style={{ width, height: sliderHeight }}>
                    <Image
                      style={{ width, height: sliderHeight }}
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
                <Text style={styles.boxText}>{t('aboutUs')}</Text>
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
                <Text style={styles.boxText}>{t('directory')}</Text>
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
                <Text style={styles.boxText}>{t('villages')}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
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
                  <Text style={styles.boxText}>{t('register')}</Text>
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
                <Text style={styles.boxText}> {t('search')} </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.box}
                onPress={() => navigation.navigate('NewsPage')}>
                <View style={styles.circle}>
                  <Image
                    style={styles.boxImage}
                    source={require('../assets/news.png')}
                    alt="search"
                  />
                </View>
                <Text style={styles.boxText}> {t('news')} </Text>
              </TouchableOpacity>


            </View>
            {/* <View style={styles.row}>


              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.box}
                onPress={() => navigation.navigate('TestPage')}>
                <View style={styles.circle}>
                  <Image
                    style={styles.boxImage}
                    source={require('../assets/news.png')}
                    alt="search"
                  />
                </View>
                <Text style={styles.boxText}> Test </Text>
              </TouchableOpacity>

            </View> */}

          </View>
        </ScrollView>
      </View>
    </ImageBackground>

  );
};

export default HomePage;

const styles = StyleSheet.create({
  maindiv: {
    height: '100%',
    width: '100%',
    // backgroundColor: '#fdf1d3',
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
    // #f2ece4
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
