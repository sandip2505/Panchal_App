import 'react-native-gesture-handler';

import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  View,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  ScrollView,
  PermissionsAndroid
} from 'react-native';

// import { PermissionsAndroid } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Entypo from 'react-native-vector-icons/dist/Entypo';

import Toast, { BaseToast } from 'react-native-toast-message';

import NetInfo from '@react-native-community/netinfo';

// Import Custom Sidebar
import CustomSidebarMenu from './CustomSidebarMenu';
import HomePage from './src/Screens/HomePage';
import AboutUs from './src/Screens/AboutUs';
import ContactUs from './src/Screens/ContactUs';
import CommitteeMembers from './src/Screens/CommitteeMembers';
import TermsAndCondition from './src/Screens/TermsAndCondition';
import RegisterForm from './src/Screens/RegisterForm';
import FirstForm from './src/Screens/FirstForm';
import Villages from './src/Screens/Villages';
import PaymentPage from './src/Screens/PaymentPage';
import Directory from './src/Screens/Directory';
import FamilyList from './src/Screens/FamilyList';
import PaymentSuccess from './src/Screens/PaymentSuccess';
import PaymentFail from './src/Screens/PaymentFail';
import LoginScreen from './src/Screens/LoginScreen';
import ProfilePage from './src/Screens/ProfilePage';
import FamilyDetailsPage from './src/Screens/FamilyDetailsPage';
import SearchDirectory from './src/Screens/SearchDirectory';
import ChangePassword from './src/Screens/ChangePassword';
import FamilyRegister from './src/Screens/FamilyRegister';
import CheckConnection from './src/component/CheckConnection';
import EditFamilyDetails from './src/Screens/EditFamilyDetails';
import EditMainDetails from './src/Screens/EditMainDetails';
import TestPage from './src/Screens/TestPage';
import MaintenanceScreen from './src/Screens/MaintenanceScreen';
import SettingsScreen from './src/Screens/SettingsScreen';
import NewsPage from './src/Screens/NewsPage';
import NewsDetails from './src/Screens/NewsDetails';
import messaging from '@react-native-firebase/messaging';
import api from './src/Screens/api';
import PushNotification from 'react-native-push-notification';
import { useTranslation, initReactI18next } from 'react-i18next';



