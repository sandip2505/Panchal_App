import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, ImageBackground } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { showToast } from '../component/CustomToast';
import { useTranslation } from 'react-i18next';
import i18n from '../context/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = () => {
  const [language, setLanguage] = useState('');
  const { t } = useTranslation();
  const initialLabel = t('changeLanguage');
  const successMessages = t('successchangeLanguage');

  const changeLanguage = async (selectedLanguage) => {
    setLanguage(selectedLanguage);
    showToast('success', `${successMessages}`, 2500);
    await AsyncStorage.setItem('selectedLanguage', selectedLanguage);
    i18n.changeLanguage(selectedLanguage).catch((error) => {
      console.error('Error changing language:', error);
    });

  };

  useEffect(() => {
    const getSelectedLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
        if (storedLanguage) {
          await i18n.changeLanguage(storedLanguage)
          setLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error retrieving language:', error);
      }
    };

    getSelectedLanguage();
  }, []);

  return (
    <ImageBackground style={styles.container} source={require('../assets/bg3.jpg')} >
      <ScrollView>
        <Text style={styles.heading}>{t('changeLanguage')}</Text>
        <View style={styles.inputContainer}>
          <Picker
            style={styles.input}
            selectedValue={language}
            onValueChange={(itemValue) => setLanguage(itemValue)}
            dropdownIconColor="gray"
            mode="dropdown"

          >
            <Picker.Item label={initialLabel} value="" enabled={false} />
            <Picker.Item label="English" value="en" />
            <Picker.Item label="ગુજરાતી" value="gu" />
          </Picker>
        </View>
        <View>
          <Pressable style={styles.button} onPress={() => changeLanguage(language)}>
            <Text style={styles.btntext}>{t('submit')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    // backgroundColor: '#dae4f0',
  },
  inputContainer: {
    height: 55,
    // borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 6,
    elevation: 5,
    marginBottom: 16,
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  input: {
    color: 'black',
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 3,
  },
  button: {
    height: 50,
    backgroundColor: '#00a9ff',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 15,
    justifyContent: 'center',
  },
  btntext: {
    color: 'white',
    fontSize: 20,
  },
});

export default SettingsScreen;
