import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Button,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import { IMAGE_URL} from '@env';
import AgeCount from '../component/AgeCount';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import api from './api';
import { useTranslation, initReactI18next } from 'react-i18next';

const FamilyList = ({navigation, route}) => {
  const {userId} = route.params;
  const [isLoading, setIsLoading] = useState(false);
  const [ChildData, setChildData] = useState([]);
  const [mainData, setmainData] = useState([]);
  const [villageData, setVillageData] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    fetchVillagesData();
  }, []);

  const toggleDropdown = user => {
    setSelectedUser(selectedUser === user ? null : user);
    setIsDropdownOpen(selectedUser === user ? null : !isDropdownOpen);
  };

  const fetchVillagesData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/viewUser/${userId}`);
      
      if (response.status === 200) {
        setIsLoading(true);
        const data = response.data;
        setChildData(response.data.allUser);
        setmainData(response.data.User);
        setVillageData(response.data.villageData);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.log('viewUser id Request failed with status:', response.status);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('viewUser error occurred:', error);
    }
  };
  const parentsAge = AgeCount(mainData[0]?.dob);
  const formattedDate = moment(mainData[0]?.dob).format('DD/MM/YYYY');

  return (
    <ScrollView style={styles.container}>
      {mainData.length > 0 && (
        <View style={styles.MainContainer}>
          <View style={styles.mainItem}>
            {/* <Image
              source={
                mainData[0]?.photo
                  ? {uri: `${IMAGE_URL}/${mainData[0]?.photo}`}
                  : require('../assets/3135715.png')
              }
              alt="Profile"
              style={styles.mainImage}
              resizeMode="cover"
            /> */}
            <View style={styles.mainDetailsContainer}>
              <Text style={styles.mainName}>
                {mainData[0]?.firstname} {mainData[0]?.lastname}
              </Text>

              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('mobile')} : </Text>
                <Text style={styles.mainDetails}>
                  {mainData[0]?.mobile_number}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('dateofbirth')} : </Text>
                <Text style={styles.mainDetails}>{formattedDate} </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('age')} : </Text>
                <Text style={styles.mainDetails}>{parentsAge} years </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('gender')} : </Text>
                <Text style={styles.mainDetails}>{mainData[0]?.gender}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('education')} : </Text>
                <Text style={styles.mainDetails}>{mainData[0]?.education}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('city')} : </Text>
                <Text style={styles.mainDetails}>{mainData[0]?.city}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('state')} : </Text>
                <Text style={styles.mainDetails}>{mainData[0]?.state}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('pincode')} : </Text>
                <Text style={styles.mainDetails}>{mainData[0]?.pincode}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('village')} : </Text>
                <Text style={styles.mainDetails}>
                  {villageData ? villageData[0]?.village : '-'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.Mainlabel}>{t('address')} : </Text>
                <Text style={styles.mainDetails}>
                  {villageData ? mainData[0]?.address : '-'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {isLoading ? (
        <View style={{paddingTop: 20}}>
          <ActivityIndicator size="large" color="#00a9ff" />
        </View>
      ) : ChildData.length > 0 ? (
        <View style={styles.MainContainer}>
          <Text style={styles.familyTitle}>{t('familyMembers')} :</Text>
          {ChildData.map(user => {
            const childAge = AgeCount(user?.dob);
            const formattedDate = moment(user?.dob).format('DD/MM/YYYY');

            return (
              <View style={styles.familyItem} key={user?._id}>
                <ScrollView>
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => toggleDropdown(user)}
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <Text style={styles.FamilyName}>
                      {user.firstname} {user.lastname} ( {user.relationship} )
                    </Text>
                    <MaterialCommunityIcons
                      name={isDropdownOpen ? 'chevron-right' : 'chevron-down'}
                      size={30}
                      color="#666"
                    />
                  </TouchableOpacity>
                  {selectedUser === user && (
                    <View style={styles.dropdownContent}>
                      <View style={styles.row}>
                        <Text style={styles.familylabel}>{t('dateofbirth')} : </Text>
                        <Text style={styles.familyDetails}>
                          {formattedDate}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.familylabel}>{t('age')} : </Text>
                        <Text style={styles.familyDetails}>
                          {childAge} years{' '}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.familylabel}>{t('profession')} : </Text>
                        <Text style={styles.familyDetails}>{user.job}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.familylabel}>
                          {t('maritalstatus')} :{' '}
                        </Text>
                        <Text style={styles.familyDetails}>
                          {user.marital_status}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.familylabel}>{t('education')} : </Text>
                        <Text style={styles.familyDetails}>
                          {user.education}
                        </Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.familylabel}>{t('gender')} : </Text>
                        <Text style={styles.familyDetails}>{user.gender}</Text>
                      </View>
                      <View style={styles.row}>
                        <Text style={styles.familylabel}>{t('relationship')} : </Text>
                        <Text style={styles.familyDetails}>
                          {user.relationship}
                        </Text>
                      </View>
                    </View>
                  )}
                </ScrollView>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.blankcontainer}>
          <Text style={styles.blank}>
            {t('familymembersarenotavailable')}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
  },

  MainContainer: {
    padding: 20,
  },

  mainItem: {
    backgroundColor: '#edf9ff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  mainImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginHorizontal: 8,
  },

  mainDetailsContainer: {
    padding: 10,
    flexBasis: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },

  mainName: {
    color: 'black',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'capitalize',
    paddingVertical: 5,
    width: '69%',
  },

  Mainlabel: {
    alignItems: 'flex-start',
    flexBasis: '50%',
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  mainDetails: {
    flexBasis: '45%',
    fontSize: 14,
    color: '#444',
    textTransform: 'capitalize',
  },

  familyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#515151',
  },

  familyItem: {
    backgroundColor: '#edf9ff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  FamilyName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'capitalize',
    flexBasis: '90%',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  familylabel: {
    alignItems: 'flex-start',
    flexBasis: '50%',
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  familyDetails: {
    flexBasis: '45%',
    fontSize: 14,
    color: '#444',
    textTransform: 'capitalize',
  },

  dropdownContent: {
    paddingVertical: 10,
  },

  familyDetailsContainer: {
    flex: 1,
  },

  blankcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  blank: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    width: '90%',
  },
});

export default FamilyList;
