import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Pressable,
  ImageBackground,
  Image,
  Linking,
} from 'react-native';
import { API_BASE_URL, API_KEY } from '@env';
import { Divider } from 'native-base';
import axios from 'axios';

const ContactUs = ({ navigation }) => {
  const [contact1, setcontact1] = useState('');
  const [contactno1, setcontactno1] = useState('');
  const [contact2, setcontact2] = useState('');
  const [contactno2, setcontactno2] = useState('');
  const [facebook, setfacebook] = useState('');
  const [telegram, settelegram] = useState('');
  // console.log('-------------------===================>1', contact1)
  // console.log('-------------------===================>2', contactno1)
  // console.log('-------------------===================>3', contact2)
  // console.log('-------------------===================>4', contactno2)
  useEffect(() => {
    paymentamout();
  }, []);

  const paymentamout = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listsettings`);
      if (response.status === 200) {
        const data = response.data;
        const contact1 = data.find(item => item.key === 'contact1');
        const contactno1 = data.find(item => item.key === 'contactno1');
        const contact2 = data.find(item => item.key === 'contact2');
        const contactno2 = data.find(item => item.key === 'contactno2');
        const facebook = data.find(item => item.key === 'facebook');
        const telegram = data.find(item => item.key === 'telegram');
        setcontact1(contact1.value)
        setcontactno1(contactno1.value)
        setcontact2(contact2.value)
        setcontactno2(contactno2.value)
        setfacebook(facebook.value)
        settelegram(telegram.value)
      } else {
        console.log('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };


  const handleFirstNumberPress = () => {
    const phoneNumber = '9876543210';
    Linking.openURL(`tel:${phoneNumber}`).catch(error => {
      console.error('Error opening phone number:', error);
    });
  };

  const handleSecondNumberPress = () => {
    const phoneNumber = '9876543210';
    Linking.openURL(`tel:${phoneNumber}`).catch(error => {
      console.error('Error opening phone number:', error);
    });
  };

  const handleFacebookLinkPress = () => {
    const url = facebook;
    Linking.openURL(url).catch(error => {
      console.error('Error opening facebook link:', error);
    });
  };

  const handleTeligramLinkPress = () => {
    const url = telegram;
    Linking.openURL(url).catch(error => {
      console.error('Error opening telegram link:', error);
    });
  };

  const handleDeveloperNumberPress = () => {
    const phoneNumber = '9724669622';
    Linking.openURL(`tel:${phoneNumber}`).catch(error => {
      console.error('Error developer phone number:', error);
    });
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/bg1.jpg')}
        resizeMode="stretch"
        style={styles.img}>
        <View style={styles.details}>
          <View style={styles.upperdetails}>
            <Text style={styles.upperdetailstext}>
              સમાજની એપમાં કોઈ ક્ષતિ હોય, જાહેરાત મુકવી હોય, પાસવર્ડ મેળવવા હોય
              વગેરે માટે નીચે આપેલ નંબર પર સંપર્ક કરો
            </Text>

            <Text style={styles.contact}>
              {contact1}
              <Text style={styles.number} onPress={handleFirstNumberPress}>
                {' '}{contactno1}
              </Text>
            </Text>
            <Text style={styles.contact}>
              {contact2}
              <Text style={styles.number} onPress={handleSecondNumberPress}>
                {' '}{contactno2}
              </Text>
            </Text>

            <View style={styles.link}>
              <Pressable onPress={handleFacebookLinkPress}>
                <Text style={styles.linktext}>
                  Click here to Like us on Facebook
                </Text>
              </Pressable>
              <Pressable onPress={handleTeligramLinkPress}>
                <Text style={styles.linktext}>
                  Click here to join us on Telegram
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.divider}></View>

          <View style={styles.lowerdetails}>
            <Text style={styles.lowerdetailstext}>
              વેબસાઇટ / મોબાઈલ એપ ડેવલોપર સંપર્ક :–
            </Text>

            <View style={styles.developer}>
              <Text
                onPress={() => Linking.openURL('https://codecrewinfotech.com')}
                style={styles.developerlink}
              >
                https://codecrewinfotech.com
              </Text>

              <Text onPress={handleDeveloperNumberPress} style={styles.developerlink}>972-466-9622</Text>
            </View>

            <Text style={styles.developertext}>Developed by</Text>

            <Pressable
              style={styles.image}
              onPress={() => Linking.openURL('https://codecrewinfotech.com')}>
              <Image
                source={require('../assets/logo-cc.png')}
                alt="codecrewinfotech"
                style={styles.developerimg}
              />
            </Pressable>
          </View>
        </View>


      </ImageBackground>
    </View>
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '100%',
    height: '100%',
  },

  img: {
    height: '100%',
    width: '100%',
  },

  details: {
    display: 'flex',
    flexDirection: 'column',
  },

  upperdetails: {
    justifyContent: 'center',
    padding: 15,
    gap: 15,
    flexBasis: '55%',
    // marginVertical: 20
  },

  upperdetailstext: {
    color: '#bf2032',
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  contact: {
    color: '#4587b1',
    fontSize: 21,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  number: {
    color: '#1b2093',
    textDecorationLine: 'underline',
  },

  link: {
    gap: 7,
  },

  linktext: {
    color: '#21258d',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  divider: {
    borderTopWidth: 2,
    borderTopColor: 'gray',
    marginVertical: 5,
  },

  lowerdetails: {
    padding: 15,
    gap: 17,
    flexBasis: '40%',
  },

  lowerdetailstext: {
    color: '#bf2032',
    fontSize: 21,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  developer: {
    textAlign: 'center',
    display: "flex",
    flexDirection: "column",
    gap: 5
  },

  developerlink: {
    color: '#21258d',
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  developertext: {
    color: '#282828',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  image: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  developerimg: {
    height: 47,
    width: 180,
  },

  // titleContainer: {
  //   height: '30%',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  // title: {
  //   fontSize: 40,
  //   fontWeight: 'bold',
  //   color: '#515151',
  //   textAlign: 'center',
  //   textTransform: 'capitalize',
  // },

  // textContainer: {
  //   margin: 15,
  // },

  // input: {
  //   borderColor: 'gray',
  //   borderWidth: 1,
  //   marginBottom: 16,
  //   borderRadius: 4,
  //   color: 'black',
  //   paddingHorizontal: 15,
  //   backgroundColor: '#fff',
  // },

  // button: {
  //   height: 55,
  //   backgroundColor: 'rgba(75,75,255,1)',
  //   borderRadius: 4,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginHorizontal: 10,
  // },

  // btntext: {
  //   color: 'white',
  //   fontSize: 25,
  //   fontWeight: 'bold',
  //   textTransform: 'uppercase',
  // },
});
