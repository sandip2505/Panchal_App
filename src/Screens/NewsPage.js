
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


  return (
    <FlatList
      style={styles.container}
      data={newsData}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      })}
      keyExtractor={item => item._id.toString()}
      renderItem={({ item, index }) => {
        const inputRange = [offset * index, offset * index + offset];

        const outputRange1 = [1, 0];
        const outputRange2 = [0, offset / 2];
        const scale = scrollY.interpolate({
          inputRange,
          outputRange: outputRange1,
          extrapolate: 'clamp',
        });
        const translateY = scrollY.interpolate({
          inputRange,
          outputRange: outputRange2,
          extrapolate: 'clamp',
        });
        const opacity = scale;

        return (
          <Animated.View style={[styles.card, { opacity, transform: [{ translateY }, { scale }] }]}>
            <TouchableOpacity onPress={() => NewsDetails(item)}>
              <Image source={{ uri: `${IMAGE_URL}/${item?.image}` }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{formatCreatedAt(item.created_at)}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                {/* <Text style={styles.cardDescription}>{item.description}</Text> */}
              </View>
            </TouchableOpacity>
          </Animated.View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ddd',
    paddingVertical: padding / 2,
  },
  card: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: padding / 2,
    height: cardHeight,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '60%',
  },
  cardContent: {
    padding: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black'
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 5,
    color: 'black'
  },
});
