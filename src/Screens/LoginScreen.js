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
  Platform,
  Pressable,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView
} from 'react-native';
import api from './api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../component/CustomToast';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import { useTranslation, initReactI18next } from 'react-i18next';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
    <ImageBackground source={require('../assets/bg3.jpg')} style={{ flex: 1 }} resizeMode="cover">
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
              <Text style={styles.title}>{t('entermobilenumberandpassword')}</Text>
              <View style={styles.inputGroup}>
                <View style={styles.inputView}>
                  <TextInput placeholder={t('mobile')} placeholderTextColor="gray" onChangeText={setmobile_no} keyboardType="numeric" maxLength={10} style={[styles.inputText, { shadowColor: mobileError ? 'red' : 'black' }]} value={mobile_no} />
                  {mobileError && <Text style={styles.error}>{mobileError}</Text>}

                </View>
                <View style={styles.inputView}>
                  <TextInput placeholder={t('password')} placeholderTextColor="gray" onChangeText={setPassword} style={[styles.inputText, { shadowColor: passwordError ? 'red' : 'black' }]}
                    secureTextEntry={isVisible ? false : true}
                    value={password}
                  />
                  <Pressable
                    onPress={() => handleShowPassword()}
                    style={styles.passwordBtn}
                  >
                    <Ionicons
                      name={isVisible ? 'eye-off' : 'eye'}
                      size={25}
                      color="#777"
                    />
                  </Pressable>
                  {passwordError && <Text style={styles.error}>{passwordError}</Text>}
                </View>
              </View>
              {/* <TouchableOpacity
                activeOpacity={0.7}
                style={styles.forgotParent}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.loginBtn}
                onPress={handleLogin}
                activeOpacity={0.6}>
                <Text style={styles.loginText}>{t('submit')}</Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 230,
    height: 230,
    marginVertical: 30
  },
  containerBox: {
    width: 350,
    height: 300,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    padding: 5,
    elevation: 7,
    shadowColor: 'black',
    margin: 15
  },
  title: {
    color: '#000',
    fontSize: 16,
    marginTop: 20,
    fontWeight: '500',
    alignSelf: 'center'
  },
  inputGroup: {
    width: '90%',
    marginTop: 20,
    display: 'flex',
    gap: 10
  },
  inputText: {
    backgroundColor: '#fff',
    width: "100%",
    borderRadius: 30,
    paddingLeft: 15,
    color: '#000',
    elevation: 5,
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
    marginVertical: '8%',
    shadowColor: 'black',
    elevation: 5,
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
    position: 'relative',
  },
  forgotParent: {
    marginTop: 10,
    marginEnd: 25,
    alignSelf: 'flex-end'
  },
  forgotText: {
    color: '#000',
    textAlign: 'right',
    fontWeight: '500',
  },
  error: {
    color: '#ff0000',
    fontSize: 13,
    textAlign: 'right',
    paddingRight: 10,
    paddingTop: 2
  },
});
