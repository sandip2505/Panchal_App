import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import AgeCount from '../component/AgeCount';
import CustomModal from '../component/CustomModal';
import { showToast } from '../component/CustomToast';
import api from './api';
const FamilyDetailsPage = () => {
  const [parentsData, setParentsData] = useState(null);
  const [childData, setChildData] = useState([]);
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const value = await AsyncStorage.getItem('userData');
        if (value) {
          const parentsData = JSON.parse(value);
          setParentsData(parentsData);
        } else {
          console.log('No user data found');
        }
      } catch (error) {
        console.log('Error retrieving user data:', error);
      }
    };

    const getChildData = async () => {
      try {
        const value = await AsyncStorage.getItem('childData');
        if (value) {
          const childData = JSON.parse(value);
          setChildData(childData);
        } else {
          console.log('No child data found');
        }
      } catch (error) {
        console.log('Error retrieving child data:', error);
      }
    };

    getData();
    getChildData();
  }, []);

  const DeleteFamilyMember = async (id) => {
    try {
      const response = await api.post(`/user-delete/${id}`);
      if (response.status === 200) {
        AsyncStorage.removeItem('childData').then(() => {

          const familyData = JSON.stringify(response.data.familyData);
          AsyncStorage.setItem('childData', familyData).then(() => {
          });
        });
        showToast(
          'error',
          'Data deleted successfully.',
          'ડેટા  કાઢી નાખ્યું.',
          2500,
        );
        navigation.navigate('ProfilePage');
      } else {
        console.log('user-delete Request failed with status:', response.status);
      }
    } catch (error) {
      console.error(error, "error")
    }
  }
  const renderParentDetails = () => {
    if (!parentsData) {
      return null;
    }
    const formattedDate = moment(parentsData?.dob).format('DD/MM/YYYY');
    const parentsAge = AgeCount(parentsData?.dob);

    return (
      <>
        <View style={[styles.MainContainer, { marginBottom: 30 }]}>
          <View style={styles.familyItem}>
            <Pressable
              style={styles.EditIcon}
              onPress={() =>
                navigation.navigate('EditMainDetails', {
                  mainId: parentsData?._id,
                })
              }>
              <MaterialCommunityIcons
                name="account-edit"
                size={30}
                color="#00000090"
              />
            </Pressable>

            <View style={styles.dropdownContent}>
              <View>
                <Text style={styles.FamilyName}>
                  {parentsData?.firstname} {parentsData?.lastname}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text style={styles.familylabel}>Name : </Text>
              <Text style={styles.familyDetails}>
                {parentsData?.lastname} {parentsData?.firstname} {parentsData?.middlename}{' '}

              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.familylabel}>Personal ID : </Text>
              <Text style={styles.familyDetails}>
                {parentsData?.personal_id}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.familylabel}>Date of birth : </Text>
              <Text style={styles.familyDetails}>{formattedDate}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.familylabel}>Age : </Text>
              <Text style={styles.familyDetails}>{parentsAge} years</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.familylabel}>Gender :</Text>
              <Text style={styles.familyDetails}>{parentsData?.gender}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.familylabel}>Education : </Text>
              <Text style={styles.familyDetails}>{parentsData?.education}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.familylabel}>Profession :</Text>
              <Text style={styles.familyDetails}>{parentsData?.job}</Text>
            </View>
          </View>
        </View>
      </>
    );
  };

  const renderChildDetails = () => {
    return childData.length !== 0 ? (
      childData.map((child, index) => {
        const childAge = AgeCount(child?.dob);
        const formattedDate = moment(child?.dob).format('DD/MM/YYYY');
        return (
          <View key={index} style={styles.MainContainer}>
            <View style={styles.familyItem}>
              <Pressable
                style={styles.EditIcon}
                onPress={() =>
                  navigation.navigate('EditFamilyDetails', {
                    childId: child && child?._id,
                  })
                }>
                <MaterialCommunityIcons
                  name="account-edit-outline"
                  size={30}
                  color="#00000090"
                />
              </Pressable>


              <View style={styles.dropdownContent}>
                <View style={styles.headingRelation}>
                  <Text style={styles.FamilyName}>
                    {child && child?.relationship}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.familylabel}>Name : </Text>
                <Text style={styles.familyDetails}>
                  {child &&
                    child?.lastname +
                    ' ' +
                    child?.firstname +
                    ' ' +
                    child?.middlename}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.familylabel}>Date of birth : </Text>
                <Text style={styles.familyDetails}>{formattedDate}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.familylabel}>Age : </Text>
                <Text style={styles.familyDetails}>{childAge} years</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.familylabel}>Gender :</Text>
                <Text style={styles.familyDetails}>
                  {child && child?.gender}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.familylabel}>Education : </Text>
                <Text style={styles.familyDetails}>
                  {child && child?.education}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.familylabel}>Profession :</Text>
                <Text style={styles.familyDetails}>{child && child?.job}</Text>
              </View>
              <View style={styles.DeleteIcon}>
                <Pressable
                  // onPress={() => DeleteFamilyMember(child && child?._id)}
                  onPress={() => setShowModal(true)}>
                  <MaterialCommunityIcons
                    name="delete"
                    size={30}
                    color="#ff0000"
                  />
                </Pressable>
              </View>
            </View>
            {showModal && (
              <CustomModal
                showModal={showModal}
                setShowModal={setShowModal}
                onConfirm={() => DeleteFamilyMember(child && child?._id)}
                Title={`Confirm Delete ?`}
                Message={`Are you sure you want to delete ?`}
              />
            )}
          </View>

        );
      })
    ) : (
      <View style={styles.blankcontainer}>
        <Text style={styles.blank}>Family members are not available...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {renderParentDetails()}
        {renderChildDetails()}
        {childData.length < 7 && (
          <Pressable
            style={styles.btn}
            onPress={() =>
              navigation.navigate('FamilyRegister', {
                userId: parentsData?._id,
              })
            }>
            <MaterialCommunityIcons name="plus" size={25} color="#fff" />
            <Text style={styles.btnText}> Add new family Members</Text>
          </Pressable>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  MainContainer: {
    padding: 15,
  },

  familyItem: {
    backgroundColor: '#edf9ff',
    padding: 12,
    borderRadius: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  dropdownContent: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  EditIcon: {
    position: 'absolute',
    right: 7,
    top: 7,
  },
  DeleteIcon: {
    //  : 'absolute',
    // display: "flex",
    // justifyContent: "end",
    right: 7,
    top: 7,
    left: 280,
  },

  FamilyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textTransform: 'capitalize',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },

  familylabel: {
    alignItems: 'flex-start',
    flexBasis: '45%',
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },

  familyDetails: {
    flexBasis: '55%',
    fontSize: 14,
    color: '#444',
    textTransform: 'capitalize',
  },

  container: {
    backgroundColor: '#fff',
    height: '100%',
    width: '100%',
    paddingVertical: 20,
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

  btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0083ff',
    borderRadius: 8,
    padding: 10,
    margin: 10,
    flexDirection: 'row',
  },

  btnText: {
    color: '#fff',
    fontSize: 20,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default FamilyDetailsPage;
