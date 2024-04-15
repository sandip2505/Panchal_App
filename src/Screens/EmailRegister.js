import React, { useEffect, useState } from 'react';
import {
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import api from '../context/api';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { showToast } from '../component/CustomToast';

export default function LoginScreen({ navigation, routes }) {

    const [emailError, setemailError] = useState('');
    const { t } = useTranslation();
    const [userId, setuserId] = useState('')

    const [email, setemail] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const value = await AsyncStorage.getItem('userData');
                const userData = JSON.parse(value);
                setuserId(userData._id);
                // console.log(userData._id, 'This is userData');
            } catch (error) {
                console.log('Error retrieving user id from useEffect', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async () => {
        console.log('email', email);
        if (email.length === '') {
            setemailError(t('Email is required'));
        } else {
            setemailError('');
            try {
                const response = await api.post(`/update-email/${userId}`, {
                    email: email,
                });
                if (response.data.status === true) {
                    console.log('email sent successfully');
                    setemail('')
                    showToast(
                        'success',
                        t('Email sent successfully'),
                        2000,
                    );
                    setTimeout(() => {
                        navigation.navigate('HomePage');
                    }, 2000);
                } else {
                    showToast(
                        'error',
                        t('Please Enter Valid Email'),
                        2000,
                    );
                }

                // console.log(response.data, 'this is response.data in email');
            } catch (error) {
                console.log('error of handlesubmit in email ', error);
            }
        }
        // else {
        //     try {
        //         const response = await api.post(`/userlogin`, {
        //             email: email,

        //         });


        //         if (response.data.emailError == 'Invalid mobile number') {
        //             setemailError(t('invalidmobilenumber'));
        //         } else if (response.data.passwordError == 'Incorrect Password') {
        //             setemailError('');
        //             setPasswordError(t('incorrectPassword'));
        //         } else {
        //             showToast(
        //                 'error',
        //                 t('Please Enter Valid Email'),
        //                 2000,
        //             );
        //             // navigation.navigate('HomePage');
        //         }
        //     } catch (error) {
        //         console.log('error', error);
        //         AsyncStorage.setItem('isTest', JSON.stringify(false));
        //     }
        // }
    };


    return (
        <ImageBackground source={require('../assets/bg3.jpg')} style={{ flex: 1 }} resizeMode="cover">
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
                            <Text style={styles.title}>{t('Enter Your Email')}</Text>
                            <View style={styles.inputGroup}>
                                <View style={styles.inputView}>
                                    <TextInput placeholder={t('Email')} value={email} onChangeText={(e) => setemail(e)} placeholderTextColor="gray" keyboardType="email-address" style={[styles.inputText, { shadowColor: emailError ? 'red' : 'black' }]} />
                                    {emailError && <Text style={styles.error}>{emailError}</Text>}
                                </View>
                            </View>
                            <TouchableOpacity
                                style={styles.loginBtn}
                                onPress={handleSubmit}
                                activeOpacity={0.6}>
                                <Text style={styles.loginText}>{t('submit')}</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    logo: {
        width: 230,
        height: 230,
        marginVertical: 30
    },
    containerBox: {
        width: 350,
        height: 220,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: 5,
        elevation: 7,
        shadowColor: 'black',
        margin: 15
    },
    title: {
        color: '#000',
        fontSize: 16,
        marginTop: 20,
        fontWeight: '500',
        alignSelf: 'center'
    },
    inputGroup: {
        width: '90%',
        marginTop: 20,
        display: 'flex',
        gap: 10
    },
    inputText: {
        backgroundColor: '#fff',
        width: "100%",
        borderRadius: 30,
        paddingLeft: 15,
        color: '#000',
        elevation: 5,
    },
    loginText: {
        color: '#f9f9f9',
        fontSize: 20,
        textTransform: 'capitalize',
        fontWeight: '700',
    },
    loginBtn: {
        height: 50,
        width: "90%",
        backgroundColor: '#036bfc',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: '8%',
        shadowColor: 'black',
        elevation: 5,
    },
    passwordBtn: {
        position: 'absolute',
        right: '4%',
        top: '25%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputView: {
        position: 'relative',
    },
    forgotParent: {
        marginTop: 10,
        marginEnd: 25,
        alignSelf: 'flex-end'
    },
    forgotText: {
        color: '#000',
        textAlign: 'right',
        fontWeight: '500',
    },
    error: {
        color: '#ff0000',
        fontSize: 13,
        textAlign: 'right',
        paddingRight: 10,
        paddingTop: 2
    },
});
