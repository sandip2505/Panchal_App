import 'react-native-gesture-handler';

import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  View,
  Linking,
  StyleSheet,
} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

import Toast, {BaseToast} from 'react-native-toast-message';

import NetInfo from '@react-native-community/netinfo';

// Import Custom Sidebar
import CustomSidebarMenu from './CustomSidebarMenu';
import HomePage from './src/Screens/HomePage';
import AboutUs from './src/Screens/AboutUs';
import ContactUs from './src/Screens/ContactUs';
import TermsAndCondition from './src/Screens/TermsAndCondition';
import RegisterForm from './src/Screens/RegisterForm';
import FirstForm from './src/Screens/FirstForm';
import ChildRegisterForm from './src/Screens/ChildRegisterForm';
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

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function FirstScreenStack({navigation}) {
  return (
    <Stack.Navigator
      initialRouteName="HomePage"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 25,
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
          title: 'Panchal Samaj',
          headerShown: true,
          headerTintColor: '#000',
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 25,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Image
                source={require('./src/assets/menubar.png')}
                alt="menu"
                style={{
                  height: 28,
                  width: 30,
                  marginRight: 25,
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
        options={{title: 'About us'}}
      />
      <Stack.Screen
        name="RegisterForm"
        component={RegisterForm}
        options={{title: 'Register'}}
      />
      <Stack.Screen
        name="FirstForm"
        component={FirstForm}
        options={{title: 'Register'}}
      />
      <Stack.Screen
        name="ChildRegisterForm"
        component={ChildRegisterForm}
        options={{title: 'Register'}}
      />
      <Stack.Screen
        name="Villages"
        component={Villages}
        options={{title: 'Villages'}}
      />
      <Stack.Screen
        name="PaymentPage"
        component={PaymentPage}
        options={{title: 'Payment'}}
      />
      <Stack.Screen
        name="Directory"
        component={Directory}
        options={{title: 'Directory'}}
      />
      <Stack.Screen
        name="FamilyList"
        component={FamilyList}
        options={{title: 'Directory'}}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccess}
        options={{title: 'Payment'}}
      />
      <Stack.Screen
        name="PaymentFail"
        component={PaymentFail}
        options={{title: 'Payment'}}
      />
      <Stack.Screen
        name="FamilyDetailsPage"
        component={FamilyDetailsPage}
        options={{title: 'Family Members'}}
      />
      <Stack.Screen
        name="SearchDirectory"
        component={SearchDirectory}
        options={{title: 'Search'}}
      />
      <Stack.Screen
        name="ProfilePage"
        component={ProfilePage}
        options={{title: 'Profile'}}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{title: 'Contact us'}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{title: 'Login'}}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{title: 'Change Password'}}
      />
      <Stack.Screen
        name="FamilyRegister"
        component={FamilyRegister}
        options={{title: 'Family Register'}}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(true);

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
    error: ({text1, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderLeftColor: 'red', width: '90%', top: '5%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 18,
          fontWeight: 'semibold',
          color: 'red',
        }}
        text1={text1}
      />
    ),
    success: ({text1, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderLeftColor: 'green', width: '90%', top: '5%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 18,
          fontWeight: 'semibold',
          color: 'green',
        }}
        text1={text1}
      />
    ),
    info: ({text1, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderLeftColor: '#0000ff', width: '90%', top: '5%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 18,
          fontWeight: 'semibold',
          color: '#444',
        }}
        text1={text1}
      />
    ),
  };

  return (
    <NavigationContainer>
      {isConnected ? (
        <Drawer.Navigator
          screenOptions={{
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerTitleStyle: {fontSize: 25},
            headerStyle: {backgroundColor: '#00a9ff'},
            drawerLabelStyle: {fontSize: 18},
          }}
          drawerContent={props => <CustomSidebarMenu {...props} />}>
          <Drawer.Screen
            name="Home"
            component={FirstScreenStack}
            options={{
              headerShown: false,
              title: 'Login',
              drawerLabel: ({focused, color}) => (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <MaterialCommunityIcons
                    name="home"
                    color={focused ? color : '#666'}
                    size={30}
                  />
                  <Text
                    style={{
                      marginLeft: 20,
                      fontSize: 19,
                      fontWeight: '500',
                      color: focused ? color : '#666',
                    }}>
                    Home
                  </Text>
                </View>
              ),
            }}
          />
        </Drawer.Navigator>
      ) : (
        <CheckConnection />
        // <View style={styles.noInternetContainer}>
        //   <Text style={styles.noInternetText}>No Internet Connection</Text>
        // </View>
      )}
      <Toast config={toastConfig} />
    </NavigationContainer>
  );
}

export default App;

const styles = StyleSheet.create({
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  noInternetText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
});
