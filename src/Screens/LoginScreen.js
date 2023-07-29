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
import axios from 'axios';
import { API_BASE_URL, API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../component/CustomToast';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

export default function LoginScreen({ navigation }) {
  const [mobile_no, setmobile_no] = useState('');
  const [password, setPassword] = useState('');

  const [isVisible, setIsVisible] = useState(false);

  const [mobileError, setMobileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async () => {
    if (mobile_no.length == '') {
      setMobileError('Mobile number is required');
      return false;
    } else if (password.length == '') {
      setMobileError('');
      setPasswordError('Password is required');
      return false;
    } else {
      try {
        const response = await axios.post(`${API_BASE_URL}/userlogin`, {
          mobile_number: mobile_no, 
          password: password,
        });
        console.log("login response form api",response.data)
        const userData = JSON.stringify(response.data.user);
        const childData = JSON.stringify(response.data.childData);
        const villageData = JSON.stringify(response.data.villageData);
        if (response.data.mobileError == 'Invalid mobile number') {
          setMobileError('Invalid mobile number');
        } else if (response.data.passwordError == 'Incorrect Password') {
          setMobileError('');
          setPasswordError('Incorrect Password');
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
          showToast('success', 'Login successfully.', 1500);
        }
      } catch (error) {
        console.log(error);
        AsyncStorage.setItem('isTest', JSON.stringify(false));
      }
    }
  };

  const handleShowPassword = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/bg3.jpg')}
        resizeMode="stretch"
        style={styles.bgImg}>
        <View
          style={{
            height: '40%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image source={require('../assets/login.png')} alt='Login' style={styles.image} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: mobileError ? '#ff0000' : 'gray' },
              { shadowColor: mobileError ? '#ff0000' : 'black' },
            ]}
            placeholder="Mobile Number"
            placeholderTextColor="gray"
            onChangeText={setmobile_no}
            keyboardType="numeric"
            value={mobile_no}
          />
          {mobileError && <Text style={styles.error}>{mobileError}</Text>}

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: passwordError ? '#ff0000' : 'gray',
                  shadowColor: passwordError ? '#ff0000' : 'black',
                },
              ]}
              placeholder="Password"
              placeholderTextColor="gray"
              onChangeText={setPassword}
              value={password}
              secureTextEntry={isVisible ? false : true}
            />
            <Pressable
              onPress={() => handleShowPassword()}
              style={styles.passwordBtn}>
              <Ionicons
                name={isVisible ? 'eye-off' : 'eye'}
                size={25}
                color="#777"
              />
            </Pressable>
          </View>
          {passwordError && <Text style={styles.error}>{passwordError}</Text>}

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={handleLogin}
            activeOpacity={0.6}>
            <Text style={styles.loginText}>LOGIN</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  bgImg: {
    height: '100%',
    width: '100%',
  },

  image: {
    height: 250,
    width: 280,
  },

  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginVertical: 30,
  },

  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 12,
    borderRadius: 5,
    color: 'black',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: 'black',
    elevation: 5,
    width: '100%',
    // flexBasis: "90%"
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    height: 55,
    backgroundColor: '#036bfc',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '15%',
    elevation: 5,
  },

  loginText: {
    color: '#f9f9f9',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  passwordBtn: {
    position: 'absolute',
    right: '3%',
    top: '29%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  error: {
    color: '#ff0000',
    fontSize: 15,
    textAlign: 'right',
    paddingRight: 7,
  },
});
