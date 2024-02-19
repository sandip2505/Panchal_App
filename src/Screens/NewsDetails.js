import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { IMAGE_URL } from '@env';
import api from './api';
import LoadingPage from './LoadingPage';

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
    const month = date.toLocaleString('en-us', { month: 'short' });
    const day = date.getDate();
    return `${month} ${day}`;
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
      {newsData && (
        <>
          <Image source={{ uri: `${IMAGE_URL}/${newsData.image}` }} style={styles.newsImage} />
          <View style={styles.contentContainer}>
            <Text style={styles.newsTitle}>{formatCreatedAt(newsData.created_at)}</Text>
            <Text style={styles.newsTitle}>{newsData.title}</Text>
            <Text style={styles.newsDescription}>{newsData.description}</Text>
          </View>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  newsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  newsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  newsDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: 'black',
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
