import React, { useEffect } from 'react';
import api from '../Screens/api';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Notification() {
  console.log("add")
  
  useEffect(() => {
    requestIgnoreBatteryOptimizations();
    GetFCMToken();

    // Listen for FCM messages
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message Data:', remoteMessage.data);

      // Extract news details from FCM message
      const newsTitle = remoteMessage.data.title;
      const newsDescription = remoteMessage.data.description;
      // Show notification
      notifyNewsAdded(newsTitle, newsDescription);
    });

    return () => {
      // Unsubscribe when component unmounts
      unsubscribe();
    };
  }, []);

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

  const requestIgnoreBatteryOptimizations = async () => {
    try {
      // Request necessary permissions
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log(granted, 'granted >>',PermissionsAndroid.RESULTS.GRANTED)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };



  const fetchNewsData = async () => {
    try {
      api.get('/news')
        .then((response) => {
          if (response.status === 200) {
            const data = response.data;
            notifyNewsAdded(data[0].title, data[0].description);
          } else {
            console.log('location Request failed with status:', response.status);
          }
        })
        .catch((error) => {
          console.error(error, 'Handle error');
        });
    } catch (error) {
      console.error('An error occurred in location:', error);
    }
  };

  const notifyNewsAdded = (newsTitle, newsDescription) => {
    PushNotification.localNotification({
      title: newsTitle,
      message: newsDescription,
      invokeApp: false,
    });

    PushNotification.localNotificationSchedule({
      title: 'Notification Sent',
      message: 'News notification sent successfully!',
      date: new Date(Date.now()),
    });
    
  };
  return null; // Return null as this component doesn't render any UI
}
