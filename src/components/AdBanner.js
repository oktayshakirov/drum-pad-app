import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AdBanner = () => (
  <View style={styles.banner}>
    <Text style={styles.text}>Ad Banner Example</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 5,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1,
  },
});

export default AdBanner;
