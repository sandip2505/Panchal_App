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
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import { showToast } from '../component/CustomToast';
import api from '../context/api';
import { useTranslation, initReactI18next } from 'react-i18next';

const ChangePassword = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [parentsData, setParentsData] = useState(null);
  const [isOldVisible, setIsOldVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [currentPassError, setCurrentPassError] = useState('');
  const [newPassError, setNewPassError] = useState('');
  const [confirmPassError, setConfirmPassError] = useState('');
  const { t } = useTranslation();

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
      setCurrentPassError(t('currentpasswordisrequired'));
      return false;
    } else if (newPassword.length === 0) {
      setCurrentPassError('');
      setNewPassError(t('newpasswordisrequired'));
      return false;
    } else if (newPassword.length < 6) {
      setNewPassError(t('passwordmusthaveatleastcharacters'));
    } else if (!expectedPasswordPattern.test(newPassword)) {
      setNewPassError(
        t('passwordmusthaveatleastoneletteronenumberandonespecialcharacter'),
      );
    } else if (confirmPassword.length === 0) {
      setNewPassError('');
      setConfirmPassError(t('confirmpasswordisrequired'));
      return false;
    } else if (currentPassword === newPassword) {
      setConfirmPassError(
        'New password must be different from the current password!',
      );
      return false;
    } else {
      setCurrentPassError('');
      setNewPassError('');
      setConfirmPassError('');
      try {

        const response = await api.post('/password_change', {
          id: parentsData?._id,
          old_password: currentPassword,
          password: newPassword,
          cpassword: confirmPassword,
        });

        if (response.data.message == 'incorrect current password') {
          setCurrentPassError(t('incorrectcurrentpassword'));
        } else if (response.data.message == 'confirm password not matched') {
          setCurrentPassError('');
          setConfirmPassError("Confirm password doesn't match");
        } else {
          setCurrentPassError('');
          setNewPassError('');
          setConfirmPassError('');
          showToast(
            'success',
            t('passwordupdatedsuccessfully'),
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
        source={require('../assets/bg3.jpg')}
        // resizeMode="stretch"
        style={styles.bgImg}>
        <View
          style={{
            height: '40%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={require('../assets/changepassword.png')}
            alt="Change Password"
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
              placeholder={t('currentpassword')}
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
              placeholder={t('newPassword')}
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
            placeholder={t('confirmpassword')}
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
            <Text style={styles.loginText}>{t('changePassword')}</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#dae4f0'
  },

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
    elevation: 5,
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 6,
    color: 'black',
    paddingHorizontal: 8,
    height: 50,
    width: '100%',
  },

  passwordBtn: {
    position: 'absolute',
    right: '2%',
    top: '35%',
    padding: 5,
  },

  forgot_button: {
    height: 30,
    marginBottom: 30,
  },

  loginBtn: {
    height: 55,
    backgroundColor: '#00a9ff',
    borderRadius: 6,
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
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});
