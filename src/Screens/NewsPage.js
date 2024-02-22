
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Image, Text, View, Alert, TouchableOpacity } from 'react-native';
import LoadingPage from './LoadingPage';
import api from './api';
import { IMAGE_URL } from '@env';



const cardHeight = 180;
const padding = 10;
const offset = cardHeight + padding;

export default function NewsPage({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);

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

            setNewsData(data);
            setIsLoading(false);
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
    const month = date.toLocaleString('en-us', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
  };

  const NewsDetails = (item) => {
    const { _id } = item;
    navigation.navigate('NewsDetails', { item: _id });
  };

  function addEllipsisAfterTenWords(text) {
    let words = text.split(' ');

    // Check if the number of words is more than 10
    if (words.length > 10) {
      // Remove words after the 10th word
      words = words.slice(0, 20);

      // Add ellipsis
      words[19] += '...';
    }

    let result = words.join(' ');

    return result;
  }

  if (isLoading) {
    return <LoadingPage />;
  }
  return (
    <View style={styles.container}>
      <View style={{}}>
        <FlatList
          style={styles.subContainer}
          data={newsData}
          keyExtractor={item => item._id.toString()}
          renderItem={({ item }) => {

            return (
              <TouchableOpacity onPress={() => NewsDetails(item)} activeOpacity={1}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    height: '100%',
  },
  subContainer: {
    paddingHorizontal: '4%',
    paddingBottom: 30,
  },

  card: {
    marginVertical: 6,
    height: 100,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    borderColor: 'gray',
    borderWidth: 1,
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
    borderRightWidth: 1,
    borderRightColor: 'gray',
    flexBasis: '30%',
  },
  cardContent: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingTop: 5,
    flexBasis: '70%',

  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
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
});
