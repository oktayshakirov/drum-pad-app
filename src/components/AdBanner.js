import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AdBanner = () => (
  <View style={styles.banner}>
    <Text style={styles.text}>Ad Banner</Text>
  </View>
);

const styles = StyleSheet.create({
  banner: {
    width: '95%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
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
