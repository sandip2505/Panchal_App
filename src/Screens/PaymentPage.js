import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { showToast } from '../component/CustomToast';
import api from './api';
import { useTranslation, initReactI18next } from 'react-i18next';

const PaymentPage = ({ navigation }) => {

  const [PaymentamoutData, setpaymentamoutData] = useState(null);
  const [amount, setamount] = useState(null);
  const [razorpay_key, setrazorpay_key] = useState(null);
  const [PerentsData, setPerentsData] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (PaymentamoutData !== null) {
      let amount = PaymentamoutData.amountObject.value;
      if (amount !== null) {
        setamount(amount);
      }
    }

    const final = AsyncStorage.getItem('PerentsData')
      .then(value => {
        if (value) {
          const userData = JSON.parse(value);
          setPerentsData(userData);
        } else {
          console.log('No user data found');
        }
      })
      .catch(error => {
        console.log('Error  retrieving user data:', error);
      });

  }, [PaymentamoutData]);

  useEffect(() => {
    paymentamout();

    showToast(
      'info',
      t('dopaymentforsuccessfullregistration'),
      5000,
    );
  }, []);

  const paymentamout = async () => {
    try {
      const response = await api.get(`/listsettings`);

      if (response.status === 200) {
        const data = response.data;
        const amountObject = data.find(item => item.key === 'amount');
        let amountValue = null;
        if (amountObject) {
          amountValue = amountObject.value;
        }

        setpaymentamoutData({ amountObject });
      } else {
        console.log('listsettings Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('this An error occurred:', error);
    }
  };
  const handlePayment = async () => {
    try {
      const response = await api.post(`/order`, {
        headers: {
          Accept: 'application/json',
        },
        firstname: PerentsData && PerentsData?.firstname,
        personal_id: PerentsData && PerentsData?.personal_id,
        mobile_number: PerentsData && PerentsData?.mobile_number,
      });

      const orderId = response.data.order;
      const razorpay_key_id = response.data.razorpay_key_id;
      console.log("razorpay_key_id", orderId, razorpay_key_id)
      if (orderId) {

        await paynow(orderId, razorpay_key_id);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const paynow = async (orderId, razorpay_key_id) => {
    console.log("razorpay_key_id in the paynow", razorpay_key_id, 'and', typeof orderId.amount)
    const options = {
      description: 'Pay to Panchal Samaj',
      image:
        'https://samajapp.codecrewinfotech.com/uploads/appstore.png',
      currency: orderId.currency,
      order_id: orderId.id,
      key: razorpay_key_id,
      amount: orderId.amount,
      name: 'Pay to Panchal Samaj',
      prefill: {
        name: PerentsData && PerentsData?.firstname,
        lastname: PerentsData && PerentsData?.lastname,
        contact: PerentsData && PerentsData?.mobile_number,
      },
      theme: { color: '#0D5ADD' },
    };
    console.log("final options", options)

    RazorpayCheckout.open(options)
      .then(data => {
        try {
          console.log(data, "data")
          const response = api.post(`/payment`, {
            razorpay_payment_id: data.razorpay_payment_id,
            status_code: data.status_code,
            user_id: PerentsData && PerentsData?._id,
          });

          AsyncStorage.removeItem('PerentsData').then(() => {
          });
          navigation.navigate('PaymentSuccess');
        } catch (error) {
          console.log(error);
        }
      })
      .catch(error => {
        AsyncStorage.removeItem('PerentsData').then(() => {
        });
        navigation.navigate('PaymentFail');
        console.error('Payment error:', error);
      });
  };

  return (
    <View style={styles.maincontainer}>
      <View style={styles.container}>
        <View style={styles.img}>
          <View style={styles.imageContainer}>
            <Image
              source={require('../assets/directory.png')}
              alt='directory'
              style={styles.image}
            />
          </View>
        </View>

        <ScrollView>
          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('name')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData &&
                  PerentsData?.firstname + ' ' + PerentsData?.lastname}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('mobile')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.mobile_number}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('state')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.state}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('city')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.city}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('pincode')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.pincode}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('gender')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.gender}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}> {t('education')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.education}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('profession')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.job}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>{t('address')} :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.address}
              </Text>
            </View>
          </View>

        </ScrollView>
        {PaymentamoutData !== null && (
          <TouchableOpacity style={styles.button} onPress={handlePayment} activeOpacity={0.6}>
            <Text style={styles.btntext}>
              {t('pay')} ₹{PaymentamoutData.amountObject.value}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    // backgroundColor: '#f1f1f1',
    backgroundColor: '#fff',
    height: '100%',
  },

  container: {
    width: '100%',
    height: '100%',
  },

  img: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '30%',
    width: '100%',
  },

  imageContainer: {
    borderRadius: 100,
    shadowColor: 'black',
    elevation: 5,
  },

  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },

  details: {
    backgroundColor: '#edf9ff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 25,
    marginVertical: 5,
    marginHorizontal: 15,
    shadowColor: 'black',
    elevation: 3,
    // gap: 10,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  label: {
    alignItems: 'flex-start',
    flexBasis: '50%',
    fontSize: 17,
    color: 'black',
    fontWeight: '600',
  },

  userInfo: {
    alignItems: 'flex-start',
    flexBasis: '50%',
    fontSize: 17,
    color: 'black',
    fontWeight: '400',
  },

  button: {
    height: 50,
    // margin: 50,
    backgroundColor: '#18bd5b',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
    marginHorizontal: 15,
    shadowColor: 'gray',
    elevation: 3,
  },

  btntext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
  },
});

export default PaymentPage;
