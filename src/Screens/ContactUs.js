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
import { Divider } from 'native-base';
import api from '../context/api';
import { useTranslation, initReactI18next } from 'react-i18next';
import { background } from 'native-base/lib/typescript/theme/styled-system';


const ContactUs = ({ navigation }) => {
  const [contact1, setcontact1] = useState('');
  const [contactno1, setcontactno1] = useState('');
  const [contact2, setcontact2] = useState('');
  const [contactno2, setcontactno2] = useState('');
  const [facebook, setfacebook] = useState('');
  const [telegram, settelegram] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    paymentamout();
  }, []);
  const { t } = useTranslation();


  const paymentamout = async () => {
    try {
      const response = await api.get('/listsettings');
      if (response.status === 200) {
        const data = response.data;
        const contact1 = data.find(item => item.key === 'contact1');
        const contactno1 = data.find(item => item.key === 'contactno1');
        const contact2 = data.find(item => item.key === 'contact2');
        const contactno2 = data.find(item => item.key === 'contactno2');
        const facebook = data.find(item => item.key === 'facebook');
        const telegram = data.find(item => item.key === 'telegram');
        const email = data.find(item => item.key === 'email');


        setcontact1(contact1?.value);
        setcontactno1(contactno1?.value);
        setcontact2(contact2?.value);
        setcontactno2(contactno2?.value);
        setfacebook(facebook?.value);
        settelegram(telegram?.value);
        setEmail('pragatimandalsevatrust@gmail.com');
      } else {
        console.log('listsettings Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleFirstNumberPress = () => {
    // const phoneNumber = '9876543210';
    Linking.openURL(`tel:${contactno1}`).catch(error => {
      console.error('Error opening phone number:', error);
    });
  };

  const handleSecondNumberPress = () => {
    Linking.openURL(`tel:${contactno2}`).catch(error => {
      console.error('Error opening phone number:', error);
    });
  };
  const handleEmailPress = () => {
    const recipientEmail = email; // Replace with the actual email address
    const mailtoUrl = `mailto:${recipientEmail}`;

    Linking.openURL(mailtoUrl)
      .catch(error => {
        console.error('Error opening email client:', error);
      });
  };

  // const handleFacebookLinkPress = () => {
  //   const url = facebook;
  //   Linking.openURL(url).catch(error => {
  //     console.error('Error opening facebook link:', error);
  //   });
  // };

  // const handleTeligramLinkPress = () => {
  //   const url = telegram;
  //   Linking.openURL(url).catch(error => {
  //     console.error('Error opening telegram link:', error);
  //   });
  // };

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
            <Text style={styles.upperdetailstext}>{t('contactusheading')}</Text>


            <View>
              <Text style={styles.contact}>
                {contact1 ? contact1 : 'પંચાલ સમાજ'}
              </Text>
              <Text style={styles.number} onPress={handleFirstNumberPress}>
                {contactno1}
              </Text>
            </View>
            <View>
              <Text style={styles.contact}>{contact2}</Text>
              <Text style={styles.number} onPress={handleSecondNumberPress}>
                {contactno2}
              </Text>
            </View>
            <View>
              <Text style={styles.contact}>Email Address</Text>
              <Text style={styles.number} onPress={handleEmailPress}>
                {email}
              </Text>
            </View>


          </View>

          <View style={styles.divider}></View>

          <View style={styles.lowerdetails}>
            <Text style={styles.lowerdetailstext}>
              {t('developercontact')}
            </Text>

            <View style={styles.developer}>
              <Text
                onPress={() => Linking.openURL('https://codecrewinfotech.com')}
                style={styles.developerlink}>
                https://codecrewinfotech.com
              </Text>

              <Text
                onPress={handleDeveloperNumberPress}
                style={styles.developerlink}>
                972-466-9622
              </Text>
            </View>

            <Text style={styles.developertext}>{t('developeby')}</Text>

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
      </ImageBackground >
    </View >
  );
};

export default ContactUs;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#dae4f0',
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
    padding: 25,
    gap: 15,
    flexBasis: '55%',
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
    fontSize: 21,
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    opacity: 0.8,
  },

  // link: {
  //   gap: 7,
  // },

  // linktext: {
  //   color: '#21258d',
  //   fontSize: 20,
  //   textAlign: 'center',
  //   fontWeight: 'bold',
  //   textDecorationLine: 'underline',
  // },

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
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
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
