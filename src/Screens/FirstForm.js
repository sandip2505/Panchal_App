import React, { useState, useEffect } from 'react';
import { ImageBackground, Pressable } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../component/CustomToast';
import api from '../context/api';
import { useTranslation, initReactI18next } from 'react-i18next';

const FirstForm = () => {
  const navigation = useNavigation();
  const [locations, setLocations] = useState('');
  const [options, setOptions] = useState([]);
  const { t } = useTranslation();

  const initialLabel = t('select_your_village');


  useEffect(() => {
    fetchVillagesData();
  }, []);

  const fetchVillagesData = async () => {
    try {
      const response = await api.get(`/location`);

      if (response.status === 200) {
        const data = response.data;
        setOptions(data);
        // setIsLoading(false);
      } else {
        console.log('location Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleRegister = () => {
    setLocations('');
    if (locations === '') {
      showToast('error', t('selectyourvillage'), 2500);
    } else {
      navigation.navigate('RegisterForm', { locations_id: locations });
    }
  };

  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={styles.container}>
      <ScrollView>
        <View style={{ margin: 10 }}>
          <View style={styles.inputContainer}>
            <Picker
              selectedValue={locations}
              onValueChange={itemValue => setLocations(itemValue)}
              style={styles.input}
              dropdownIconColor="gray"
              mode="dropdown">
              <Picker.Item
                label={initialLabel}
                value=""
                selectedValue
                enabled={true}
              />
              {options.map(option => (
                <Picker.Item
                  key={option._id}
                  label={option.village}
                  value={option._id}
                />
              ))}
            </Picker>
          </View>
          <View>
            <Pressable style={styles.button} onPress={handleRegister}>
              <Text style={styles.btntext}>{t('next')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  inputContainer: {
    height: 55,
    backgroundColor: '#fff',
    elevation: 5,
    // borderWidth: 1,
    // borderColor: 'gray',
    borderRadius: 6,
    marginBottom: 16,
    justifyContent: 'center',
  },

  input: {
    color: 'black',
  },

  button: {
    height: 50,
    backgroundColor: '#00a9ff',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation:5
  },

  btntext: {
    color: 'white',
    fontSize: 20,
    textTransform: 'uppercase',
  },
});

export default FirstForm;
