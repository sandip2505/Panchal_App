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
  ScrollView,
  Alert,
} from 'react-native';
import api from '../context/api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../component/CustomToast';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import { useTranslation, initReactI18next } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ navigation }) {
  const [email, setemail] = useState('');
  const [otp, setotp] = useState('');
  const [fcmtoken, setFcmtoken] = useState('');
  const [sendOtp, setSendOtp] = useState(false);

  const [isVisible, setIsVisible] = useState(false);

  const [emailError, setemailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    GetFCMToken();
  }, [])
  const GetFCMToken = async () => {
    try {
      let fcmtoken = await AsyncStorage.getItem("fcmtoken");
      setFcmtoken(fcmtoken)
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

  const handleSendOtp = async () => {
    if (email == '') {
      setemailError('Please enter Email Address');
    } else {
      setemailError('');
      try {
        const response = await api.post('/send-otp', { email: email });
        console.log(response.data, "response of handelSendOtp");
        if (response.data.status === true) {
          console.log('Gotcha ');
          showToast(
            'success',
            response.data.message,
            2000,
          );
          setSendOtp(true)

        } else {
          showToast(
            'error',
            response.data.message,
            2000,
          );
          console.log('Not Gotcha ');
          setSendOtp(false)
        }
      } catch (error) {
        console.log(error.response.data, "error of handelSendOtp");
      }
    }
  }

  const handleVerifyOtp = async () => {
    console.log('handleVerifyOtp');
    console.log(otp, 'otp from handleVerifyOtp');
    try {

      const response = await api.post('/check-otp', { otp: otp });
      if (response.data.status === true) {
        console.log('Gotcha');
        showToast(
          'success',
          response.data.message,
          2000,
        );
        navigation.navigate('ResetPassword', { userId: response.data.user_id })
      } else {
        showToast(
          'error',
          response.data.message,
          2000,
        );
        console.log('Not Gotcha ');
      }
      console.log(response.data, 'response of handleVerifyOtp');

    } catch (error) {
      console.log(error, 'error of handleVerifyOtp');
    }

  }

  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={{ flex: 1 }} resizeMode="cover" >
      <SafeAreaView>
        <ScrollView keyboardShouldPersistTaps='always'>
          <View style={styles.container}>
            <View>
              <Image
                source={require('../assets/login.png')}
                style={styles.logo}
                alt="search"
              />
            </View>
            <View style={styles.containerBox}>
              <View style={styles.textGroup}>
                <Text style={styles.title}>Enter your Email to get a one-time password (OTP) for changing your password.</Text>
                <View>
                  <TextInput placeholder='Email Address' placeholderTextColor="grey" keyboardType='email-address'
                    // maxLength={10}
                    value={email}
                    onChangeText={(text) => setemail(text)}
                    style={[styles.inputText, sendOtp ? { backgroundColor: '#D3D3D3' } : {}]} />
                </View>
                {emailError ? <Text style={[styles.errorText, { color: 'red' }]}>{emailError}</Text> : null}

                <View>
                  <TextInput placeholder='OTP' value={otp}
                    onChange={(e) => setotp(e.nativeEvent.text)}
                    editable={sendOtp ? true : false} selectTextOnFocus={sendOtp ? true : false} placeholderTextColor="grey" keyboardType='numeric' maxLength={10} style={[styles.inputText, !sendOtp ? { backgroundColor: '#D3D3D3' } : {}]} />
                </View>
              </View>



              {sendOtp && sendOtp ? (
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={handleVerifyOtp}
                  activeOpacity={0.6}
                >
                  <Text style={styles.loginText}>Submit</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.loginBtn}
                  // onPress={() => navigation.navigate('ResetPassword')}
                  onPress={handleSendOtp}
                  activeOpacity={0.6}>
                  <Text style={styles.loginText}>Send OTP</Text>
                </TouchableOpacity>
              )}

            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: { width: 230, height: 230, marginVertical: 30 },
  containerBox: {
    width: 350,
    height: 320,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    margin: 15,
    elevation: 5
  },
  textGroup: { width: '90%', display: 'flex', gap: 10 },
  title: { color: '#000', fontSize: 16, marginTop: 20, marginBottom: 10, fontWeight: '500', alignSelf: 'center' },
  inputText: {
    backgroundColor: '#fff',
    width: "100%",
    borderRadius: 30,
    paddingLeft: 15,
    color: '#000',
    elevation: 5
  },
  loginText: {
    color: '#f9f9f9',
    fontSize: 20,
    fontWeight: '700',
  },
  loginBtn: {
    height: 50,
    width: "90%",
    backgroundColor: '#036bfc',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '7%',
    shadowColor: 'black',
    elevation: 5,
  },
  error: {
    color: '#ff0000',
    fontSize: 10,
    position: 'absolute',
    bottom: -13,
    right: 10
  },
});
