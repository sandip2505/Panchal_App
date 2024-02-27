import React, { useState, useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Pressable,
} from 'react-native';
import api from './api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../component/CustomToast';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import { useTranslation, initReactI18next } from 'react-i18next';

export default function LoginScreen({ navigation }) {
  const [mobile_no, setmobile_no] = useState('');
  const [password, setPassword] = useState('');
  const [fcmtoken, setFcmtoken] = useState('');

  const [isVisible, setIsVisible] = useState(false);

  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    GetFCMToken();
  })
  const GetFCMToken = async () => {
    try {
      let fcmtoken = await AsyncStorage.getItem("fcmtoken");
      setFcmtoken(fcmtoken)
      console.log(fcmtoken, "old token");
      if (!fcmtoken) {
        const femtoken = await messaging().getToken();
        if (femtoken) {
          console.log(femtoken, "new token");
          setFcmtoken(fcmtoken)
          await AsyncStorage.setItem("fcmtoken", femtoken);
        }
      }
    } catch (error) {
      console.log(error, "error in GetFCMToken");
    }
  };

  const handleLogin = async () => {
    if (mobile_no.length == '') {
      setMobileError(t('mobilenumberisrequired'));
      return false;
    } else if (password.length == '') {
      setMobileError('');
      setPasswordError(t('passwordisrequired'));
      return false;
    } else {
      setMobileError('');
      setPasswordError('');
      try {
        const response = await api.post(`/userlogin`, {
          mobile_number: mobile_no,
          password: password,
          device_token: fcmtoken,
        });
        const userData = JSON.stringify(response.data.user);
        const childData = JSON.stringify(response.data.childData);
        const villageData = JSON.stringify(response.data.villageData);
        if (response.data.mobileError == 'Invalid mobile number') {
          setMobileError(t('invalidmobilenumber'));
        } else if (response.data.passwordError == 'Incorrect Password') {
          setMobileError('');
          setPasswordError(t('incorrectPassword'));
        } else {
          setmobile_no('');
          setPassword('');
          setMobileError('');
          setPasswordError('');
          AsyncStorage.setItem('userData', userData);
          AsyncStorage.setItem('childData', childData);
          AsyncStorage.setItem('villageData', villageData);
          AsyncStorage.setItem('isTest', JSON.stringify(true));
          navigation.navigate('HomePage');
          showToast(
            'success',
            t('loginsuccessfully'),
            2000,
          );
        }
      } catch (error) {
        console.log('error', error);
        AsyncStorage.setItem('isTest', JSON.stringify(false));
      }
    }
  };

  const handleShowPassword = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerBackground}>
        <View>
          <Image
            source={require('../assets/panchal.png')}
            style={{ width: 170, height: 170, marginVertical: 30 }}
            alt="search"
          />
        </View>

        <View style={styles.containerBox}>
          {/* <View>
            <Text style={{ color: '#000', fontSize: 25, fontWeight: 'bold', alignSelf: 'center' }}>Forgot Password</Text>
          </View> */}
          <View>
            <Text style={{ color: '#000', fontWeight: 400 }}>Please enter your mobile number to receive a one-time password (OTP) for resetting your password.</Text>
            <View>
              <View style={{ marginTop: 10 }}>
                <TextInput placeholder='Mobile Number' placeholderTextColor="grey" keyboardType='numeric' maxLength={10} style={styles.inputText} />
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.6}>
            <Text style={styles.loginText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', position: 'relative' },
  containerBackground: {
    height: '100%',
    width: '100%',
    display: 'flex',
    // justifyContent: 'center',
    gap: 50,
    alignItems: 'center',
    backgroundColor: '#fdf1d3'
  },
  containerBox: {
    width: 350,
    height: 350,
    borderRadius: 25,
    backgroundColor: '#bbe2ec',
    display: 'flex',
    alignItems: 'center',
    padding: 10,
    elevation: 5
  },
  inputText: {
    backgroundColor: '#fcfcfc',
    width: "100%",
    borderRadius: 30,
    paddingLeft: 15,
    color: '#000',
    elevation: 1
  },
  loginText: {
    color: '#f9f9f9',
    fontSize: 20,
    textTransform: 'capitalize',
    fontWeight: '700',
  },
  loginBtn: {
    height: 50,
    width: "90%",
    backgroundColor: '#036bfc',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '10%',
    shadowColor: 'black',
    elevation: 1,
  },
  passwordBtn: {
    position: 'absolute',
    right: '4%',
    top: '25%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputView: {
    position: 'relative'
  },
  forgotParent: {
    textAlign: 'right',
    width: '100%',
  },
  forgotText: {
    color: '#000',
    textAlign: 'right',
    fontWeight: 'bold',
    marginEnd: 5
  },
  error: {
    color: '#ff0000',
    fontSize: 10,
    position: 'absolute',
    bottom: -13,
    right: 10
    // textAlign: 'right',
    // paddingRight: 20,
    // paddingVertical: 2,
  },
});
