import React, { useState, useEffect, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Alert,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from './api';
import { RadioButton } from 'react-native-paper';
import { showToast } from '../component/CustomToast';
import { useTranslation, initReactI18next } from 'react-i18next';

const CustomDateField = props => {
  return (
    <View style={styles.dateFieldContainer}>
      <DateField {...props} />
    </View>
  );
};

const RegisterForm = ({ route }) => {
  const { locations_id } = route.params;
  const navigation = useNavigation();

  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [mobile_number, setMobileNumber] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [address, setAddress] = useState('');
  const [job, setJob] = useState('');
  const [marital_status, setMaritalStatus] = useState('');

  const [firstnameError, setfirstnameError] = useState('');
  const [middlenameError, setmiddlenameError] = useState('');
  const [dobError, setdobError] = useState('');
  const [mobile_numberError, setmobile_numberError] = useState('');
  const [stateError, setstateError] = useState('');
  const [cityError, setcityError] = useState('');
  const [pincodeError, setpincodeError] = useState('');
  const [educationError, seteducationError] = useState('');
  const [addressError, setaddressError] = useState('');
  const [jobError, setjobError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [genderError, setgenderError] = useState('');
  const [maritalStatusError, setMaritalStatusError] = useState('');
  const [fcmtoken, setFcmtoken] = useState('');

  const [userData, setUserData] = useState(null);
  const { t } = useTranslation();

  const initialLabel = t('maritalstatus');
  const married = t('married');
  const unmarried = t('unmarried');
  const widower = t('widower');
  const widow = t('widow');
  const divorcee = t('divorcee');

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const formatDate = date => {
    const formattedDate = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return formattedDate.toLocaleDateString(undefined, options);
  };

  const handleRegister = async text => {
    const expectedPasswordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    let isValid = true;
    if (!firstname) {
      setfirstnameError(t('pleaseenterfirstname'));
      isValid = false;
    } else {
      setfirstnameError('');
    }

    if (!middlename) {
      setmiddlenameError(t('pleaseentermiddlename'));
      isValid = false;
    } else {
      setmiddlenameError('');
    }
    if (!password) {
      setPasswordError(t('pleaseenterpassword'));
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(t('passwordmusthaveatleastcharacters'));
      isValid = false;
    } else if (!expectedPasswordPattern.test(password)) {
      setPasswordError(
        t('passwordmusthaveatleastoneletteronenumberandonespecialcharacter'),
      );
      isValid = false;
    } else {
      setPasswordError('');
    }
    if (!dob) {
      setdobError(t('pleaseenterdob'));
      isValid = false;
    } else {
      setdobError('');
    }
    if (!mobile_number) {
      setmobile_numberError(t('pleaseentermobilenumber'));
      isValid = false;
    } else if (isNaN(mobile_number) || mobile_number.length !== 10) {
      setmobile_numberError(t('pleaseenteravalidmobilenumber'));
      isValid = false;
    } else {
      setmobile_numberError('');
    }
    if (!state) {
      setstateError(t('pleaseenterstate'));
      isValid = false;
    } else {
      setstateError('');
    }
    if (!city) {
      setcityError(t('pleaseentercity'));
      isValid = false;
    } else {
      setcityError('');
    }
    if (!pincode) {
      setpincodeError(t('pleaseenterpincode'));
      isValid = false;
    } else if (isNaN(pincode) || pincode.length !== 6) {
      setpincodeError(t('pleaseenteravalidpincodenumber'));
      isValid = false;
    } else {
      setpincodeError('');
    }
    if (!education) {
      seteducationError(t('pleaseentereducation'));
      isValid = false;
    } else {
      seteducationError('');
    }
    if (!address) {
      setaddressError(t('pleaseenteraddress'));
      isValid = false;
    } else {
      setaddressError('');
    }
    if (!job) {
      setjobError(t('pleaseenterjob'));
      isValid = false;
    } else {
      setjobError('');
    }
    if (!gender) {
      setgenderError(t('pleaseentergender'));
      isValid = false;
    } else {
      setgenderError('');
    }
    if (!marital_status) {
      setMaritalStatusError(t('pleasechoosemaritalstatus'));
      isValid = false;
    } else {
      setMaritalStatusError('');
    }

    if (isValid) {
      const userData = new FormData();
      console.log(userData, "userData")
      userData.append('firstname', firstname);
      userData.append('middlename', middlename);
      userData.append('locations_id', locations_id);
      userData.append('dob', dob);
      userData.append('mobile_number', mobile_number);
      userData.append('password', password);
      userData.append('state', state);
      userData.append('city', city);
      userData.append('pincode', pincode);
      userData.append('gender', gender);
      userData.append('education', education);
      userData.append('address', address);
      userData.append('job', job);
      userData.append('marital_status', marital_status);
      userData.append('fcmtoken', fcmtoken);

      try {
        const PerentsData = {
          firstname: firstname,
          middlename: middlename,
          lastname: 'Panchal',
          locations_id: locations_id,
          dob: dob,
          mobile_number: mobile_number,
          password: password,
          state: state,
          city: city,
          pincode: pincode,
          gender:gender,
          education: education,
          address: address,
          job: job,
          marital_status: marital_status,
          device_token: fcmtoken,
          payment_id:null,
        }
        console.log(PerentsData, "PerentsData")
        AsyncStorage.setItem('PerentsData', JSON.stringify(PerentsData));
        setFirstname('');
        setMiddlename('');
        setPassword('');
        setDob(null);
        setShowPicker(false);
        setMobileNumber('');
        setState('');
        setCity('');
        setPincode('');
        setGender('');
        setEducation('');
        setAddress('');
        setJob('');
        setMaritalStatus('');
        navigation.navigate('PaymentPage');
       
        // const response = await api
        //   .post(`/user_regisster`, {
        //     headers: {
        //       Accept: 'application/json',
        //     },
        //     userData,
        //   })
        //   .then(res => {

        //     const userId = res.data._id;
        //     const PerentsData = res.data;
          
        //     if (res.data.mobileError === 'Mobile number already register') {
        //       showToast(
        //         'error',
        //         t('mobilenumberisalreadyregistered'),
        //         2500,
        //       );
        //     } else {
        //       AsyncStorage.setItem('PerentsData', JSON.stringify(PerentsData));
        //       setFirstname('');
        //       setMiddlename('');
        //       setPassword('');
        //       setDob(null);
        //       setShowPicker(false);
        //       setMobileNumber('');
        //       setState('');
        //       setCity('');
        //       setPincode('');
        //       setGender('');
        //       setEducation('');
        //       setAddress('');
        //       setJob('');
        //       setMaritalStatus('');
        //       navigation.navigate('PaymentPage');
        //     }
        //   })
        //   .catch(err => { });
      } catch (error) {
        if (error.response) {
          console.log('Status code:', error.response);
        } else {
          console.error('Error:', error.message);
        }
      }
    } else {
      showToast(
        'error',
        t('pleasefillalltherequiredfields'),
        2500,
      );
    }
  };

  useEffect(() => {
    const dataaa = AsyncStorage.getItem('userData');
    GetFCMToken()
    showToast(
      'info',
      t('registerthemainmemberofthehouse'),
      6000,
    );
  }, []);
  const GetFCMToken = async () => {
    try {
      let fcmtoken = await AsyncStorage.getItem("fcmtoken");
      setFcmtoken(fcmtoken)
      console.log(fcmtoken, "old token");
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

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Register Form</Text> */}

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.childContainer}>
          <View>
            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: firstnameError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('firstname')}
              value={firstname}
              onChangeText={setFirstname}
            />
            {firstnameError && (
              <Text style={styles.error}>{firstnameError}</Text>
            )}
            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
              ]}
              placeholder={t('lastname')}
              editable={false}
              value='Panchal'
            />
            {firstnameError && (
              <Text style={styles.error}>{firstnameError}</Text>
            )}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: middlenameError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('middlename')}
              value={middlename}
              onChangeText={setMiddlename}
            />
            {middlenameError && (
              <Text style={styles.error}>{middlenameError}</Text>
            )}

          </View>

          <TextInput
            style={[
              styles.input,
              { borderColor: passwordError ? '#ff0000' : 'gray' },
            ]}
            placeholder={t('password')}
            placeholderTextColor="gray"
            // secureTextEntry={true}
            onChangeText={setPassword}
            value={password}
          />
          {passwordError && <Text style={styles.error}>{passwordError}</Text>}

          <View>
            <Pressable onPress={() => setShowPicker(true)}>
              <TextInput
                style={[
                  styles.input,
                  { borderColor: dobError ? '#ff0000' : 'gray' },
                ]}
                placeholderTextColor="gray"
                placeholder={t('dateofbirth')}
                editable={false}
                value={dob ? formatDate(dob) : ''}
              />
            </Pressable>
            {dobError && <Text style={styles.error}>{dobError}</Text>}

            {showPicker && (
              <DateTimePicker
                value={dob || new Date()}
                mode="date"
                display="spinner"
                maximumDate={new Date()}
                onChange={handleDateChange}
              />
            )}
          </View>

          <View>
            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: mobile_numberError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('mobile')}
              value={mobile_number}
              onChangeText={setMobileNumber}
              keyboardType="numeric"
            />
            {mobile_numberError && (
              <Text style={styles.error}>{mobile_numberError}</Text>
            )}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: addressError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('address')}
              value={address}
              onChangeText={setAddress}
            />
            {addressError && <Text style={styles.error}>{addressError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: cityError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('city')}
              value={city}
              onChangeText={setCity}
            />
            {cityError && <Text style={styles.error}>{cityError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: stateError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('state')}
              value={state}
              onChangeText={setState}
            />
            {stateError && <Text style={styles.error}>{stateError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: pincodeError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('pincode')}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
            />
            {pincodeError && <Text style={styles.error}>{pincodeError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: educationError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('education')}
              value={education}
              onChangeText={setEducation}
            />
            {educationError && (
              <Text style={styles.error}>{educationError}</Text>
            )}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: jobError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('profession')}
              value={job}
              onChangeText={setJob}
            />
            {jobError && <Text style={styles.error}>{jobError}</Text>}
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                borderColor: maritalStatusError ? '#ff0000' : 'gray',
                marginBottom: maritalStatusError ? 16 : 0,
              },
            ]}>
            <Picker
              style={[styles.input, { marginTop: maritalStatusError ? 16 : 0 }]}
              selectedValue={marital_status}
              onValueChange={itemValue => setMaritalStatus(itemValue)}
              mode="dropdown"
              defaultValue="Married"
              dropdownIconColor="gray">
              <Picker.Item
                label={initialLabel}
                value=""
                selectedValue
                enabled={true}
              />
              <Picker.Item
                label={married}
                value="Married"
                defaultValue
              />

              <Picker.Item label={unmarried} value="Unmarried" />
              <Picker.Item label={widower} value="widower" />
              <Picker.Item label={widow} value="Widow" />
              <Picker.Item label={divorcee} value="Divorcee" />
            </Picker>
            {maritalStatusError && (
              <Text style={styles.error}>{maritalStatusError}</Text>
            )}
          </View>

          <View
            style={[
              styles.gender,
              { borderColor: genderError ? '#ff0000' : 'gray' },
            ]}>
            <Text style={styles.radioLabel}>{t('chooseyourgender')}</Text>

            <View style={styles.radioContainer}>
              <Text style={styles.radioLabel}>{t('male')}</Text>
              <RadioButton
                value="male"
                status={gender === 'male' ? 'checked' : 'unchecked'}
                onPress={() => setGender('male')}
                color="blue"
              />

              <Text style={styles.radioLabel}>{t('female')}</Text>
              <RadioButton
                value="female"
                status={gender === 'female' ? 'checked' : 'unchecked'}
                onPress={() => setGender('female')}
                color="blue"
              />

              <Text style={styles.radioLabel}>{t('other')}</Text>
              <RadioButton
                value="other"
                status={gender === 'other' ? 'checked' : 'unchecked'}
                onPress={() => setGender('other')}
                color="blue"
              />
            </View>
          </View>
          {genderError && <Text style={styles.error}>{genderError}</Text>}

          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.btntext}> Save </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dae4f0',
  },

  childContainer: {
    padding: 16,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#515151',
    textTransform: 'uppercase',
  },

  image: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 6,
    borderColor: 'gray',
    borderWidth: 1,
    paddingVertical: 1,
  },

  input: {
    borderWidth: 1,
    marginTop: 16,
    borderRadius: 6,
    color: 'black',
    paddingHorizontal: 8,
    height: 50,
  },

  inputContainer: {
    height: 45,
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 16,
    justifyContent: 'center',
  },

  button: {
    height: 50,
    backgroundColor: '#00a9ff',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  btntext: {
    color: 'white',
    fontSize: 20,
    textTransform: 'uppercase',
  },

  gender: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    marginTop: 16,
    borderWidth: 1,
    borderRadius: 6,
  },

  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioLabel: {
    marginLeft: 5,
    color: 'black',
  },

  error: {
    color: '#ff0000',
    fontSize: 15,
    textAlign: 'justify',
    paddingRight: 7,
  },
});

export default RegisterForm;
