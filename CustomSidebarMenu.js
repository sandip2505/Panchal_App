import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  Text,
  Linking,
  TouchableOpacity,
  Modal,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import CustomModal from './src/component/CustomModal';
import Toast from 'react-native-toast-message';
import { showToast } from './src/component/CustomToast';


const CustomSidebarMenu = props => {
  const navigation = useNavigation();
  const [parentsData, setParentsData] = useState(null);
  const [isTestData, setIsTestData] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const keyUpdate = () => {
    AsyncStorage.getItem('isTest', function (err, value) {
      setIsTestData(JSON.parse(value));
    });
  };

  useEffect(() => {
    keyUpdate();
  }, [keyUpdate, removeData]);

  const removeData = () => {
    AsyncStorage.removeItem('userData');
    AsyncStorage.removeItem('childData');
    AsyncStorage.removeItem('PerentsData');
    AsyncStorage.removeItem('villageData');
    AsyncStorage.setItem('isTest', JSON.stringify(false));
    navigation.navigate('HomePage');
    showToast('success', 'Logout successfully.', 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Image
        source={require('./src/assets/panchal.png')}
        alt='panchalImage'
        style={styles.sideMenuProfileIcon}
      />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        {isTestData ? (
          <>
            <TouchableOpacity
              onPress={() => navigation.navigate('ProfilePage')}
              style={styles.customDrawerItem}>
              <FontAwesome
                name="user"
                color="#666"
                size={30}
                style={{
                  marginLeft: 4,
                  marginRight: 4,
                }}
              />
              <Text style={styles.customDrawerItemText}>Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={removeData}
              onPress={() => setShowModal(true)}
              style={styles.customDrawerItem}>
              <MaterialCommunityIcons name="logout" size={30} color="#666" />
              <Text style={styles.customDrawerItemText}>Logout</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.customDrawerItem}>
            <MaterialCommunityIcons name="login" color="#666" size={30} />
            <Text style={styles.customDrawerItemText}>Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('ContactUs')}
          style={styles.customDrawerItem}>
          <MaterialCommunityIcons name="email" color="#666" size={30} />
          <Text style={styles.customDrawerItemText}>Contact us</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      <Text
        onPress={() => Linking.openURL('https://codecrewinfotech.com')}
        style={{
          fontSize: 16,
          textAlign: 'center',
          color: 'black',
          paddingBottom: 10,
        }}>
        www.codecrewinfotech.com
      </Text>

      {showModal && (
        <CustomModal
          showModal={showModal}
          setShowModal={setShowModal}
          onConfirm={removeData}
          Title={`Confirm Logout ?`}
          Message={`Are you sure you want to logout ?`}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'center',
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginVertical: 20,
  },

  customDrawerItem: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },

  customDrawerItemText: {
    marginLeft: 20,
    fontSize: 19,
    fontWeight: '500',
    color: '#666',
  },
});

export default CustomSidebarMenu;
