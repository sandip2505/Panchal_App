import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import api from './api';
import LoadingPage from './LoadingPage';

const CommitteeMembers = () => {
  const [CommitteeData, setCommitteeData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAboutUs();
  }, []);

  const fetchAboutUs = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/committee_members');
      if (response.status === 200) {
        setIsLoading(true);
        const data = response.data;
        if (data) {
          setCommitteeData(data);
        }
        setIsLoading(false);
      } else {
        console.log('committee_members Request failed with status:', response.status);
        setIsLoading(false);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('An error occurred:', error);
      setIsLoading(false);
    }
  };

  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderCommitteeMembers = ({item}) => (
    <View style={styles.MemberContainer}>
      <View style={{paddingHorizontal: 10}}>
        <View>
          <Text style={styles.memberName}>{item?.fullname}</Text>
        </View>

        <View style={styles.detailsContainer}>
          <View style={[styles.innerContainer, {flexBasis: '35%'}]}>
            <Fontisto name="holiday-village" color="#333" size={17} />
            <Text style={styles.memberVillage}>{item?.village}</Text>
          </View>

          <View>
            <TouchableOpacity
              style={styles.innerContainer}
              activeOpacity={0.3}
              onPress={() => handleCall(item?.contact)}>
              <Ionicons name="call" size={17} color="#333" />
              <Text style={styles.memberContact}>{item?.mobile_number}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
          <LoadingPage />
      ) : (
        <FlatList
          data={CommitteeData}
          renderItem={renderCommitteeMembers}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default CommitteeMembers;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },

  MemberContainer: {
    backgroundColor: '#edf9ff',
    padding: 8,
    margin: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    shadowColor: 'black',
    elevation: 5,
  },

  memberName: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },

  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 25,
    paddingVertical: 10,
  },

  innerContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberVillage: {
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 10,
  },

  memberContact: {
    fontSize: 15,
    color: '#444',
    paddingHorizontal: 10,
  },
});
