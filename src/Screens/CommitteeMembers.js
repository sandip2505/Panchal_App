import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React from 'react';
import Fontisto from 'react-native-vector-icons/dist/Fontisto';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';

const CommitteeMembers = () => {
  
  const CommitteeData = [
    {
      name: 'પંચાલ ત્રિકમભાઈ શિવાભાઈ - પ્રમુખશ્રી',
      village: 'નિરમાલી',
      contact: '9898135661',
    },
    {
      name: 'પંચાલ ભરતભાઈ કાંતીભાઈ - ઉપ પ્રમુખશ્રી',
      village: 'દેરોલી',
      contact: '9913813203',
    },
    {
      name: 'પંચાલ મનીષ અંબાલાલ - મંત્રીશ્રી',
      village: 'દેરોલી',
      contact: '9427624676',
    },
    {
      name: 'પંચાલ રમેશભાઈ કાળીદાસ - સહ મંત્રીશ્રી',
      village: 'સુલતાનપુર',
      contact: '9426952621',
    },
    {
      name: 'પંચાલ મનુભાઈ શિવાભાઈ - ખજાનચી',
      village: 'ડેમાઈ',
      contact: '9426633737',
    },
    {
      name: 'પંચાલ રમણભાઈ ડાહ્યાભાઈ - કારોબારી સભ્ય',
      village: 'સોનીપુરા',
      contact: '9974158794',
    },
    {
      name: 'પંચાલ બાબુભાઈ કાંહ્યાભાઈ - કારોબારી સભ્ય',
      village: 'વઘાસ',
      contact: '9909706357',
    },
    {
      name: 'પંચાલ કીરીટભાઈ જયંતિભાઈ - કારોબારી સભ્ય',
      village: 'શિહોરા',
      contact: '8160052840',
    },
    {
      name: 'પંચાલ મુકુન્દ ચંદુભાઈ - કારોબારી સભ્ય',
      village: 'ઝંડા',
      contact: '7874103503',
    },
    {
      name: 'પંચાલ દિપક મુકુન્દલાલ - કારોબારી સભ્ય',
      village: 'સેલગઢ',
      contact: '9924381985',
    },
    {
      name: 'પંચાલ જશવંતલાલ મંગળદાસ - કારોબારી સભ્ય',
      village: 'બોરોલ',
      contact: '9377251563',
    },
  ];

  const handleCall = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderCommitteeMembers = ({item}) => (
    <>
      <View style={styles.MemberContainer}>
        <View style={{paddingHorizontal: 10}}>
          <View /* style={styles.nameContainer} */>
            <Text style={styles.memberName}>{item?.name}</Text>
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
                <Text style={styles.memberContact}>{item?.contact}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </>
  );

  return (
    <FlatList
      data={CommitteeData}
      renderItem={renderCommitteeMembers}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
    />
  );
};

export default CommitteeMembers;

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
  },

  MemberContainer: {
    backgroundColor: '#edf9ff',
    padding: 8,
    marginVertical: 6,
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
