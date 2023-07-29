import React, {useState, useEffect} from 'react';
import {Pressable} from 'react-native';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {API_BASE_URL, API_KEY} from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {showToast} from '../component/CustomToast';

const FirstForm = () => {
  const navigation = useNavigation();
  const [locations, setLocations] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchVillagesData();
  }, []);

  const fetchVillagesData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/location`);
      if (response.status === 200) {
        const data = response.data;
        setOptions(data);
        // setIsLoading(false);
      } else {
        console.log('Request failed with status:', response.status);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };

  const handleRegister = () => {
    setLocations('');
    if (locations === '') {
      showToast('error', 'Select your village / તમારું ગામ પસંદ કરો.', 2500);
    } else {
      navigation.navigate('RegisterForm', {locations_id: locations});
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* <Text style={styles.title}>Register Form</Text> */}
        <View style={styles.inputContainer}>
          <Picker
            style={styles.input}
            selectedValue={locations}
            onValueChange={itemValue => setLocations(itemValue)}
            dropdownIconColor="gray">
            <Picker.Item
              label="Select your village / તમારું ગામ પસંદ કરો"
              value=""
              selectedValue
              enabled={false}
            />
            {options.map(option => (
              <Picker.Item
                key={option._id}
                label={option.village}
                value={option._id}
              />
            ))}
          </Picker>
        </View>
        <View>
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.btntext}>Next</Text>
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
    backgroundColor: '#fff',
  },
  // title: {
  //     fontSize: 25,
  //     fontWeight: "bold",
  //     textAlign: 'center',
  //     marginBottom: 16,
  //     color: '#515151',
  //     textTransform: "uppercase"
  // },

  inputContainer: {
    height: 45,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    marginBottom: 16,
    justifyContent: 'center',
  },

  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 4,
    color: 'black',
    paddingHorizontal: 8,
  },

  button: {
    height: 50,
    backgroundColor: '#00a9ff',
    borderRadius: 4,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btntext: {
    color: 'white',
    fontSize: 20,
    textTransform: 'uppercase',
  },
});

export default FirstForm;
