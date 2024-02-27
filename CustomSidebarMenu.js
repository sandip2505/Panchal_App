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
  Share,
} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation, initReactI18next } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import CustomModal from './src/component/CustomModal';
import { showToast } from './src/component/CustomToast';
import { Picker } from '@react-native-picker/picker';


const CustomSidebarMenu = props => {
  const navigation = useNavigation();
  const [parentsData, setParentsData] = useState(null);
  const [isTestData, setIsTestData] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();

  const keyUpdate = () => {
    AsyncStorage.getItem('isTest', function (err, value) {
      setIsTestData(JSON.parse(value));
    });
  };
  const appUrl = 'https://play.google.com/store/apps/details?id=com.panchal_application&pcampaignid=web_share';
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this awesome app: ${appUrl}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Shared with activity type of result.activityType
        } else {
          // Shared
        }
      } else if (result.action === Share.dismissedAction) {
        // Dismissed
      }
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
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
    showToast(
      'success',
      'Logout successfully.',
      'લોગઆઉટ સફળતાપૂર્વક થઈ ગયુ.',
      2000,
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', width: '100%' }}>
      <Image
        source={require('./src/assets/panchal.png')}
        alt="panchalImage"
        style={styles.sideMenuProfileIcon}
      />

      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />

        {isTestData ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('ProfilePage')}
            style={styles.customDrawerItem}>
            <View
              style={{
                flexBasis: '15%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <FontAwesome name="user-circle-o" color="#666" size={30} />
            </View>
            <Text style={styles.customDrawerItemText}>{t('profile')}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.customDrawerItem}>
            <View
              style={{
                flexBasis: '15%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialCommunityIcons name="login" color="#666" size={30} />
            </View>
            <Text style={styles.customDrawerItemText}>{t('login')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('committeeMembers')}
          style={styles.customDrawerItem}>
          <View
            style={{
              flexBasis: '15%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <FontAwesome name="users" color="#666" size={28} />
          </View>
          <Text style={styles.customDrawerItemText}>{t('committeeMember')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('ContactUs')}
          style={styles.customDrawerItem}>
          <View
            style={{
              flexBasis: '15%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons name="email" color="#666" size={30} />
          </View>
          <Text style={styles.customDrawerItemText}>{t('contactUs')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SettingsScreen')}
          style={styles.customDrawerItem}>
          <View
            style={{
              flexBasis: '15%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/* name="cog" size={30} color="black" */}
            <MaterialCommunityIcons name="cog" color="#666" size={30} />
          </View>
          <Text style={styles.customDrawerItemText}>{t('settings')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleShare}
          style={styles.customDrawerItem}>
          <View
            style={{
              flexBasis: '15%',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <MaterialCommunityIcons name="share-variant" color="#666" size={30} />
          </View>
          <Text style={styles.customDrawerItemText}>{t('shereapp')}</Text>
        </TouchableOpacity>


        {isTestData && (
          <TouchableOpacity
            onPress={() => setShowModal(true)}
            style={styles.customDrawerItem}>
            <View
              style={{
                flexBasis: '15%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <MaterialCommunityIcons name="logout" size={30} color="#666" />
            </View>
            <Text style={styles.customDrawerItemText}>{t('logout')}</Text>
          </TouchableOpacity>
        )}
      </DrawerContentScrollView>

      <Text
        onPress={() => Linking.openURL('https://codecrewinfotech.com')}
        style={styles.developer}>
        www.codecrewinfotech.com
      </Text>

      {showModal && (
        <CustomModal
          showModal={showModal}
          setShowModal={setShowModal}
          onConfirm={removeData}
          Title={t('confirm')}
          Message={t('confirmlogout')}
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

  developer: {
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
    paddingBottom: 10,
    opacity: 0.6,
  },
});

export default CustomSidebarMenu;
