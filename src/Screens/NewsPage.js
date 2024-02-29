
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Image, Text, View, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import LoadingPage from './LoadingPage';
import api from './api';
import { IMAGE_URL } from '@env';

import { useTranslation } from 'react-i18next';


const cardHeight = 180;
const padding = 10;
const offset = cardHeight + padding;

export default function NewsPage({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);
  const [dataFound, setDataFound] = useState(false);
  const [newsData, setNewsData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchNewsData();
  }, []);


  const fetchNewsData = async () => {
    try {
      setIsLoading(true);
      api.get('/news')
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(true);
            const data = response.data;
            if (data.length === 0) {
              setDataFound(true)
            } else {
              setNewsData(data);
              setIsLoading(false);
            }

          } else {
            setIsLoading(false);
            console.log('location Request failed with status:', response.status);

          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error(error, 'Handle error');
        });
    } catch (error) {
      setIsLoading(false);
      console.error('An error occurred in location:', error);
    }
  };

  const formatCreatedAt = (timestamp) => {
    const date = new Date(Number(timestamp));

    const day = date.getDate();
    const month = date.toLocaleString('en-us', { month: 'long' });
    const year = date.getFullYear();

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours %= 12;
    hours = hours || 12; // Handle midnight (12:00 AM)

    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${day} ${month} ${year} ${formattedTime}`;
  };

  const NewsDetails = (item) => {
    const { _id } = item;
    navigation.navigate('NewsDetails', { item: _id });
  };

  function addEllipsisAfterTenWords(text) {
    let words = text.split(' ');

    // Check if the number of words is more than 10
    if (words.length > 15) {
      // Remove words after the 10th word
      words = words.slice(0, 15);

      // Add ellipsis
      words[14] += '...';
    }

    let result = words.join(' ');

    return result;
  }

  if (isLoading) {
    return <LoadingPage />;
  }
  if (dataFound) {
    return <View style={styles.blankcontainer}>
      <Text style={styles.blank}>{t('nodatafound')}</Text>
    </View>;
  }
  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={{ flex: 1 }} resizeMode="cover" >
      <View style={styles.container}>
        <View style={{ marginTop: 10 }}>
          <FlatList
            data={newsData}
            keyExtractor={item => item._id.toString()}
            renderItem={({ item }) => {

              return (
                <TouchableOpacity onPress={() => NewsDetails(item)} activeOpacity={0.9} style={styles.subContainer}>
                  <View style={styles.card}>
                    <View style={styles.flexImage}>


                      <View style={styles.cardImage}>
                        <Image width={100} height={100} source={{ uri: `${IMAGE_URL}/${item?.image}` }} />
                      </View>
                      <View style={styles.cardContent}>
                        <Text style={styles.date}>{formatCreatedAt(item.created_at)}</Text>
                        <Text style={styles.cardTitle}>{addEllipsisAfterTenWords(item.title)}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  subContainer: {
    paddingHorizontal: '4%',
    paddingBottom: 2,
  },

  card: {
    marginVertical: 6,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: 'black',
    elevation: 5,

  },
  flexImage: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    height: '100%',
  },
  cardImage: {
    height: '100%',
  },
  cardContent: {
    paddingRight: 10,
    paddingVertical: 5,
    flexBasis: '70%',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'arial',
    fontWeight: '600',
    color: 'black',
  },
  date: {
    fontSize: 12,
    color: 'black',
    fontWeight: '400',
    fontFamily: 'Roboto',
    fontWeight: 'bold',

  },
  cardDescription: {
    fontSize: 14,
    marginTop: 5,
    color: 'black'
  },
  blankcontainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  blank: {
    color: 'black',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '500',
    width: '90%',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
