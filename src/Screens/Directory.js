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
import axios from 'axios';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import {API_BASE_URL, IMAGE_URL, API_KEY} from '@env';

const Directory = ({navigation}) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/location`);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setOptions(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error fetching options:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        if (searchValue) {
          response = await axios.post(`${API_BASE_URL}/villagebyuser`, {
            searchValue: searchValue,
          });
        } else {
          response = await axios.get(`${API_BASE_URL}/user-list`);
          // console.log("full", response)
        }

        if (response.status === 200) {
          const data = response.data;
          setUsers(data);
          setIsLoading(false);
        } else {
          console.log('Request failed with status:', response.status);
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    };

    fetchData();
  }, [searchValue]);

  const handleUserSelect = userId => {
    navigation.navigate('FamilyList', {userId: userId});
  };

  const renderUserItem = ({item}) => (
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
          <MaterialCommunityIcons name="chevron-right" size={30} color="#666" />
        </View>
      </View>
    </Pressable>
  );

  const handleSearch = () => {
    console.log('Performing search:', searchValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Picker
          selectedValue={searchValue}
          onValueChange={itemValue => setSearchValue(itemValue)}
          style={styles.input}
          dropdownIconColor="gray"
          mode="dropdown">
          <Picker.Item label="All villages / બધા ગામો" value="" />

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
        <View>
          <ActivityIndicator size="large" color="#00a9ff" />
        </View>
      ) : users && users.length ? (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.userList}
        />
      ) : (
        <View style={styles.blankcontainer}>
          <Text style={styles.blank}>No data found...</Text>
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
    paddingHorizontal: 8,
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
    textTransform: 'capitalize',
  },
});
