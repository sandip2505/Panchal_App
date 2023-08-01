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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { showToast } from '../component/CustomToast';

const ChangePassword = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [parentsData, setParentsData] = useState(null);
  // console.log('parentsData profile', parentsData._id);
  const [isOldVisible, setIsOldVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [currentPassError, setCurrentPassError] = useState('');
  const [newPassError, setNewPassError] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');

  const expectedPasswordPattern =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

  useEffect(() => {
    const final = AsyncStorage.getItem('userData')
      .then(value => {
        if (value) {
          const userData = JSON.parse(value);
          setParentsData(userData);
        }
      })
      .catch(error => {
        console.log('Error in profile page : ', error);
      });
  }, []);

  const handleChangepassword = async () => {
    if (currentPassword.length === 0) {
      setCurrentPassError('Current password is required');
      return false;
    } else if (newPassword.length === 0) {
      setCurrentPassError('');
      setNewPassError('New password is required');
      return false;
    } else if (newPassword.length < 6) {
      setNewPassError('Password must have at least 6 characters.');
    } else if (!expectedPasswordPattern.test(newPassword)) {
      setNewPassError(
        'Password must have at least one letter, one number, and one special character.',
      );
    } else if (confirmPassword.length === 0) {
      setNewPassError('');
      setConfirmPassError('Confirm password is required');
      return false;
    } else if(currentPassword === newPassword){
      setConfirmPassError('New password must be different from the current password!')
      return false;
    } else {
      setCurrentPassError('');
      setNewPassError('');
      setConfirmPassError('');
      try {
        const response = await axios.post(`${API_BASE_URL}/password_change`, {
          id: parentsData?._id,
          old_password: currentPassword,
          password: newPassword,
          cpassword: confirmPassword,
        });

        if (response.data.message == 'incorrect current password') {
          setCurrentPassError('Incorrect current password');
        } else if (response.data.message == 'confirm password not matched') {
          setCurrentPassError('');
          setConfirmPassError("Confirm password doesn't match");
        } else {
          setCurrentPassError('');
          setNewPassError('');
          setConfirmPassError('');
          showToast(
            'success',
            'Password updated successfully.',
            'પાસવર્ડ સફળતાપૂર્વક અપડેટ થયો.',
            2500,
          );
          navigation.navigate('ProfilePage');
        }
      } catch (error) {
        console.log(error);
        AsyncStorage.setItem('isTest', JSON.stringify(false));
      }
    }
  };

  const handleShowOldPassword = () => {
    setIsOldVisible(!isOldVisible);
  };
  const handleShowPassword = () => {
    setIsVisible(!isVisible);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/bg4.jpg')}
        resizeMode="stretch"
        style={styles.bgImg}>
        <View
          style={{
            height: '40%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/changepassword.png')}
            alt='Change Password'
            style={styles.image}
          />
        </View>

        <View style={styles.inputContainer}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput
              style={[
                styles.input,
                { borderColor: currentPassError ? '#ff0000' : 'gray' },
                { shadowColor: currentPassError ? '#ff0000' : 'black' },
              ]}
              placeholder="Current password"
              placeholderTextColor="gray"
              onChangeText={setCurrentPassword}
              value={currentPassword}
              secureTextEntry={isOldVisible ? false : true}
            />

            <Pressable
              onPress={() => handleShowOldPassword()}
              style={styles.passwordBtn}>
              <Ionicons
                name={isOldVisible ? 'eye-off' : 'eye'}
                size={28}
                color="#777"
              />
            </Pressable>
          </View>
          {currentPassError && (
            <Text style={styles.error}>{currentPassError}</Text>
          )}

          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TextInput
              style={[
                styles.input,
                { borderColor: newPassError ? '#ff0000' : 'gray' },
                { shadowColor: newPassError ? '#ff0000' : 'black' },
              ]}
              placeholder="New password"
              placeholderTextColor="gray"
              onChangeText={setNewPassword}
              value={newPassword}
              secureTextEntry={isVisible ? false : true}
            />
            <Pressable
              onPress={() => handleShowPassword()}
              style={styles.passwordBtn}>
              <Ionicons
                name={isVisible ? 'eye-off' : 'eye'}
                size={28}
                color="#777"
              />
            </Pressable>
          </View>
          {newPassError && <Text style={styles.error}>{newPassError}</Text>}

          <TextInput
            style={[
              styles.input,
              { borderColor: confirmPassError ? '#ff0000' : 'gray' },
              { shadowColor: confirmPassError ? '#ff0000' : 'black' },
            ]}
            placeholder="Confirm password"
            placeholderTextColor="gray"
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={isVisible ? false : true}
          />
          {confirmPassError && (
            <Text style={styles.error}>{confirmPassError}</Text>
          )}

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => handleChangepassword()}
            activeOpacity={0.6}>
            <Text style={styles.loginText}>Change Password</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: { height: '100%', width: '100%' },

  bgImg: {
    height: '100%',
    width: '100%',
    shadowColor: 'black',
    elevation: 5,
  },

  image: {
    height: 170,
    width: 170,
  },

  inputContainer: {
    width: '100%',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },

  input: {
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 12,
    borderRadius: 5,
    color: 'black',
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    elevation: 5,
    width: '100%',
    height: 50,
  },

  passwordBtn: {
    position: 'absolute',
    right: '2%',
    top: '24%',
    padding: 5
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    height: 55,
    backgroundColor: '#00a9ff',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '15%',
    shadowColor: 'black',
    elevation: 5,
  },

  loginText: {
    color: '#f9f9f9',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  error: {
    color: '#ff0000',
    fontSize: 15,
    textAlign: 'right',
    paddingRight: 7,
  },
});
