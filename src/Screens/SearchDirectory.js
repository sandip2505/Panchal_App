import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import LoadingPage from './LoadingPage';

import { IMAGE_URL } from '@env';
import { ActivityIndicator } from 'react-native-paper';
import api from './api';
import { useTranslation, initReactI18next } from 'react-i18next';

const SearchDirectory = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        let response;
        if (searchValue) {
          response = await api.post('/search', { searchValue: searchValue, })
        } else {
          response = await api.get('/user-list');
        }

        if (response.status === 200) {
          setIsLoading(true);
          const data = response.data;
          setUsers(data);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log('user-list Request failed with status:', response.status);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('An error occurred:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchValue]);

  const handleImageClick = (image) => {
    setImage(image)
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleUserSelect = userId => {
    navigation.navigate('FamilyList', { userId: userId });
  };

  const renderUserItem = ({ item }) => (
    <>
      <Pressable onPress={() => handleUserSelect(item._id)}>
        <View style={styles.userItem}>
          <TouchableOpacity onPress={() => handleImageClick(item?.photo)}>
            <View style={styles.userImageContainer}>
              {item?.photo ? (
                <Image
                  source={{ uri: `${IMAGE_URL}/${item?.photo}` }}
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
          </TouchableOpacity>
          <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>

              <Image
                source={{ uri: `${IMAGE_URL}/${image}` }}
                alt="Full Image"
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          </Modal>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>
              {item?.firstname} {item?.middlename} {item?.lastname}
            </Text>
            <View style={styles.mobileContainer}>
              <Text>
                <Ionicons name="call" size={15} color="#555" />
              </Text>
              <Text style={styles.userMobile}>{item?.mobile_number}</Text>
            </View>
          </View>
          <View style={{ flexBasis: '10%' }}>
            <MaterialCommunityIcons
              name="chevron-right"
              size={30}
              color="#555"
            />
          </View>
        </View>
      </Pressable>
    </>
  );

  return (
    <ImageBackground source={require('../assets/bg3.jpg')}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            value={searchValue}
            placeholder={t('searchhere')}
            placeholderTextColor="gray"
            style={styles.searchInput}
            onChangeText={setSearchValue}
          />
          <View style={styles.iconcontainer}>
            <Ionicons name="search" size={20} style={styles.searchicon} />
          </View>
        </View>
        {isLoading ? (
          <LoadingPage />
        ) : users.searchData ? (
          <FlatList
            data={users.searchData}
            renderItem={renderUserItem}
            keyExtractor={(item, index) => item._id + index.toString()}
            contentContainerStyle={styles.userList}
          />
        ) : users && users.length ? (
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item, index) => item._id + index.toString()}
            contentContainerStyle={styles.userList}
          />
        ) : (
          <View style={styles.blankcontainer}>
            <Image
              source={require('../assets/EmptySearch.png')}
              alt="Empty"
              style={styles.EmptySearchImage}
            />
            <Text style={styles.blank}>{t('nosearchdatafound')}</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: '#dae4f0',
    height: '100%',
    width: '100%',
  },

  searchContainer: {
    display: 'flex',
    flexDirection: 'row',
    margin: '6%',
    elevation: 5,
    backgroundColor: "#fff",
    paddingHorizontal: 3,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  searchInput: {
    flex: 1,
    color: '#000',
    height: 45,
  },

  iconcontainer: {
    width: 40,
    height: 40,
    backgroundColor: '#00a9ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },

  searchicon: {
    color: '#fff',
  },

  userList: {
    paddingHorizontal: '4%',
    paddingBottom: 30,
  },

  userImageContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 7,
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
    backgroundColor: '#fff',
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

  mobileContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  userMobile: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 5,
  },

  blankcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  blank: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    width: '90%',
  },

  blankcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  EmptySearchImage: {
    height: 150,
    width: 150,
  },

  blank: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    width: '90%',
    paddingTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullImage: {
    width: '80%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullImage: {
    width: '80%',
    height: '80%',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SearchDirectory;
