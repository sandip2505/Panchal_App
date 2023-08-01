import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AppState} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import AgeCount from '../component/AgeCount';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import axios from 'axios';
import {API_BASE_URL, API_KEY, IMAGE_URL} from '@env';
import moment from 'moment';
import {showToast} from '../component/CustomToast';

const ProfilePage = () => {
  const navigation = useNavigation();
  const [parentsData, setParentsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [villageData, setVillageData] = useState([]);
  const [image, setImage] = useState(null);

  // Get items from asyncStorage
  useEffect(() => {
    // Get userData
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

    // Get village data
    const location = AsyncStorage.getItem('villageData')
      .then(value => {
        if (value) {
          const villageData = JSON.parse(value);
          setVillageData(villageData);
        }
      })
      .catch(error => {
        console.log('Error in profile page : ', error);
      });
  }, []);

  const age = AgeCount(parentsData && parentsData?.dob);
  const formattedDate = moment(parentsData && parentsData?.dob).format(
    'DD/MM/YYYY',
  );

  const selectImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        cropperCircleOverlay: true,
      });

      const userData = new FormData();
      const imagePath = image.path;
      const fileName = imagePath.substring(imagePath.lastIndexOf('/') + 1);
      userData.append('image', {
        uri: image.path,
        type: image.mime,
        name: fileName,
      });

      try {
        setIsLoading(true);
        const response = await axios
          .post(`${API_BASE_URL}/profile_image/${parentsData?._id}`, userData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
            },
          })
          .then(response => {
            AsyncStorage.removeItem('userData').then(() => {
              setIsLoading(true);
              console.log('remove');
              setParentsData('');
              const userData = JSON.stringify(response.data);
              AsyncStorage.setItem('userData', userData);
              navigation.navigate('HomePage');
              navigation.navigate('ProfilePage');
              showToast('success', 'Profile image updated successfully.','પ્રોફાઇલ ફોટો સફળતાપૂર્વક અપડેટ થઈ ગયો.', 2500);
              setIsLoading(false);
            });
          });
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.log('Error sending image to API:', err);
      }
    } catch (error) {
      setIsLoading(false);
      console.log('ImagePicker Error:', error);
    }
  };

  return (
    <View style={styles.maincontainer}>
      <View style={styles.container}>
        <View style={styles.img}>
          <Pressable onPress={selectImage}>
            <View style={styles.imageContainer}>
              {isLoading ? (
                <View>
                  <ActivityIndicator size="large" color="#00a9ff" />
                </View>
              ) : parentsData?.photo ? (
                <View style={styles.imageIconContainer}>
                  <Image
                    source={{uri: `${IMAGE_URL}/${parentsData?.photo}`}}
                    alt="profile"
                    style={styles.image}
                  />
                  <Text style={styles.imageIcon}>
                    <MaterialCommunityIcons
                      name="account-edit-outline"
                      size={30}
                      color="#fff"
                    />
                  </Text>
                </View>
              ) : (
                <View style={styles.imageIconContainer}>
                  <Image
                    source={require('../assets/3135715.png')}
                    alt="profile"
                    style={styles.image}
                  />
                  <Text style={styles.imageIcon}>
                    <MaterialCommunityIcons
                      name="camera-plus-outline"
                      size={25}
                      color="#fff"
                    />
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.main}>
          <Text style={styles.name}>
            {parentsData &&
              parentsData?.firstname + ' ' + parentsData?.lastname}
          </Text>
          <Text style={styles.personal_id}>
            {parentsData && parentsData?.personal_id}
          </Text>
        </View>

        <ScrollView>
          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Date of birth :</Text>
              <Text style={styles.userInfo}>
                {formattedDate} ( {age} years )
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Mobile No. :</Text>
              <Text style={styles.userInfo}>
                {parentsData && parentsData?.mobile_number}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Education :</Text>
              <Text style={styles.userInfo}>
                {parentsData && parentsData?.education}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Gender :</Text>
              <Text style={styles.userInfo}>
                {parentsData && parentsData?.gender}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Profession :</Text>
              <Text style={styles.userInfo}>
                {parentsData && parentsData?.job}
              </Text>
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Village :</Text>
              <Text style={styles.userInfo}>
                {villageData ? villageData[0]?.village : '-'}
              </Text>
            </View>
          </View>
          <View style={styles.details}>
            <View style={styles.row}>
              <Text style={styles.label}>Address :</Text>
              <Text style={styles.userInfo}>
                {parentsData && parentsData?.address}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.btncontainer}>
          <TouchableOpacity
            style={styles.familybtn}
            onPress={() => navigation.navigate('FamilyDetailsPage')}
            activeOpacity={0.6}>
            <Text style={styles.btntext}>Family Members</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutbtn}
            onPress={() => navigation.navigate('ChangePassword')}
            activeOpacity={0.6}>
            <Text style={styles.btntext}>Change Password</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 25,
    width: '100%',
  },

  imageContainer: {
    borderRadius: 100,
    backgroundColor: '#fff',
    overflow: 'hidden',
    // borderWidth: 1,
    elevation: 10, 
    shadowColor: '#000',
  },

  image: {
    width: 150,
    height: 150,
  },

  imageIconContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  imageIcon: {
    width: '100%',
    height: 35,
    color: 'red',
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
    backgroundColor: '#00000080',
  },

  main: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 15,
  },

  name: {
    fontSize: 20,
    color: 'black',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  personal_id: {
    fontSize: 17,
    color: 'black',
    textTransform: 'capitalize',
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
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  label: {
    alignItems: 'flex-start',
    flexBasis: '40%',
    fontSize: 17,
    color: 'black',
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  userInfo: {
    alignItems: 'flex-start',
    flexBasis: '60%',
    fontSize: 17,
    color: 'black',
    fontWeight: '400',
    textTransform: 'capitalize',
  },

  btncontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingVertical: 15,
    justifyContent: 'space-between',
  },

  familybtn: {
    height: 50,
    backgroundColor: '#68b300',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    elevation: 3,
    width: '48%',
  },

  logoutbtn: {
    height: 50,
    backgroundColor: '#ff0000',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    elevation: 3,
    width: '48%',
  },

  btntext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    // textTransform: 'uppercase',
  },
});

export default ProfilePage;
