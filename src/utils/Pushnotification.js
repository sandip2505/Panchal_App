
import React, { useEffect, useRef, useState } from 'react';
import { Animated, FlatList, StyleSheet, Image, Text, View, Alert, TouchableOpacity } from 'react-native';
import LoadingPage from './LoadingPage';
import api from './api';
import { IMAGE_URL } from '@env';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { initializeApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';



const cardHeight = 200;
const padding = 0;
const offset = cardHeight + padding;

export default function NewsPage({ navigation }) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);
  const [newsData, setNewsData] = useState([]);
  // const [lastNewsTitle, setLastNewsTitle] = useState('');

  useEffect(() => {
    fetchNewsData();
    GetFCMToken();
    initializeApp();
    initializeFirebase();
  }, []);


  const initializeFirebase = async () => {
    try {
      // ... your existing Firebase initialization code ...

      // Register background message handler
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
        // You can handle the notification data here
        if (remoteMessage.data) {
          // Assume your notification data contains a 'page' field
          const pageName = remoteMessage.data.page;
          console.log('Navigating to page:', pageName);
          // Now you can navigate to the specified page
          // For example, you can use React Navigation
          navigation.navigate(pageName);
        }
      });

      console.log('Firebase initialized successfully');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
    }
  }

  const GetFCMToken = async () => {
    try {
      let fcmtoken = await AsyncStorage.getItem("fcmtoken");
      console.log(fcmtoken, "old token");
      if (!fcmtoken) {
        const femtoken = await messaging().getToken();
        if (femtoken) {
          console.log(femtoken, "new token");
          await AsyncStorage.setItem("fcmtoken", femtoken);
        }
      }
    } catch (error) {
      console.log(error, "error in GetFCMToken");
    }
  };
  const fetchNewsData = async () => {
    try {
      setIsLoading(true);
      api.get('/news')
        .then((response) => {
          if (response.status === 200) {
            setIsLoading(true);
            const data = response.data;

            notifyNewsAdded(data[0].title, data[0].description);

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
    navigation.navigate('NewsDetails', { item: item });
  };



  const notifyNewsAdded = (newsTitle, newDescription) => {
    console.log("newsTitle", newsTitle);

    PushNotification.localNotification({
      title: newsTitle,
      message: newDescription,
      invokeApp: false,
    });

    PushNotification.localNotificationSchedule({
      title: 'Notification Sent',
      message: 'News notification sent successfully!',
      date: new Date(Date.now()),
    });
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
