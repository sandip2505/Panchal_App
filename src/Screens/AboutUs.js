import { StyleSheet, View, ActivityIndicator, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { WebView } from 'react-native-webview';
import LoadingPage from './LoadingPage';
import api from '../context/api';
const AboutUs = ({ navigation }) => {
  const [aboutUs, setaboutUs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/aboutus');
      if (response.status === 200) {
        setIsLoading(true);
        const data = response.data;
        setaboutUs(data);
        setIsLoading(false);
      } else {
        console.log('aboutus Request failed with status:', response.status);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('An error occurred:', error);
      setIsLoading(false);
    }
  };

  const injectCSS = `
    <style>
      .description {
        font-size: 35px;
        text-align: justify;
        padding: 20px;
      }
    </style>
  `;

  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={styles.container}>
      {/* <View > */}
      {isLoading ? (
        <LoadingPage />
      ) : (
        aboutUs.map(item => (
          <WebView
            key={item._id}
            source={{
              html: `${injectCSS}<div class="description">${item.description}</div>`,
            }}
            style={styles.webViewContent}
          />
        ))
      )}
      {/* </View> */}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    // backgroundColor: '#dae4f0',
  },
  webViewContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default AboutUs;
