import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { IMAGE_URL } from '@env';
import api from './api';
import LoadingPage from './LoadingPage';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const NewsDetails = ({ route }) => {
  console.log(route.params.item, route.params, "route.params")
  const _id = route.params.item;
  const [newsData, setNewsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchNewsData();
  }, [_id]);

  const fetchNewsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get(`/news-edit/${_id}`);
      if (response.status === 200) {
        setNewsData(response.data);
      } else {
        setError(`Request failed with status: ${response.status}`);
      }
    } catch (error) {
      console.log(error, 'error')
      setError('An error occurred while fetching news details');
    } finally {
      setIsLoading(false);
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
    hours = hours || 12; 

    minutes = minutes < 10 ? `0${minutes}` : minutes;

    const formattedTime = `${hours}:${minutes} ${ampm}`;

    return `${day} ${month} ${year} ${formattedTime}`;
};

  if (isLoading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.subContainer}>
      {newsData && (
        <>
          <View style={styles.imageContainer}>
            <Image source={{ uri: `${IMAGE_URL}/${newsData.image}` }} style={styles.newsImage} />
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.date}>{formatCreatedAt(newsData.created_at)}</Text>
            <Text style={styles.newsTitle}>{newsData.title}</Text>
            <Text style={styles.newsDescription}>{newsData.description}</Text>
          </View>
          </>
      )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dae4f0',
    height:'100%',
   
  },
  subContainer: {
    height:'100%',
    padding: 20
  },
  
  imageContainer: {
    width: "100%",
    height: 200,
  },
  newsImage: {
    width: '100%',
    height: '100%',
    // top: 10,
    borderRadius: 5,

  },

  contentContainer: {
    paddingVertical: 10,
    // top: 20,
  },
  newsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',

  },
  newsDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
  },
  date: {
    fontSize: 15,
    lineHeight: 20,
    color: 'black',
    textAlign: 'right',
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
});

export default NewsDetails;
