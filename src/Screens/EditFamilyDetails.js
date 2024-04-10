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
  const navigation = useNavigation();
  const { childId } = route.params;
  const { t } = useTranslation();
  const initialLabel = t('maritalstatus');
  const married = t('married');
  const unmarried = t('unmarried');
  const widower = t('widower');
  const widow = t('widow');
  const divorcee = t('divorcee');

  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [job, setJob] = useState('');
  const [marital_status, setMaritalStatus] = useState('');
  const [relationship, setRelationship] = useState('');
  const [firstnameError, setfirstnameError] = useState('');
  const [middlenameError, setmiddlenameError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [dobError, setdobError] = useState('');
  const [educationError, seteducationError] = useState('');
  const [jobError, setjobError] = useState('');
  const [genderError, setgenderError] = useState('');
  const [maritalStatusError, setMaritalStatusError] = useState('');
  const [relationshipError, setRelationshipError] = useState('');
  const [relationshipData, setRelationshipData] = useState([]);


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

  const handleUpdate = async text => {
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

    if (!dob) {
      setdobError(t('pleaseenterdob'));
      isValid = false;
    } else {
      setdobError('');
    }
    if (!education) {
      seteducationError(t('pleaseentereducation'));
      isValid = false;
    } else {
      seteducationError('');
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

    if (!relationship) {
      setRelationshipError(t('pleasechoosemaritalstatus'));
      isValid = false;
    } else {
      setRelationshipError('');
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
        gender,
        education,
        relationship,
        job,
        marital_status,
      };

      try {

        const response = await api.post(`/child_update/${childId}`, Updatedata);

        if (response.status === 200) {
          const data = response.data;
          setFirstname('');
          setMiddlename('');
          setLastname('');
          setDob('');
          setEducation('');
          setJob('');
          setGender('');
          setMaritalStatus('');
          setRelationship('');

          AsyncStorage.removeItem('childData').then(() => {
            const childData = JSON.stringify(response.data.childData);
            AsyncStorage.setItem('childData', childData).then(() => {
            });
          });

          showToast(
            'success',
            t('dataupdatedsuccessfully'),
            2500,
          );

          navigation.navigate('ProfilePage');
        } else {
          console.log('child_update Request failed with status:', response.status);
        }
      } catch (error) {
        console.log(error)
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
    Data();
  }, []);
  const Data = () => {
    api.get(`/data/`).then(response => {
      const data = response.data;
      console.log(data, 'data')
      if (data.relationship && data.relationship.length > 0) {
        setRelationshipData(data.relationship);
      }
    });
  }

  const fetchData = async () => {
    try {

      const response = await api.get(`/childuser-edit/${childId}`);

      if (response.status === 200) {
        const data = response.data;
        if (data) {
          // setEditData(data);
          setFirstname(data.firstname);
          setMiddlename(data.middlename);
          setLastname(data.lastname);
          setDob(new Date(data.dob));
          setEducation(data.education);
          setJob(data.job);
          setGender(data.gender);
          setRelationship(data.relationship);
          setMaritalStatus(data.marital_status);
        }
      } else {
        console.log('childuser-edit Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={styles.container}>
      {/* <View style={styles.container}> */}
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
              <Text style={styles.errorText}>{firstnameError}</Text>
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
              <Text style={styles.errorText}>{middlenameError}</Text>
            )}

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                { borderColor: lastnameError ? '#ff0000' : 'gray' },
              ]}
              placeholder={t('lastname')}
              value={lastname}
              onChangeText={setLastname}
            />
            {lastnameError && <Text style={styles.errorText}>{lastnameError}</Text>}
          </View>

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
              <Text style={styles.errorText}>{educationError}</Text>
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
            {jobError && <Text style={styles.errorText}>{jobError}</Text>}
          </View>

          <View
            style={[
              styles.inputContainer,
              {
                borderColor: relationshipError ? '#ff0000' : 'gray',
                marginBottom: relationshipError ? 16 : 0,
              },
            ]}>
            <Picker
              style={[styles.input, { marginTop: relationshipError ? 16 : 0, backgroundColor: 'none' }]}
              selectedValue={relationship}
              onValueChange={itemValue => setRelationship(itemValue)}
              mode="dropdown"
            
              dropdownIconColor="gray">
             
              {relationshipData.map(item => (
                <Picker.Item
                  // key={item.key}
                  label={`${item.value}`}
                  value={item.key}
                />
              ))}
            </Picker>
            {relationshipError && (
              <Text style={styles.errorText}>{relationshipError}</Text>
            )}
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
              style={[styles.input, { marginTop: maritalStatusError ? 16 : 0, backgroundColor: 'none' }]}
              selectedValue={marital_status}
              onValueChange={itemValue => setMaritalStatus(itemValue)}
              mode="dropdown"
              defaultValue="Married"
              dropdownIconColor="gray">
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
              <Text style={styles.errorText}>{maritalStatusError}</Text>
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
                status={
                  gender === 'male'
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => setGender('male')}
                color="blue"
                defaultValue
              />

              <Text style={styles.radioLabel}>{t('female')}</Text>
              <RadioButton
                value="female"
                status={
                  gender === 'female'
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => setGender('female')}
                color="blue"
              />

              <Text style={styles.radioLabel}>{t('other')}</Text>
              <RadioButton
                value="other"
                status={
                  gender === 'other'
                    ? 'checked'
                    : 'unchecked'
                }
                onPress={() => setGender('other')}
                color="blue"
              />
            </View>
          </View>
          {genderError && <Text style={styles.errorText}>{genderError}</Text>}
        

        <View style={styles.btngroup}>
          <Pressable style={[styles.button, { backgroundColor: '#4BB543' }]} onPress={handleUpdate}>
            <Text style={styles.btntext}>{t('update')}</Text>
          </Pressable>
        </View>
        </View>
      </ScrollView>
      {/* </View> */}
    </ImageBackground>

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
    height: 55,
    elevation: 5,
    // borderWidth: 1,
    // borderColor: 'gray',
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 16,
    justifyContent: 'center',
    marginVertical: 20,
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
