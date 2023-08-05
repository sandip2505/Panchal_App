import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Pressable,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import {API_BASE_URL, API_KEY} from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {RadioButton} from 'react-native-paper';
import {showToast} from '../component/CustomToast';

const CustomDateField = props => {
  return (
    <View style={styles.dateFieldContainer}>
      <DateField {...props} />
    </View>
  );
};

const FamilyRegister = ({route}) => {
  const {userId} = route.params;

  const navigation = useNavigation();

  const _id = userId;
  const [parentsData, setParentsData] = useState(null);
  const [checkpayment, setCheckpayment] = useState(null);
  // console.log(parentsData?.payment_id, 'parentsData');
  // console.log(checkpayment?.payment_id, 'checkpayment');

  useEffect(() => {
    const final = AsyncStorage.getItem('userData')
      .then(value => {
        if (value) {
          const userData = JSON.parse(value);
          setParentsData(userData);
        }
      })
      .catch(error => {
        console.log('Error in profile page : ', error);
      });

    const PerentsData = AsyncStorage.getItem('PerentsData')
      .then(value => {
        if (value) {
          const PerentsData = JSON.parse(value);
          setCheckpayment(PerentsData);
        }
      })
      .catch(error => {
        console.log('Error in profile page : ', error);
      });
  }, []);

  const [forms, setForms] = useState([
    {
      firstname: '',
      middlename: '',
      lastname: '',
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
  const [lastname, setLastname] = useState('');
  const [dob, setDob] = useState('');
  // const [showPicker, setShowPicker] = useState(false);
  const [gender, setGender] = useState('');
  const [education, setEducation] = useState('');
  const [relationship, setRelationship] = useState('');
  const [job, setJob] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  // validation
  const [formErrors, setFormErrors] = useState([]);

  const [open, setOpen] = useState(false);

  const isFormValid = form => {
    const errors = {};

    if (form.firstname.length <= 0) {
      errors.firstname = 'Please enter firstname';
    }

    if (form.middlename.length <= 0) {
      errors.middlename = 'Please enter middlename';
    }

    if (form.lastname.length <= 0) {
      errors.lastname = 'Please enter lastname';
    }

    if (form.dob === null) {
      errors.dob = 'Please select date of birth';
    }

    if (form.education.length <= 0) {
      errors.education = 'Please enter education';
    }

    if (form.job.length <= 0) {
      errors.job = 'Please enter job';
    }

    if (form.gender.length <= 0) {
      errors.gender = 'Please choose gender';
    }

    if (form.relationship == '') {
      errors.relationship = 'Please choose relation';
    }

    if (form.maritalStatus.length <= 0) {
      errors.maritalStatus = 'Please choose marital status';
    }

    return errors;
  };

  const validateForms = () => {
    const errorsList = forms.map(form => isFormValid(form));
    setFormErrors(errorsList);
    return errorsList.every(errors => Object.keys(errors).length === 0);
  };

  // const handleDateChange = (event, selectedDate) => {
  //   setShowPicker(false);
  //   if (selectedDate) {
  //     setDob(selectedDate);
  //   }
  // };

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

      console.log(childData.length);

      const maxFormsAllowed = Math.max(7 - childData.length);
      console.log(maxFormsAllowed, '<- - - - - maxFormsAllowed');
      console.log(forms.length, '<= = = = formsLength');
      if (forms.length >= maxFormsAllowed) {
        showToast(
          'error',
          `You can't add more than 7 forms.`,
          'તમે ૭ થી વધારે ફોર્મ ના ઉમેરી શકો.',
          2500,
        );

        return;
      }

      const newForm = {
        firstname: '',
        middlename: '',
        lastname: '',
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
        'Fill the data to add new form.',
        'નવું ફોર્મ ઉમેરવા માટે તમામ માહિતી ભરો.',
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
        lastname,
        dob,
        gender,
        education,
        relationship,
        job,
        maritalStatus,
      };
      setForms([newForm]);
      axios
        .post(`${API_BASE_URL}/addchildUser/${_id}`, forms)
        .then(response => {
          console.log('Registration successful:', response.data.familyData);
          AsyncStorage.removeItem('childData').then(() => {
            console.log('child remove');
            const familyData = JSON.stringify(response.data.familyData);
            AsyncStorage.setItem('childData', familyData).then(() => {
              console.log('new child store');
            });
          });
          showToast(
            'success',
            'Data registerd successfully.',
            'ડેટા સફળતાપૂર્વક રજીસ્ટર થઈ ગયા.',
            2500,
          );

          navigation.navigate('ProfilePage');
          setFirstname('');
          setMiddlename('');
          setLastname('');
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
        'Please fill all the required fields !',
        'કૃપા કરીને તમામ જરૂરી માહિતી ભરો.',
        2500,
      );
    }
  };

  const formatDate = date => {
    const formattedDate = new Date(date);
    const options = {year: 'numeric', month: 'long', day: 'numeric'};
    return formattedDate.toLocaleDateString(undefined, options);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}> Family Members </Text>
      <ScrollView>
        {forms.map((form, index) => (
          <View key={index}>
            <View style={styles.header}>
              <Text style={styles.title}> Form - {index + 1} </Text>
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
              placeholder="First Name / પોતાનું નામ"
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
              placeholder="Middle Name / પિતાનું અથવા પતિનું નામ"
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

            <TextInput
              placeholderTextColor="gray"
              style={[
                styles.input,
                {borderColor: formErrors[index]?.lastname ? '#ff0000' : 'gray'},
              ]}
              placeholder="Last Name / અટક"
              value={form.lastname}
              onChangeText={value =>
                handleInputChange(index, 'lastname', value)
              }
            />
            {formErrors[index]?.lastname && (
              <Text style={styles.errorText}>{formErrors[index].lastname}</Text>
            )}

            <View>
              <Pressable onPress={() => handleToggleDatePicker(index)}>
                <TextInput
                  style={[
                    styles.input,
                    {borderColor: formErrors[index]?.dob ? '#ff0000' : 'gray'},
                  ]}
                  placeholderTextColor="gray"
                  placeholder="Date of birth / જન્મ તારીખ"
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
              placeholder="Education / ભણતર"
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
                {borderColor: formErrors[index]?.job ? '#ff0000' : 'gray'},
              ]}
              placeholder="Profession / વ્યવસાય"
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
              <Picker
                style={[styles.input, {marginTop: 0}]}
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
                style={[styles.input, {marginTop: 0}]}
                selectedValue={form.maritalStatus}
                onValueChange={value => handleMaritalStatusChange(index, value)}
                dropdownIconColor="gray"
                mode="dropdown">
                <Picker.Item
                  label="Marital status / વૈવાહિક સ્ટેટસ"
                  value=""
                  selectedValue
                  enabled={false}
                />
                <Picker.Item label="Unmarried / અપરિણીત" value="Unmarried" />
                <Picker.Item label="Married / પરિણીત" value="Married" />
                <Picker.Item label="widower / વિધુર" value="widower" />
                <Picker.Item label="Widow / વિધવા" value="Widow" />
                <Picker.Item
                  label="Divorcee / છૂટાછેડા લેનાર"
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
              <View style={styles.radioContainer}>
                <Text style={styles.radioLabel}>Male / પુરૂષ</Text>
                <RadioButton
                  value="male"
                  status={form.gender === 'male' ? 'checked' : 'unchecked'}
                  onPress={() => handleInputChange(index, 'gender', 'male')}
                  color="blue"
                />

                <Text style={styles.radioLabel}>Female / સ્ત્રી</Text>
                <RadioButton
                  value="female"
                  status={form.gender === 'female' ? 'checked' : 'unchecked'}
                  onPress={() => handleInputChange(index, 'gender', 'female')}
                  color="blue"
                />

                <Text style={styles.radioLabel}>Other / અન્ય</Text>
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
              {backgroundColor: '#007bff', marginRight: 5},
            ]}
            onPress={handleAddForm}>
            <Text style={styles.btntext}>Add Form</Text>
          </Pressable>
          <Pressable
            style={[styles.button, {backgroundColor: '#4BB543', marginLeft: 5}]}
            onPress={handleRegister}>
            <Text style={styles.btntext}>Submit</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f1f1f1',
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
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 16,
    borderRadius: 6,
    color: 'black',
    paddingHorizontal: 8,
  },

  btngroup: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 10,
  },

  button: {
    height: 50,
    width: '45%',
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
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
    height: 45,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    marginTop: 16,
    justifyContent: 'center',
  },

  gender: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    borderWidth: 1,
    borderRadius: 6,
    marginTop: 16,
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
