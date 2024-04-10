import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Pressable,
  ImageBackground
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const FamilyRegister = ({ route }) => {
  const { userId } = route.params;

  const navigation = useNavigation();

  const _id = userId;

  const [forms, setForms] = useState([
    {
      firstname: '',
      middlename: '',
      dob: null,
      gender: '',
      education: '',
      relationship: '',
      job: '',
      maritalStatus: '',
      showPicker: false,
    },
  ]);

  const [firstname, setFirstname] = useState('');
  const [middlename, setMiddlename] = useState('');
  const [dob, setDob] = useState('');
  // const [showPicker, setShowPicker] = useState(false);
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [relationship, setRelationship] = useState('');
  const [relationshipData, setRelationshipData] = useState([]);
  const [job, setJob] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  // validation
  const [formErrors, setFormErrors] = useState([]);
  const { t } = useTranslation();
  const initialLabel = t('maritalstatus');
  const married = t('married');
  const unmarried = t('unmarried');
  const widower = t('widower');
  const widow = t('widow');
  const divorcee = t('divorcee');

  console.log(relationshipData && relationshipData, 'setRelationshipData')
  // const [open, setOpen] = useState(false);

  useEffect(() => {
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
  const isFormValid = form => {
    const errors = {};

    if (form.firstname.length <= 0) {
      errors.firstname = t('pleaseenterfirstname');
    }

    if (form.middlename.length <= 0) {
      errors.middlename = t('pleaseentermiddlename');
    }


    if (form.dob === null) {
      errors.dob = t('pleaseenterdob');
    }

    if (form.education.length <= 0) {
      errors.education = t('pleaseentereducation');
    }

    if (form.job.length <= 0) {
      errors.job = t('pleaseenterjob');
    }

    if (form.gender.length <= 0) {
      errors.gender = t('pleaseentergender');
    }

    if (form.relationship == '') {
      errors.relationship = t('pleasechooserelation');
    }

    if (form.maritalStatus.length <= 0) {
      errors.maritalStatus = t('pleasechoosemaritalstatus');
    }

    return errors;
  };

  const validateForms = () => {
    const errorsList = forms.map(form => isFormValid(form));
    setFormErrors(errorsList);
    return errorsList.every(errors => Object.keys(errors).length === 0);
  };


  const handleToggleDatePicker = index => {
    const updatedForms = [...forms];
    updatedForms[index].showPicker = !updatedForms[index].showPicker;
    setForms(updatedForms);
  };

  const handleDateChange = (index, date) => {
    const updatedForms = [...forms];
    updatedForms[index].dob = date;
    updatedForms[index].showPicker = false;
    setForms(updatedForms);
  };

  const handleAddForm = async () => {
    const isValid = validateForms();
    if (isValid) {
      const value = await AsyncStorage.getItem('childData');

      const childData = JSON.parse(value);


      const maxFormsAllowed = Math.max(7 - childData.length);

      if (forms.length >= maxFormsAllowed) {
        showToast(
          'error',
          t('youcantaddmorethan7forms'),
          2500,
        );

        return;
      }

      const newForm = {
        firstname: '',
        middlename: '',
        dob: null,
        gender: '',
        education: '',
        relationship: '',
        job: '',
        maritalStatus: '',
        showPicker: false,
      };
      setForms([...forms, newForm]);
    } else {
      showToast(
        'error',
        t('fillthedatatoaddnewform'),
        2500,
      );
    }
  };

  const handleRemoveForm = index => {
    if (index === 0) {
      return;
    }

    const updatedForms = [...forms];
    updatedForms.splice(index, 1);
    setForms(updatedForms);
  };

  const handleInputChange = (index, key, value) => {
    const updatedForms = [...forms];
    updatedForms[index][key] = value;
    setForms(updatedForms);
  };

  const handleRelationshipChange = (index, value) => {
    const updatedForms = [...forms];
    updatedForms[index].relationship = value;
    setForms(updatedForms);
  };

  const handleMaritalStatusChange = (index, value) => {
    const updatedForms = [...forms];
    updatedForms[index].maritalStatus = value;
    setForms(updatedForms);
  };

  const handleRegister = async () => {
    const isValid = validateForms();

    if (isValid) {
      const newForm = {
        firstname,
        middlename,
        dob,
        gender,
        education,
        relationship,
        job,
        maritalStatus,
      };
      setForms([newForm]);
      api.post(`/addchildUser/${_id}`, forms)
        .then(response => {
          AsyncStorage.removeItem('childData').then(() => {

            const familyData = JSON.stringify(response.data.familyData);
            AsyncStorage.setItem('childData', familyData).then(() => {
            });
          });
          showToast(
            'success',
            t('registeredsuccessfully'),
            2500,
          );

          navigation.navigate('ProfilePage');
          setFirstname('');
          setMiddlename('');
          setDob('');
          setGender('');
          setEducation('');
          setRelationship('');
          setJob('');
          setMaritalStatus('');
        })

        .catch(error => {
          console.error('Registration failed:', error);
        });
    } else {
      showToast(
        'error',
        t('pleasefillalltherequiredfields'),
        2500,
      );
    }
  };

  const formatDate = date => {
    const formattedDate = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return formattedDate.toLocaleDateString(undefined, options);
  };

  return (
    <ImageBackground source={require('../assets/bg3.jpg')} style={styles.container}>
      <Text style={styles.mainTitle}> {t('familyMembers')} </Text>
      <ScrollView>
        <View style={styles.childContainer}>

          {forms.map((form, index) => (
            <View key={index}>
              <View style={styles.header}>
                <Text style={styles.title}> {t('form')} - {index + 1} </Text>
                {index > 0 && (
                  <Pressable
                    style={styles.removebtn}
                    onPress={() => handleRemoveForm(index)}>
                    <Text style={styles.removetext}> x </Text>
                  </Pressable>
                )}
              </View>
              <TextInput
                placeholderTextColor="gray"
                style={[
                  styles.input,
                  {
                    borderColor: formErrors[index]?.firstname
                      ? '#ff0000'
                      : 'gray',
                  },
                ]}
                placeholder={t('firstname')}
                value={form.firstname}
                onChangeText={value =>
                  handleInputChange(index, 'firstname', value)
                }
              />
              {formErrors[index]?.firstname && (
                <Text style={styles.errorText}>
                  {formErrors[index].firstname}
                </Text>
              )}

              <TextInput
                placeholderTextColor="gray"
                style={[
                  styles.input,
                  {
                    borderColor: formErrors[index]?.middlename
                      ? '#ff0000'
                      : 'gray',
                  },
                ]}
                placeholder={t('middlename')}
                value={form.middlename}
                onChangeText={value =>
                  handleInputChange(index, 'middlename', value)
                }
              />
              {formErrors[index]?.middlename && (
                <Text style={styles.errorText}>
                  {formErrors[index].middlename}
                </Text>
              )}

              <View>
                <Pressable onPress={() => handleToggleDatePicker(index)}>
                  <TextInput
                    style={[
                      styles.input,
                      { borderColor: formErrors[index]?.dob ? '#ff0000' : 'gray' },
                    ]}
                    placeholderTextColor="gray"
                    placeholder={t('dateofbirth')}
                    editable={false}
                    value={form.dob ? formatDate(form.dob) : ''}
                  />
                </Pressable>
                {formErrors[index]?.dob && (
                  <Text style={styles.errorText}>{formErrors[index].dob}</Text>
                )}

                {form.showPicker && (
                  <DateTimePicker
                    value={form.dob || new Date()}
                    mode="date"
                    onChange={(event, date) => handleDateChange(index, date)}
                    display="spinner"
                    maximumDate={new Date()}
                  />
                )}
              </View>

              <TextInput
                placeholderTextColor="gray"
                style={[
                  styles.input,
                  {
                    borderColor: formErrors[index]?.education
                      ? '#ff0000'
                      : 'gray',
                  },
                ]}
                placeholder={t('education')}
                value={form.education}
                onChangeText={value =>
                  handleInputChange(index, 'education', value)
                }
              />
              {formErrors[index]?.education && (
                <Text style={styles.errorText}>
                  {formErrors[index].education}
                </Text>
              )}

              <TextInput
                placeholderTextColor="gray"
                style={[
                  styles.input,
                  { borderColor: formErrors[index]?.job ? '#ff0000' : 'gray' },
                ]}
                placeholder={t('profession')}
                value={form.job}
                onChangeText={value => handleInputChange(index, 'job', value)}
              />
              {formErrors[index]?.job && (
                <Text style={styles.errorText}>{formErrors[index].job}</Text>
              )}

              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: formErrors[index]?.relationship
                      ? '#ff0000'
                      : 'gray',
                  },
                ]}>
                {/* <Picker
                style={[styles.input, { backgroundColor:"none" }]}
                selectedValue={form.relationship}
                onValueChange={value => handleRelationshipChange(index, value)}
                dropdownIconColor="gray"
                mode="dropdown">
                <Picker.Item
                  label="Select Relation / સંબંધ પસંદ કરો"
                  value=""
                  selectedValue
                  enabled={false}
                />
                <Picker.Item label="Father / પિતા" value="Father" />
                <Picker.Item label="Mother / માતા" value="Mother" />
                <Picker.Item label="Husband / પતિ" value="Husband" />
                <Picker.Item label="Wife / પત્ની" value="Wife" />
                <Picker.Item label="Son / પુત્ર" value="Son" />
                <Picker.Item label="Daughter / પુત્રી" value="Daughter" />
                <Picker.Item label="Grand son / પૌત્ર" value="Grand son" />
                <Picker.Item
                  label="Grand daughter / પૌત્રી"
                  value="Grand daughter"
                />
                <Picker.Item label="Brother / ભાઈ" value="Brother" />
                <Picker.Item label="Sister / બહેન" value="Sister" />
              </Picker> */}
                <Picker
                  style={[styles.input, { backgroundColor: "none", marginTop: 0 }]}
                  selectedValue={form.relationship}
                  onValueChange={value => handleRelationshipChange(index, value)}
                  dropdownIconColor="gray"
                  mode="dropdown">

                  <Picker.Item
                    label={t('selectrelation')}
                    value=""
                    selectedValue
                    enabled={true}
                  />

                  {relationshipData.map(item => (
                    <Picker.Item
                      // key={item.key}
                      label={`${item.value}`}
                      value={item.key}
                    />
                  ))}

                </Picker>
              </View>
              {formErrors[index]?.relationship && (
                <Text style={styles.errorText}>
                  {formErrors[index].relationship}
                </Text>
              )}

              <View
                style={[
                  styles.inputContainer,
                  {
                    borderColor: formErrors[index]?.maritalStatus
                      ? '#ff0000'
                      : 'gray',
                  },
                ]}>
                <Picker
                  style={[styles.input, { backgroundColor: "none", marginTop: 0 }]}
                  selectedValue={form.maritalStatus}
                  onValueChange={value => handleMaritalStatusChange(index, value)}
                  dropdownIconColor="gray"
                  mode="dropdown">
                  <Picker.Item
                    label={initialLabel}
                    value=""
                    selectedValue
                    enabled={true}
                  />
                  <Picker.Item label={unmarried} value="Unmarried" />
                  <Picker.Item label={married} value="Married" />
                  <Picker.Item label={widower} value="widower" />
                  <Picker.Item label={widow} value="Widow" />
                  <Picker.Item
                    label={divorcee}
                    value="Divorcee"
                  />
                </Picker>
              </View>
              {formErrors[index]?.maritalStatus && (
                <Text style={styles.errorText}>
                  {formErrors[index].maritalStatus}
                </Text>
              )}

              <View
                style={[
                  styles.gender,
                  {
                    borderColor: formErrors[index]?.gender ? '#ff0000' : 'gray',
                  },
                ]}>
                <Text style={styles.radioLabel}>{t('chooseyourgender')}</Text>
                <View style={styles.radioContainer}>
                  <Text style={styles.radioLabel}>{t('male')}</Text>
                  <RadioButton
                    value="male"
                    status={form.gender === 'male' ? 'checked' : 'unchecked'}
                    onPress={() => handleInputChange(index, 'gender', 'male')}
                    color="blue"
                  />

                  <Text style={styles.radioLabel}>{t('female')}</Text>
                  <RadioButton
                    value="female"
                    status={form.gender === 'female' ? 'checked' : 'unchecked'}
                    onPress={() => handleInputChange(index, 'gender', 'female')}
                    color="blue"
                  />

                  <Text style={styles.radioLabel}>{t('other')}</Text>
                  <RadioButton
                    value="other"
                    status={form.gender === 'other' ? 'checked' : 'unchecked'}
                    onPress={() => handleInputChange(index, 'gender', 'other')}
                    color="blue"
                  />
                </View>
              </View>
              {formErrors[index]?.gender && (
                <Text style={styles.errorText}>{formErrors[index].gender}</Text>
              )}
            </View>
          ))}
          <View style={styles.btngroup}>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: '#007bff', marginRight: 5 },
              ]}
              onPress={handleAddForm}>
              <Text style={styles.btntext}>{t('addform')}</Text>
            </Pressable>
            <Pressable
              style={[styles.button, { backgroundColor: '#4BB543', marginLeft: 5 }]}
              onPress={handleRegister}>
              <Text style={styles.btntext}>{t('submit')}</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
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

export default FamilyRegister;
