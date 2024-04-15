import React, { useState, useContext, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Button,
    TouchableOpacity,
    ImageBackground,
    Linking,
    Pressable,
    ScrollView,
} from 'react-native';
import api from '../context/api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToast } from '../component/CustomToast';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import EvilIcons from 'react-native-vector-icons/dist/EvilIcons';
import { useTranslation, initReactI18next } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen({ route }) {
    const { userId } = route.params;
    const [crmpassword, setCrmpassword] = useState('');
    const [password, setPassword] = useState('');
    const [fcmtoken, setFcmtoken] = useState('');
    const [sendOtp, setSendOtp] = useState(false);
    const navigation = useNavigation();

    const [isVisible, setIsVisible] = useState(false);
    const navigate = useNavigation();
    const [mobileError, setMobileError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { t } = useTranslation();

    console.log(userId, 'userId')

    useEffect(() => {
        GetFCMToken();
    })
    const GetFCMToken = async () => {
        try {
            let fcmtoken = await AsyncStorage.getItem("fcmtoken");
            setFcmtoken(fcmtoken)

            if (!fcmtoken) {
                const femtoken = await messaging().getToken();
                if (femtoken) {
                    console.log(femtoken, "new token");
                    setFcmtoken(fcmtoken)
                    await AsyncStorage.setItem("fcmtoken", femtoken);
                }
            }
        } catch (error) {
            console.log(error, "error in GetFCMToken");
        }
    };

    const handleUpdatePassword = async () => {

        console.log(password, 'password')
        console.log(crmpassword, 'crmpassword');

        if (password === '' || crmpassword === '') {
            showToast(
                'error',
                'Password cannot be Empty'
            );
        } else if (password !== crmpassword) {
            showToast(
                'error',
                'Password did not match'
            );
        } else if (password === crmpassword) {
            try {
                const response = await api.post(`/forgetpassword/${userId}`, {
                    password: password,
                    cfmPassword: crmpassword
                });
                console.log(response.data, 'response of handleUpdatePassword');
                if (response.data.status === true) {
                    console.log('Gotcha');
                    showToast(
                        'success',
                        'Password Updated Successfully'
                    );
                    setTimeout(() => {
                        navigation.navigate('LoginScreen')
                    }, 2000);
                } else {
                    showToast(
                        'error',
                        'Something went wrong'
                    );
                }
            }
            catch (error) {
                console.log(error, 'error of handleUpdatePassword');
            }
        }
    }
    return (
        <ImageBackground source={require('../assets/bg3.jpg')} style={{ flex: 1 }}>
            <SafeAreaView>
                <ScrollView keyboardShouldPersistTaps='always'>

                    <View style={styles.container}>
                        <View>
                            <Image
                                source={require('../assets/login.png')}
                                style={styles.logo}
                                alt="search"
                            />
                        </View>
                        <View style={styles.containerBox}>
                            <View style={styles.textGroup}>
                                <Text style={styles.title}>Enter a new password.</Text>
                                <View>
                                    <TextInput placeholder='Password' placeholderTextColor="grey" style={styles.inputText} value={password} onChange={(e) => setPassword(e.nativeEvent.text)} />
                                </View>
                                <View>
                                    <TextInput placeholder='Confirm password' placeholderTextColor="grey" style={styles.inputText} value={crmpassword} onChange={(e) => setCrmpassword(e.nativeEvent.text)} />
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.loginBtn}
                                onPress={handleUpdatePassword}
                                activeOpacity={0.6}>
                                <Text style={styles.loginText}>Change password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
    containerBackground: {
        height: '100%',
        width: '100%',
        display: 'flex',
        gap: 50,
        alignItems: 'center',
        backgroundColor: '#BCE0FD'
    },
    logo: { width: 230, height: 230, marginVertical: 30 },
    containerBox: {
        width: 350,
        height: 320,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: 5,
        margin: 15,
        elevation: 5
    },
    textGroup: { width: '90%', display: 'flex', gap: 10 },
    title: { color: '#000', fontSize: 16, marginTop: 20, marginBottom: 20, fontWeight: '500', alignSelf: 'center' },
    inputText: {
        backgroundColor: '#fcfcfc',
        width: "100%",
        borderRadius: 30,
        paddingLeft: 15,
        color: '#000',
        elevation: 5
    },
    loginText: {
        color: '#f9f9f9',
        fontSize: 20,
        fontWeight: '700',
    },
    loginBtn: {
        height: 50,
        width: "90%",
        backgroundColor: '#036bfc',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '10%',
        shadowColor: 'black',
        elevation: 5,
    },
    error: {
        color: '#ff0000',
        fontSize: 10,
        position: 'absolute',
        bottom: -13,
        right: 10
    },
});
