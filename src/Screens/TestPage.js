import React, { Component } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ActivityIndicator } from 'react-native';

export default class TestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  handleDownload = () => {
    this.setState({ isLoading: true });

    // Simulate a 10-second loading process
    setTimeout(() => {
      // Set isLoading to false after 10 seconds
      this.setState({ isLoading: false });

      // Perform your download logic here (e.g., call a function to download the file)
      // Replace the following line with your actual download logic
      console.log('Download successful');
    }, 10000);
  };

  render() {
    const { isLoading } = this.state;

    return (
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>invoice :</Text>
          <TouchableOpacity
            style={[styles.dlfamilybtn, isLoading && styles.disabledButton]}
            onPress={this.handleDownload}
            activeOpacity={0.6}
            disabled={isLoading}>
            {isLoading ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
              </>
            ) : (
              <Text style={styles.dlbtntext}>Download</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  disabledButton: {
    backgroundColor: '#68b300',
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

  dlfamilybtn: {
    height: 35,
    backgroundColor: '#68b300',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'gray',
    elevation: 3,
    width: '48%',
  },

  dlbtntext: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
})
