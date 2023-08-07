import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {FlatList} from 'react-native';
import {API_BASE_URL, API_KEY} from '@env';
console.log('API_BASE_URL village', API_BASE_URL);

import Fontisto from 'react-native-vector-icons/dist/Fontisto';


const Villages = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [villagesData, setVillagesData] = useState([]);

  useEffect(() => {
    fetchVillagesData();
  }, []);

  const fetchVillagesData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/location`);
      if (response.status === 200) {
        setIsLoading(true);
        const data = response.data;
        setVillagesData(data);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log('Request failed with status:', response.status);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('An error occurred:', error);
    }
  };
  const renderItem = data => {
    return (
      <View key={data.index}>
        <View style={styles.box}>
        <Fontisto name="holiday-village" color="#333" size={17} />
          <Text style={styles.boxText}>
            {data.item.village} {/*  - ( {data.item.pincode} ) */}{' '}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={{marginTop: 10}}>
          <ActivityIndicator size="large" color="#00a9ff" />
        </View>
      ) : villagesData && villagesData.length ? (
        <View style={{width: '100%'}}>
          <FlatList
            data={villagesData}
            renderItem={renderItem}
            contentContainerStyle={styles.villageList}
          />
        </View>
      ) : (
        <View style={styles.blankcontainer}>
          <Text style={styles.blank}>No data found...</Text>
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
    backgroundColor: '#fff',
    width: '100%',
  },

  box: {
    backgroundColor: '#edf9ff',
    padding: 8,
    marginVertical: 5,
    borderRadius: 6,
    shadowColor: 'black',
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 15
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
