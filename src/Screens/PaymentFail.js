import { StyleSheet, Text, View, Pressable, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { showToast } from "../component/CustomToast";
import { useTranslation, initReactI18next } from 'react-i18next';

const PaymentFail = ({ navigation }) => {
    const [typedText, setTypedText] = useState('');
    const { t } = useTranslation();

    useEffect(() => {
        const text = t('paymentFailed');
        let currentIndex = 0;

        const timer = setInterval(() => {
            setTypedText(text.substring(0, currentIndex));
            currentIndex++;

            if (currentIndex > text.length) {
                clearInterval(timer);
            }
        }, 100);

        return () => clearInterval(timer);
    }, []);


    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         navigation.navigate('HomePage');
    //         showToast(
    //             'error',
    //             t('registrationfailed'),
    //             2500,
    //         );
    //     }, 3000);

    //     return () => clearTimeout(timer);
    // }, [navigation]);

    const gotoRegister = () => {
        navigation.navigate('FirstForm');
      };
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.circle}>
                    <Image style={styles.boxImage} source={require("../assets/payfail.png")} alt="Fail" />
                </View>
                <Text style={styles.thanks}>{typedText}</Text>
                <Text style={styles.payment}>{t('pleaseTryAgain')}</Text>
                <Pressable style={styles.button} onPress={gotoRegister}><Text style={styles.btntext}>{t('gotoregister')}</Text></Pressable>
            </View>
        </View>
    );
};

export default PaymentFail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: '#dae4f0'
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 40,
        width: 290,
        backgroundColor: '#18bd5b',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
    },
    btntext: {
        color: 'white',
        fontSize: 20,
        textTransform: "capitalize",
    },
    thanks: {
        color: 'red',
        fontSize: 50,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    payment: {
        color: 'black',
        fontSize: 20,
        textAlign: 'center',
    },
    circle: {
        width: 200,
        height: 200,
        borderRadius: 30,
        overflow: 'hidden',
        marginBottom: 8,
        alignItems: 'center',
        justifyContent: 'center',
        // marginLeft:50
    },
    boxImage: {
        width: 200,
        height: 200,
        resizeMode: 'cover',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
