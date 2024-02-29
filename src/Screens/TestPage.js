import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DropdownAlert, { DropdownAlertProps } from 'react-native-dropdownalert';
import NotificationAndroid from '../context/NotificationAndroid';


function App() {
  const defaultSelected = {
    name: 'Android notification',
    color: '#1F89C7',
    alertProps: {
      dismissInterval: 0,
      updateStatusBar: false,
      children: <NotificationAndroid />,
    },
  };
  const [selected, setSelected] = useState(defaultSelected);
  useEffect(() => {
    // handleShowAlert();
  })
  const handleShowAlert = () => {
    alert.current(selected.alertProps);
  };

  return (
    <View style={styles.view}>
      <TouchableOpacity
        style={[styles.item, { backgroundColor: selected.color }]}
        onPress={handleShowAlert}
      >
        <Text style={styles.name}>Android notification</Text>
      </TouchableOpacity>
 
      <DropdownAlert alert={(func) => (alert.current = func)} {...selected.alertProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F3E9',
  },
  item: {
    padding: 12,
    borderRadius: 8,
    borderColor: 'black',
    borderWidth: StyleSheet.hairlineWidth,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'whitesmoke',
  },
});

export default App;