const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function FirstScreenStack({ navigation }) {
  const { t } = useTranslation();

  useEffect(() => {
    requestIgnoreBatteryOptimizations();
    GetFCMToken();

    PushNotification.configure({
      onNotification: function (notification) {
        console.log('Notification received:', notification);

        if (notification.userInteraction) {

          const _id = notification.data.newsId || notification.userData.newsId || notification.data._id;
          navigation.navigate('NewsDetails', { item: _id });

          console.log('Notification pressed!', _id);
        }
      },
    });



    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM Message Data:', remoteMessage);
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);

      const newsTitle = remoteMessage.data.title || (remoteMessage.notification && remoteMessage.notification.title);
      const newsDescription = remoteMessage.data.description || (remoteMessage.notification && remoteMessage.notification.body);
      const imageUrl = remoteMessage.data.image || (remoteMessage.notification && remoteMessage.notification.imageUrl);
      const newsId = remoteMessage.data.newsId;
      console.log(newsTitle, newsDescription, imageUrl, newsId, "Before notifyNewsAdded")
      PushNotification.getChannels(function (channel_ids) {
        console.log(channel_ids, "channel_ids");
      });
      notifyNewsAdded(newsTitle, newsDescription, imageUrl, newsId);
    });

    return () => {
      unsubscribe();
    };


  }, []);
  const GetFCMToken = async () => {
    try {
      let fcmtoken = await AsyncStorage.getItem("fcmtoken");
      // console.log(fcmtoken, "old token");
      if (!fcmtoken) {
        const femtoken = await messaging().getToken();
        if (femtoken) {
          // console.log(femtoken, "new token");
          await AsyncStorage.setItem("fcmtoken", femtoken);
        }
      }
    } catch (error) {
      console.log(error, "error in GetFCMToken");
    }
  };

  const requestIgnoreBatteryOptimizations = async () => {
    try {
      // Request necessary permissions
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      console.log(granted, 'granted >>', PermissionsAndroid.RESULTS.GRANTED)
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Notification permission granted');
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    }
  };



  const notifyNewsAdded = (newsTitle, newsDescription, imageUrl, newsId) => {
    console.log(newsTitle, newsDescription, imageUrl, newsId, "notifyNewsAdded")
    PushNotification.localNotification({
      title: newsTitle,
      message: newsDescription,
      largeIcon: imageUrl,
      userData: { newsId, newsTitle, newsDescription, imageUrl },
      invokeApp: true,
      onPress: () => {
        console.log('Notification pressed! on notifyNewsAdded');
        navigation.navigate('NewsDetails', { item: newsId });
      },
    });

    PushNotification.localNotificationSchedule({
      title: 'Notification Sent',
      message: 'News notification sent successfully!',
      date: new Date(Date.now()),
    });

  };

  return (
    <Stack.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 22,
        },
        headerStyle: {
          backgroundColor: '#00a9ff',
        },
      }}>
      <Stack.Screen
        name="HomePage"
        component={HomePage}
        options={{
          drawerLabel: 'Home',
          title: 'શ્રી સવાસો ગોળ પંચાલ સમાજ, અમદાવાદ',
          headerShown: true,
          headerTintColor: '#000',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontSize: 19,
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={require('./src/assets/menubar.png')}
                alt="menu"
                style={{
                  height: 28,
                  width: 30,
                  marginRight: 12,
                  marginLeft: 2,
                }}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{ title: `${t('aboutUs')}` }}
      />
      <Stack.Screen
        name="RegisterForm"
        component={RegisterForm}
        options={{ title: `${t('register')}` }}
      />
      <Stack.Screen
        name="FirstForm"
        component={FirstForm}
        options={{ title: `${t('register')}` }}
      />
      <Stack.Screen
        name="Villages"
        component={Villages}
        options={{ title: `${t('villages')}` }}
      />
      <Stack.Screen
        name="PaymentPage"
        component={PaymentPage}
        options={{ title: `${t('paymentPage')}` }}
      />
      <Stack.Screen
        name="Directory"
        component={Directory}
        options={{ title: `${t('directory')}` }}
      />
      <Stack.Screen
        name="FamilyList"
        component={FamilyList}
        options={{ title: `${t('familyList')}` }}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
        options={{ title: `${t('paymentSuccess')}` }}
      />
      <Stack.Screen
        name="PaymentFail"
        component={PaymentFail}
        options={{ title: `${t('paymentFail')}` }}
      />
      <Stack.Screen
        name="FamilyDetailsPage"
        component={FamilyDetailsPage}
        options={{ title: `${t('familyDetailsPage')}` }}
      />
      <Stack.Screen
        name="SearchDirectory"
        component={SearchDirectory}
        options={{ title: `${t('searchDirectory')}` }}
      />
      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{ title: `${t('profile')}` }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{ title: `${t('contactUs')}` }}
      />


      <Stack.Screen
        name="committeeMembers"
        component={CommitteeMembers}
        options={{ title: `${t('committeeMember')}` }}
      />

      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ title: `${t('login')}` }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ title: `${t('changePassword')}` }}
      />
      <Stack.Screen
        name="FamilyRegister"
        component={FamilyRegister}
        options={{ title: `${t('familyRegister')}` }}
      />
      <Stack.Screen
        name="EditMainDetails"
        component={EditMainDetails}
        options={{ title: `${t('editMainDetails')}` }}
      />
      <Stack.Screen
        name="EditFamilyDetails"
        component={EditFamilyDetails}
        options={{ title: `${t('editFamilyDetails')}` }}
      />
      <Stack.Screen
        name="TestPage"
        component={TestPage}
        options={{ title: 'Its a Testing Page' }}
      />
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{ title: `${t('settings')}` }}
      />
      <Stack.Screen
        name="NewsPage"
        component={NewsPage}
        options={{ title: `${t('news')}` }}
      />
      <Stack.Screen
        name="NewsDetails"
        component={NewsDetails}
        options={{ title: `${t('newsDetails')}` }}
      />
      <Stack.Screen
        name="MaintenanceScreen"
        component={MaintenanceScreen}
        options={{ title: `${t('maintenanceScreen')}` }}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toastConfig = {
    error: ({ text1, text2, ...rest }) => (
      <BaseToast
        {...rest}
        style={{ borderLeftColor: 'red', width: '90%', top: '5%' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 19,
          fontWeight: 'semibold',
          color: 'red',
        }}
        text2Style={{
          fontSize: 16,
          color: 'red',
          opacity: 0.7,
        }}
        text1={text1}
        text2={text2}
      />
    ),
    success: ({ text1, text2, ...rest }) => (
      <BaseToast
        {...rest}
        style={{ borderLeftColor: 'green', width: '90%', top: '5%' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 18,
          fontWeight: 'semibold',
          color: 'green',
        }}
        text2Style={{
          fontSize: 16,
          color: 'green',
          opacity: 0.7,
        }}
        text1={text1}
        text2={text2}
      />
    ),
    info: ({ text1, text2, ...rest }) => (
      <BaseToast
        {...rest}
        style={{ borderLeftColor: '#0000ff', width: '90%', top: '5%' }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 18,
          fontWeight: 'semibold',
          color: '#444',
        }}
        text2Style={{
          fontSize: 16,
          color: '#444',
          opacity: 0.7,
        }}
        text1={text1}
        text2={text2}
      />
    ),
  };

  //////////////////////////////////////////////////////////////////////////////////////////

  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    checkAppLaunch();
  }, []);

  const checkAppLaunch = async () => {
    try {
      const value = await AsyncStorage.getItem('@app_launched');
      if (value === null) {
        setShowInstructions(true);
      }
    } catch (error) {
      // Error handling if AsyncStorage fails
    }
  };

  const handleInstructionsDismiss = async () => {
    try {
      await AsyncStorage.setItem('@app_launched', 'true');
      setShowInstructions(false);
    } catch (error) {
      // Error handling if AsyncStorage fails
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////

  return (
    <NavigationContainer>
      {isConnected ? (
        <Drawer.Navigator
          screenOptions={{
            drawerStyle: { width: '75%', paddingTop: 20 },
          }}
          drawerContent={props => <CustomSidebarMenu {...props} />}>
          <Drawer.Screen
            name="Home"
            component={FirstScreenStack}
            options={{
              headerShown: false,
              title: 'Login',
              drawerLabel: ({ focused, color }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View
                    style={{
                      flexBasis: '15%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingLeft: 8,
                    }}>
                    <MaterialCommunityIcons
                      name="home"
                      color={focused ? color : '#666'}
                      size={30}
                    />
                  </View>
                  <Text
                    style={{
                      marginLeft: 23,
                      fontSize: 19,
                      fontWeight: '600',
                      color: focused ? color : '#666',
                      flexBasis: '80%',
                    }}>
                    {t('home')}
                  </Text>
                </View>
              ),
            }}
          />
        </Drawer.Navigator>
      ) : (
        <CheckConnection />
      )}
      <Toast config={toastConfig} />

      {showInstructions && (
        <Modal visible={showInstructions} animationType="slide">
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('./src/assets/panchal.png')}
                  style={{ height: 150, width: 150 }}
                />

                <Text style={[styles.text, { fontWeight: 'bold' }]}>
                  શ્રી સવાસો ગોળ પંચાલ સમાજ, અમદાવાદ
                </Text>
              </View>

              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  એપ્લિકેશન નો ઉપયોગ કેવી રીતે કરવો ?
                </Text>

                <View>
                  <Text style={styles.text}>
                    <Text style={styles.stepText}>સ્ટેપ 1 :</Text> ઘર ના મુખ્ય
                    વ્યક્તિ નું રજીસ્ટ્રેશન કરો.
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.stepText}>સ્ટેપ 1 :</Text> પેમેન્ટ પૂર્ણ
                    કરો.
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.stepText}>સ્ટેપ 3 :</Text> ત્યારબાદ ઉપર
                    ડાબી બાજુએ ત્રણ લાઈન ઉપર ક્લિક કરો પછી લૉગિન ઉપર ક્લિક કરો .
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.stepText}>સ્ટેપ 4 :</Text> તમારો નંબર અને
                    પાસવર્ડ નાખીને લૉગિન કરો .
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.stepText}>સ્ટેપ 5 :</Text> ત્યારબાદ ફરી
                    ત્રણ લાઈન ઉપર ક્લિક કરી ને પ્રોફાઈલ ઉપર ક્લિક કરો.
                  </Text>

                  <Text style={styles.text}>
                    <Text style={styles.stepText}>સ્ટેપ 6 :</Text> ત્યારબાદ નીચે "
                    Family Members " ઉપર ક્લિક કરી ને પરિવાર ના સભ્યો નું
                    રજિસ્ટ્રેશન કરો.
                  </Text>

                  <Text style={styles.text}></Text>

                  <Text style={styles.text}>આભાર. 🙏</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleInstructionsDismiss}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}> આગળ વધો. </Text>
                </View>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </Modal>
      )}
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
    width: '100%',
  },

  imageContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  textContainer: {
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
  },

  title: { color: 'red', fontSize: 18, fontWeight: 'bold' },

  stepText: {
    fontWeight: 'bold',
  },

  text: {
    color: 'black',
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },

  btn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    height: 45,
    marginVertical: 20,
    borderRadius: 10,
  },

  btnText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
