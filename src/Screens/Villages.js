import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native';
import api from './api';

import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import LoadingPage from './LoadingPage';
import MaintenanceScreen from './MaintenanceScreen';
import { useTranslation, initReactI18next } from 'react-i18next';

const Villages = ({ navigation }) => {

  const [isLoading, setIsLoading] = useState(false);
  const [villagesData, setVillagesData] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchVillagesData();
  }, []);

  
  const fetchVillagesData = async () => {
    try {
      setIsLoading(true);
      api.get('/location')
      .then((response) => {
        if (response.status === 200) {
          setIsLoading(true);
          const data = response.data;
          setVillagesData(data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log('location Request failed with status:', response.status);
         
        }
        setIsLoading(false);
      })
      .catch((error) => {
        // Handle error
        console.error(error,'Handle error');
      });

    } catch (error) {
      setIsLoading(false);
      console.error('An error occurred in location:', error);
    }
  };
  const renderItem = data => {
    return (
      <View key={data.index}>
        <View style={styles.box}>
          <Fontisto name="holiday-village" color="#333" size={17} />
          <Text style={styles.boxText}>{data.item.village}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <LoadingPage />
      ) : villagesData && villagesData.length ? (
        <View style={{ width: '100%' }}>
          <FlatList
            data={villagesData}
            renderItem={renderItem}
            contentContainerStyle={styles.villageList}
          />
        </View>
      ) : (
        <View style={styles.blankcontainer}>
          <Text style={styles.blank}>{t('nosearchdatafound')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#dae4f0',
    width: '100%',
  },

  box: {
    backgroundColor: '#edf9ff',
    padding: 8,
    marginVertical: 5,
    borderRadius: 6,
    shadowColor: 'black',
    elevation: 5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },

  boxText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    paddingVertical: 7,
  },

  villageList: {
    paddingHorizontal: '4%',
    paddingVertical: 10,
  },

  pincode: {
    fontSize: 14,
    color: '#666',
  },

  blankcontainer: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },

  blank: {
    color: 'black',
    textAlign: 'center',
    fontSize: 25,
    fontWeight: '500',
    width: '90%',
    textTransform: 'capitalize',
  },
});

export default Villages;
