import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';

const TermsAndCondition = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.desContainer}>
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
            semper magna a fermentum consequat. Fusce consequat risus eu leo
            interdum, nec varius odio imperdiet. Vivamus id sagittis velit.
            Fusce consequat risus eu leo interdum, nec varius odio imperdiet.
          </Text>
          <Text style={styles.description}>
            Nullam placerat blandit tellus, ut tincidunt risus bibendum et.
            Etiam eget gravida mauris. Duis vel mi ut urna maximus viverra.
            Aliquam tincidunt eros sed nunc consectetur, eget tincidunt nisl
            mollis.
          </Text>
          <Text style={styles.description}>
            Aenean lobortis cursus magna, eget condimentum massa eleifend a.
            Duis et tincidunt est. Nulla interdum bibendum lacinia. In eget erat
            vel libero aliquet suscipit sed ut mi. Fusce nec velit eu ligula
            ullamcorper laoreet nec id leo.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndCondition;

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },

  desContainer: {
    padding: 20,
  },

  description: {
    fontSize: 16,
    textAlign: 'justify',
    marginBottom: 10,
    color: 'black',
  },
});
