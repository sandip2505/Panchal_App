import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LoadingPage from './LoadingPage';
import { useTranslation, initReactI18next } from 'react-i18next';

import { IMAGE_URL} from '@env';
import api from './api';

const Directory = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/location');
      setOptions(response.data);
    
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let response;
        if (searchValue) {
          response = await api.post('/villagebyuser',{searchValue: searchValue});
        } else {
          response = await api.get('/user-list');

        }

        if (response.status === 200) {
          setIsLoading(true);
          const data = response.data;
          setUsers(data);
          setIsLoading(false);
        } else {
          console.log('user-list Request failed with status:', response.status);
          setIsLoading(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchValue]);

  const handleUserSelect = userId => {
    navigation.navigate('FamilyList', {userId: userId});
  };

  const renderUserItem = ({item}) => (
    <>
      <Pressable onPress={() => handleUserSelect(item._id)}>
        <View style={styles.userItem}>
          <View style={styles.userImageContainer}>
            {item?.photo ? (
              <Image
                source={{uri: `${IMAGE_URL}/${item?.photo}`}}
                alt="Profile"
                style={styles.userImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                style={styles.userImage}
                source={require('../assets/3135715.png')}
                alt="profile"
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.userInfoContainer}>
            <Text
              style={
                styles.userName
              }>{`${item.firstname} ${item.middlename} ${item.lastname}`}</Text>
            <Text style={styles.userMobile}>
              <Text style={{fontWeight: 'bold'}}>Mo.</Text> {item.mobile_number}
            </Text>
          </View>
          <View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={30}
              color="#666"
            />
          </View>
        </View>
      </Pressable>
    </>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={searchValue}
          onValueChange={itemValue => setSearchValue(itemValue)}
          style={styles.input}
          dropdownIconColor="gray"
          mode="dropdown">
          <Picker.Item label={t('allvillages')} value="" />

          {options.map(option => (
            <Picker.Item
              key={option._id}
              label={option.village}
              value={option._id}
            />
          ))}
        </Picker>
      </View>
      {isLoading ? (
       <LoadingPage />
      ) : users && users.length ? (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.userList}
        />
      ) : (
        <View style={styles.blankcontainer}>
          <Text style={styles.blank}>{t('nosearchdatafound')}</Text>
        </View>
      )}
    </View>
  );
};

export default Directory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
  },

  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 6,
    color: 'black',
    paddingHorizontal: 18,
  },

  inputContainer: {
    height: 55,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    marginBottom: 16,
    justifyContent: 'center',
    marginVertical: 20,
    marginHorizontal: 15,
  },

  userList: {
    paddingHorizontal: '4%',
    paddingBottom: 30,
  },

  userImageContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    overflow: 'hidden',
    marginRight: 10,
  },

  userImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },

  userInfoContainer: {
    flex: 1,
  },

  userItem: {
    backgroundColor: '#edf9ff',
    padding: 8,
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    shadowColor: 'black',
    elevation: 5,
  },

  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },

  userMobile: {
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
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
});
