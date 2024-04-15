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
  ImageBackground
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import api from '../context/api';
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

const EditMainDetails = ({ route }) => {
  const { mainId } = route.params;

  const navigation = useNavigation();

  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  // const [mobile_number, setMobile_number] = useState('');
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [address, setAddress] = useState('');
  const [job, setJob] = useState('');
  const [marital_status, setMaritalStatus] = useState('');
  const [email, setemail] = useState('')


  const [firstnameError, setfirstnameError] = useState('');
  const [middlenameError, setmiddlenameError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [dobError, setdobError] = useState('');
  // const [mobile_numberError, setmobile_numberError] = useState('');
  const [emailError, setemailError] = useState('')
  const [stateError, setstateError] = useState('');
  const [cityError, setcityError] = useState('');
  const [pincodeError, setpincodeError] = useState('');
  const [educationError, seteducationError] = useState('');
  const [addressError, setaddressError] = useState('');
  const [jobError, setjobError] = useState('');
  const [genderError, setgenderError] = useState('');
  const [maritalStatusError, setMaritalStatusError] = useState('');
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

  const handleUpdate = async () => {
    let isValid = true;
    if (!firstname) {
      setfirstnameError(t('pleaseenterfirstname'));
      isValid = false;
    } else {
      setfirstnameError('');
    }

    if (!lastname) {
      setlastnameError(t('pleaseenterlastname'));
      isValid = false;
    } else {
      setlastnameError('');
    }

    if (!middlename) {
      setmiddlenameError(t('pleaseentermiddlename'));
      isValid = false;
    } else {
      setmiddlenameError('');
    }


    if (!email) {
      setemailError(t('please enter middlename'));
      isValid = false;
    } else {
      setemailError('');
    }

    if (!dob) {
      setdobError(t('pleaseenterdob'));
      isValid = false;
    } else {
      setdobError('');
    }

    // if (!mobile_number) {
    //   setmobile_numberError('Please enter mobile number.');
    //   isValid = false;
    // } else if (isNaN(mobile_number) || mobile_number.length !== 10) {
    //   setmobile_numberError('Please enter a valid mobile number');
    //   isValid = false;
    // } else {
    //   setmobile_numberError('');
    // }

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
      const Updatedata = {
        firstname,
        middlename,
        lastname,
        dob,
        // mobile_number,
        email,
        state,
        city,
        pincode,
        address,
        gender,
        education,
        job,
        marital_status,
      };
      try {

        const response = await api.post(`user-update/${mainId}`, Updatedata);

        if (response.status === 200) {
          const data = response.data;
          AsyncStorage.removeItem('userData').then(() => {
            const userData = JSON.stringify(response.data);
            AsyncStorage.setItem('userData', userData);
            navigation.navigate('HomePage');
            navigation.navigate('ProfilePage');
            showToast(
              'success',
              t('dataupdatedsuccessfully'),
              2500,
            );
          });
        } else {
          console.log('user-update Request failed with status:', response.status);
        }
      } catch (error) {
        console.log(error);
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

      const response = await api.get(`user-edit/${mainId}`);

      if (response.status === 200) {
        const data = response.data;
        setFirstname(data.firstname);
        // setMobile_number(data.mobile_number);
        setemail(data.email)
        setMiddlename(data.middlename);
        setLastname(data.lastname);
        setState(data.state);
        setCity(data.city);
        setPincode(data.pincode);
        setAddress(data.address);
        setDob(new Date(data.dob));
        setEducation(data.education);
        setJob(data.job);
        setGender(data.gender);
        setMaritalStatus(data.marital_status);
      } else {
        console.log('user-edit Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={styles.container}>

      {/* <Text style={styles.title}>Register Form</Text> */}

      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.childContainer}>
          <View>
            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: firstnameError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('firstname')}
              value={firstname}
              onChangeText={setFirstname}
            />
            {firstnameError && (
              <Text style={styles.errorText}>{firstnameError}</Text>
            )}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: middlenameError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('middlename')}
              value={middlename}
              onChangeText={setMiddlename}
            />
            {middlenameError && (
              <Text style={styles.errorText}>{middlenameError}</Text>
            )}
            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: lastnameError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('lastname')}
              value={lastname}
              onChangeText={setLastname}
            />
            {lastnameError && <Text style={styles.errorText}>{lastnameError}</Text>}

            {/* Email input */}
            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: emailError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('Email')}
              value={email}
              onChangeText={setemail}
            />
            {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          </View>

          <View>
            <Pressable onPress={() => setShowPicker(true)}>
              <TextInput
                style={[
                  styles.input,
                  { shadowColor: dobError ? '#ff0000' : 'gray' },
                ]}
                placeholderTextColor="gray"
                placeholder={t('dateofbirth')}
                editable={false}
                value={dob ? formatDate(dob) : ''}
              />
            </Pressable>
            {dobError && <Text style={styles.errorText}>{dobError}</Text>}

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
            {/* <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                {borderColor: mobile_numberError ? '#ff0000' : 'gray'},
              ]}
              placeholder="Mobile Number / મોબાઇલ નંબર"
              value={`${mobile_number}`}
              onChangeText={setMobile_number}
              keyboardType="numeric"
            />
            {mobile_numberError && (
              <Text style={styles.errorText}>{mobile_numberError}</Text>
            )} */}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: addressError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('address')}
              value={address}
              onChangeText={setAddress}
            />
            {addressError && <Text style={styles.errorText}>{addressError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: cityError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('city')}
              value={city}
              onChangeText={setCity}
            />
            {cityError && <Text style={styles.errorText}>{cityError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: stateError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('state')}
              value={state}
              onChangeText={setState}
            />
            {stateError && <Text style={styles.errorText}>{stateError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: pincodeError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('pincode')}
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
            />
            {pincodeError && <Text style={styles.errorText}>{pincodeError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: educationError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('education')}
              value={education}
              onChangeText={setEducation}
            />
            {educationError && (
              <Text style={styles.errorText}>{educationError}</Text>
            )}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { shadowColor: jobError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('profession')}
              value={job}
              onChangeText={setJob}
            />
            {jobError && <Text style={styles.errorText}>{jobError}</Text>}
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
                enabled={false}
              />
              <Picker.Item
                label={married}
                value="Married"
                defaultValue
              />
              <Picker.Item label={unmarried} value="Unmarried" />
              <Picker.Item label={widower} value="Widower" />
              <Picker.Item label={widow} value="Widow" />
              <Picker.Item label={widow} value="Widow" />
            </Picker>
            {maritalStatusError && (
              <Text style={styles.errorText}>{maritalStatusError}</Text>
            )}
          </View>

          <View
            style={[
              styles.gender,
              { shadowColor: genderError ? '#ff0000' : 'gray' },
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
          {genderError && <Text style={styles.errorText}>{genderError}</Text>}

          <Pressable style={styles.button} onPress={handleUpdate}>
            <Text style={styles.btntext}> {t('update')} </Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground >
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 10,
    color: '#515151',
    textTransform: 'uppercase',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'gray',
    textTransform: 'uppercase',
  },

  bday: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 6,
    paddingHorizontal: 8,
  },

  bdaypicker: {
    flexBasis: '70%',
  },
  bdayText: {
    flexBasis: '30%',
    color: 'gray',
  },

  dobbtn: {
    color: 'red',
    backgroundColor: 'red',
    marginBottom: 50,
  },

  header: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 15,
  },

  btntext: {
    color: 'white',
    fontSize: 20,
    textTransform: 'uppercase',
  },

  input: {
    elevation: 5,
    backgroundColor: '#fff',
    marginTop: 16,
    borderRadius: 6,
    color: 'black',
    paddingHorizontal: 8,
    height: 50,
  },

  btngroup: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },
  childContainer: {
    padding: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#00a9ff',
    borderRadius: 6,
    elevation: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },

  btntext: {
    color: 'white',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  removebtn: {
    height: 40,
    width: '15%',
    borderRadius: 6,
    backgroundColor: 'red',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },

  removetext: {
    color: 'white',
    fontSize: 20,
    textTransform: 'capitalize',
  },

  inputContainer: {
    height: 50,
    elevation: 5,
    // borderWidth: 1,
    // borderColor: 'gray',
    backgroundColor: '#fff',
    borderRadius: 6,
    // marginBottom: 16,
    justifyContent: 'center',
    marginTop: 20,
    overflow: 'hidden'
    // marginHorizontal: 15,
  },
  gender: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'start',
    justifyContent: 'space-between',
    padding: 5,
    elevation: 5,
    backgroundColor: '#fff',
    marginTop: 16,
    // borderWidth: 1,
    borderRadius: 6,
  },

  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioLabel: {
    marginLeft: 6,
    color: 'black',
  },
});
export default EditMainDetails;
