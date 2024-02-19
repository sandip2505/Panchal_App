import React, { useState, useEffect } from 'react';
import { Pressable } from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../component/CustomToast';
import api from './api';
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
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.inputContainer}>
          <Picker
            style={styles.input}
            selectedValue={locations}
            onValueChange={itemValue => setLocations(itemValue)}
            dropdownIconColor="gray"
            mode="dropdown">
            <Picker.Item
              label={initialLabel}
              value=""
              selectedValue
              enabled={false}
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  inputContainer: {
    height: 55,
    borderWidth: 1,
    borderColor: 'gray',
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
  },

  btntext: {
    color: 'white',
    fontSize: 20,
    textTransform: 'uppercase',
  },
});

export default FirstForm;
