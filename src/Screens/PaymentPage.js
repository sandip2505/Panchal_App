import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Alert,
  StyleSheet,
  Pressable,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import RazorpayCheckout from 'react-native-razorpay';
import { API_BASE_URL, RAZORPAY_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { showToast } from '../component/CustomToast';

// import RNFS from 'react-native-fs';
const PaymentPage = ({ navigation }) => {
  const [userData1, setUserData1] = useState(null);
  const [ChildData, setChildData] = useState(null);
  const [PaymentamoutData, setpaymentamoutData] = useState(null);
  const [amount, setamount] = useState(null);
  const [razorpay_key, setrazorpay_key] = useState(null);
  const [PerentsData, setPerentsData] = useState(null);
console.log(razorpay_key)

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
        console.log('Error retrieving user data:', error);
      });
  }, [PaymentamoutData]);

  useEffect(() => {
    paymentamout();

    showToast(
      'info',
      'Complete payment for successfull registration...',
      5000,
    );
  }, []);

  const paymentamout = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listsettings`);
      if (response.status === 200) {
        const data = response.data;
        const amountObject = data.find(item => item.key === 'amount');
        const razorpay_key = data.find(item => item.key === 'RAZORPAY_KEY');
        setrazorpay_key( razorpay_key.value );
        let amountValue = null;
        if (amountObject) {
          amountValue = amountObject.value;
        }

        setpaymentamoutData({ amountObject });
      } else {
        console.log('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handlePayment = async () => {
    const options = {
      description: 'Pay to Panchal Samaj',
      image:
        'https://samajapp.codecrewinfotech.com/uploads/appstore.png',
      currency: 'INR',
      key: razorpay_key?razorpay_key:RAZORPAY_KEY,
      amount: amount * 100,
      name: 'Pay to Panchal Samaj',
      prefill: {
        name: PerentsData && PerentsData?.firstname,
        lastname: PerentsData && PerentsData?.lastname,
        contact: PerentsData && PerentsData?.mobile_number,
      },
      theme: { color: '#0D5ADD' },
    };

    RazorpayCheckout.open(options)
      .then(data => {
        try {
          // AsyncStorage.removeItem('PerentsData');
          const response = axios.post(`${API_BASE_URL}/payment`, {
            razorpay_payment_id: data.razorpay_payment_id,
            status_code: data.status_code,
            user_id: PerentsData && PerentsData?._id,
          });
          AsyncStorage.removeItem('PerentsData').then(() => {
            console.log("remove")
          });
          navigation.navigate('PaymentSuccess');
        } catch (error) {
          console.log(error);
        }
      })
      .catch(error => {
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
              <Text style={styles.label}>Name :</Text>
              <Text style={styles.userInfo}>
                {PerentsData &&
                  PerentsData?.firstname + ' ' + PerentsData?.lastname}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Mobile No. :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.mobile_number}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>State :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.state}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>City :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.city}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Pincode :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.pincode}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Gender :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.gender}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Education :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.education}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>profession :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.job}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Address :</Text>
              <Text style={styles.userInfo}>
                {PerentsData && PerentsData?.address}
              </Text>
            </View>
          </View>

        </ScrollView>
        {PaymentamoutData !== null && (
          <Pressable style={styles.button} onPress={handlePayment}>
            <Text style={styles.btntext}>
              Pay ₹{PaymentamoutData.amountObject.value}
            </Text>
          </Pressable>
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
