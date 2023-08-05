import 'react-native-gesture-handler';

import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  Text,
  Image,
  View,
  Linking,
  StyleSheet,
  Modal,
  Button,
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
import CommitteeMembers from './src/Screens/CommitteeMembers';
import TermsAndCondition from './src/Screens/TermsAndCondition';
import RegisterForm from './src/Screens/RegisterForm';
import FirstForm from './src/Screens/FirstForm';
// import ChildRegisterForm from './src/Screens/ChildRegisterForm';
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
import Job from './src/Screens/Job';
import News from './src/Screens/News';
import PragatiNews from './src/Screens/PragatiNews';

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
        options={{title: 'Contact Us'}}
      />

      <Stack.Screen
        name="committeeMembers"
        component={CommitteeMembers}
        options={{title: 'Committee Members'}}
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
      <Stack.Screen
        name="EditMainDetails"
        component={EditMainDetails}
        options={{title: 'Edit Details'}}
      />
      <Stack.Screen
        name="EditFamilyDetails"
        component={EditFamilyDetails}
        options={{title: 'Edit Family Details'}}
      />

      <Stack.Screen name="job" component={Job} options={{title: 'Job'}} />

      <Stack.Screen name="News" component={News} options={{title: 'News'}} />

      <Stack.Screen
        name="PragatiNews"
        component={PragatiNews}
        options={{title: 'Pragati News'}}
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
    error: ({text1, text2, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderLeftColor: 'red', width: '90%', top: '5%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
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
    success: ({text1, text2, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderLeftColor: 'green', width: '90%', top: '5%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
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
    info: ({text1, text2, ...rest}) => (
      <BaseToast
        {...rest}
        style={{borderLeftColor: '#0000ff', width: '90%', top: '5%'}}
        contentContainerStyle={{paddingHorizontal: 15}}
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
            drawerStyle: {width: '75%', paddingTop: 20},
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
                    Home
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
          <View
            style={{
              flex: 1,
              justifyContent: 'center',

              padding: 20,
              gap: 10,
            }}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('./src/assets/panchal.png')}
                style={{height: 100, width: 100}}
              />
            </View>

            <View
              style={{justifyContent: 'center', alignItems: 'flex-start', gap: 10}}>
              <Text style={{color: 'black'}}>
                શ્રી સવાસો ગોળ પંચાલ સમાજ, અમદાવાદમાં આપનું સ્વાગત છે
              </Text>

              <Text style={{color: 'red', fontSize : 18, fontWeight: "bold"}}>
                એપ્લિકેશન નો ઉપયોગ કેવી રીતે કરવો ?
              </Text>

              <Text style={{color: 'black'}}>
                સ્ટેપ 1 : ઘર ના મુખ્ય વ્યક્તિ નું રજીસ્ટ્રેશન કરો.
              </Text>

              <Text style={{color: 'black'}}>સ્ટેપ 2 : પેમેન્ટ પૂર્ણ કરો.</Text>

              <Text style={{color: 'black'}}>
                સ્ટેપ 3: ઉપર ડાબી બાજુએ ત્રણ લાઈન ઉપર ક્લિક કરો > લૉગિન ઉપર
                ક્લિક કરો .
              </Text>

              <Text style={{color: 'black'}}>
                સ્ટેપ 4 : તમારો નંબર અને પાસવર્ડ નાખીને લૉગિન કરો .
              </Text>

              <Text style={{color: 'black'}}>
                લૉગિન કર્યા પછી તમારા પરિવારનું રજીસ્ટ્રેશન કરો .
              </Text>

              <Text style={{color: 'black'}}>
                તમે અન્ય ફંકશનો નો પણ ઉપયોગ કરી શકશો .
              </Text>

              <Text style={{color: 'black'}}>આભાર. 🙏</Text>
            </View>

            <Button title="આગળ વધો. " onPress={handleInstructionsDismiss} />
          </View>
        </Modal>
      )}
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
