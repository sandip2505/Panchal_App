import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {API_BASE_URL} from '@env';
import {WebView} from 'react-native-webview';

const AboutUs = ({navigation}) => {
  const [aboutUs, setaboutUs] = useState([]);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/aboutus`);
      if (response.status === 200) {
        const data = response.data;
        setaboutUs(data);
      } else {
        console.log('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
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
    <View style={styles.container}>
      {aboutUs.map(item => (
        <WebView
          key={item._id}
          source={{
            html: `${injectCSS}<div class="description">${item.description}</div>`,
          }}
          style={styles.webViewContent}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  webViewContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
});

export default AboutUs;
