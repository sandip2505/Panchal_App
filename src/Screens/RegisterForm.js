import React, {useState, useEffect, useContext} from 'react';
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
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_BASE_URL, API_KEY} from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

import {RadioButton} from 'react-native-paper';
import {showToast} from '../component/CustomToast';

const CustomDateField = props => {
  return (
    <View style={styles.dateFieldContainer}>
      <DateField {...props} />
    </View>
  );
};

const RegisterForm = ({route}) => {
  const {locations_id} = route.params;
  // console.log("locations_id", locations_id)
  const navigation = useNavigation();

  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [lastname, setLastname] = useState('');
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
  const [lastnameError, setlastnameError] = useState('');
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

  const [userData, setUserData] = useState(null);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  const formatDate = date => {
    const formattedDate = new Date(date);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return formattedDate.toLocaleDateString(undefined, options);
  };

  const handleRegister = async text => {
    const expectedPasswordPattern =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;

    let isValid = true;
    if (!firstname) {
      setfirstnameError('Please enter firstname.');
      isValid = false;
    } else {
      setfirstnameError('');
    }
    if (!lastname) {
      setlastnameError('Please enter lastname.');
      isValid = false;
    } else {
      setlastnameError('');
    }
    if (!middlename) {
      setmiddlenameError('Please enter middlename.');
      isValid = false;
    } else {
      setmiddlenameError('');
    }
    if (!password) {
      setPasswordError('Please enter password.');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must have at least 6 characters.');
      isValid = false;
    } else if (!expectedPasswordPattern.test(password)) {
      setPasswordError(
        'Password must have at least one letter, one number, and one special character.',
      );
      isValid = false;
    } else {
      setPasswordError('');
    }
    if (!dob) {
      setdobError('Please enter dob.');
      isValid = false;
    } else {
      setdobError('');
    }
    if (!mobile_number) {
      setmobile_numberError('Please enter mobile number.');
      isValid = false;
    } else if (isNaN(mobile_number) || mobile_number.length !== 10) {
      setmobile_numberError('Please enter a valid mobile number');
      isValid = false;
    } else {
      setmobile_numberError('');
    }
    if (!state) {
      setstateError('Please enter state.');
      isValid = false;
    } else {
      setstateError('');
    }
    if (!city) {
      setcityError('Please enter city.');
      isValid = false;
    } else {
      setcityError('');
    }
    if (!pincode) {
      setpincodeError('Please enter pincode.');
      isValid = false;
    } else if (isNaN(pincode) || pincode.length !== 6) {
      setpincodeError('Please enter a valid pincode number');
      isValid = false;
    } else {
      setpincodeError('');
    }
    if (!education) {
      seteducationError('Please enter education.');
      isValid = false;
    } else {
      seteducationError('');
    }
    if (!address) {
      setaddressError('Please enter address.');
      isValid = false;
    } else {
      setaddressError('');
    }
    if (!job) {
      setjobError('Please enter job.');
      isValid = false;
    } else {
      setjobError('');
    }
    if (!gender) {
      setgenderError('Please enter gender.');
      isValid = false;
    } else {
      setgenderError('');
    }
    if (!marital_status) {
      setMaritalStatusError('Please choose marital status.');
      isValid = false;
    } else {
      setMaritalStatusError('');
    }

    if (isValid) {
      const userData = new FormData();

      userData.append('firstname', firstname);
      userData.append('middlename', middlename);
      userData.append('locations_id', locations_id);
      userData.append('lastname', lastname);
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

      try {
        const response = await axios
          .post(`${API_BASE_URL}/user_register`, {
            headers: {
              Accept: 'application/json',
            },
            userData,
          })
          .then(res => {
            const userId = res.data._id;
            const PerentsData = res.data;
            AsyncStorage.setItem('PerentsData', JSON.stringify(PerentsData));
            setFirstname('');
            setMiddlename('');
            setLastname('');
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
          })
          .catch(err => {
            console.log('i got error ouchhhh!!!   ::: ', err);
          });
      } catch (error) {
        if (error.response) {
          console.log('Status code:', error.response.status);
          console.log('Response data:', error.response.data);
          console.log('Response headers:', error.response.headers);
        } else {
          console.error('Error:', error.message);
        }
      }
    } else {
      showToast('error', 'Please fill all the required fields !', 2500);
    }
  };

  useEffect(() => {
    const dataaa = AsyncStorage.getItem('userData');
  }, []);

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
                {borderColor: firstnameError ? '#ff0000' : 'gray'},
              ]}
              placeholder="First Name / પોતાનું નામ"
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
                {borderColor: middlenameError ? '#ff0000' : 'gray'},
              ]}
              placeholder="Middle Name / પિતાનું નામ"
              value={middlename}
              onChangeText={setMiddlename}
            />
            {middlenameError && (
              <Text style={styles.error}>{middlenameError}</Text>
            )}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                {borderColor: lastnameError ? '#ff0000' : 'gray'},
              ]}
              placeholder="Last Name / અટક"
              value={lastname}
              onChangeText={setLastname}
            />
            {lastnameError && <Text style={styles.error}>{lastnameError}</Text>}
          </View>

          <TextInput
            style={[
              styles.input,
              {borderColor: passwordError ? '#ff0000' : 'gray'},
            ]}
            placeholder="Password / પાસવર્ડ"
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
                  {borderColor: dobError ? '#ff0000' : 'gray'},
                ]}
                placeholderTextColor="gray"
                placeholder="Date of birth / જન્મ તારીખ"
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
                {borderColor: mobile_numberError ? '#ff0000' : 'gray'},
              ]}
              placeholder="Mobile Number / મોબાઇલ નંબર"
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
                {borderColor: addressError ? '#ff0000' : 'gray'},
              ]}
              placeholder="Address / સરનામું"
              value={address}
              onChangeText={setAddress}
            />
            {addressError && <Text style={styles.error}>{addressError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                {borderColor: cityError ? '#ff0000' : 'gray'},
              ]}
              placeholder="City / શહેર"
              placeholderTextColor="gray"
              value={city}
              onChangeText={setCity}
            />
            {cityError && <Text style={styles.error}>{cityError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                {borderColor: stateError ? '#ff0000' : 'gray'},
              ]}
              placeholder="State / રાજ્ય"
              value={state}
              onChangeText={setState}
            />
            {stateError && <Text style={styles.error}>{stateError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                {borderColor: pincodeError ? '#ff0000' : 'gray'},
              ]}
              placeholder="Pincode / પીન કોડ"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="numeric"
            />
            {pincodeError && <Text style={styles.error}>{pincodeError}</Text>}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                {borderColor: educationError ? '#ff0000' : 'gray'},
              ]}
              placeholder="Education / ભણતર"
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
                {borderColor: jobError ? '#ff0000' : 'gray'},
              ]}
              placeholder="Profession / વ્યવસાય"
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
              style={[styles.input, {marginTop: maritalStatusError ? 16 : 0}]}
              selectedValue={marital_status}
              onValueChange={itemValue => setMaritalStatus(itemValue)}
              defaultValue="Married"
              dropdownIconColor="gray">
              <Picker.Item
                label="Marital status / વૈવાહિક સ્ટેટસ પસંદ કરો"
                value=""
                selectedValue
                enabled={false}
              />
              <Picker.Item
                label="Married / પરિણીત"
                value="Married"
                defaultValue
              />
              <Picker.Item label="Unmarried / અપરિણીત" value="Unmarried" />
              <Picker.Item label="widower / વિધુર" value="widower" />
              <Picker.Item label="Widow / વિધવા" value="Widow" />
              <Picker.Item label="Divorcee / છૂટાછેડા લેનાર" value="Divorcee" />
            </Picker>
            {maritalStatusError && (
              <Text style={styles.error}>{maritalStatusError}</Text>
            )}
          </View>

          <View
            style={[
              styles.gender,
              {borderColor: genderError ? '#ff0000' : 'gray'},
            ]}>
            <View style={styles.radioContainer}>
              <Text style={styles.radioLabel}>Male / પુરૂષ</Text>
              <RadioButton
                value="male"
                status={gender === 'male' ? 'checked' : 'unchecked'}
                onPress={() => setGender('male')}
                color="blue"
              />

              <Text style={styles.radioLabel}>Female / સ્ત્રી</Text>
              <RadioButton
                value="female"
                status={gender === 'female' ? 'checked' : 'unchecked'}
                onPress={() => setGender('female')}
                color="blue"
              />

              <Text style={styles.radioLabel}>Other / અન્ય</Text>
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
    backgroundColor: '#fff',
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

  bday: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    height: 40,
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 4,
    paddingHorizontal: 8,
  },

  bdaypicker: {
    flexBasis: '70%',
  },
  bdayText: {
    flexBasis: '30%',
    color: 'gray',
  },
  image: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 4,
    borderColor: 'gray',
    borderWidth: 1,
    paddingVertical: 1,
  },

  imgbtn: {
    backgroundColor: '#adadad',
    height: 40,
    borderRadius: 4,
    marginBottom: 10,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  imgtext: {
    fontSize: 18,
    color: 'black',
  },

  input: {
    borderWidth: 1,
    marginTop: 16,
    borderRadius: 4,
    color: 'black',
    paddingHorizontal: 8,
  },

  inputContainer: {
    height: 45,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 16,
    justifyContent: 'center',
  },

  errorInput: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    marginBottom: 16,
    borderRadius: 4,
    paddingHorizontal: 8,
  },

  button: {
    height: 50,
    backgroundColor: '#00a9ff',
    borderRadius: 4,
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
    borderRadius: 4,
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