import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as firebase from 'firebase';
import font from './fonts';
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCRdtfPQGC3z9aVd9N6wSO1NsPzrCZlnm0",
  authDomain: "traktorplace-1565009856384.firebaseapp.com",
  databaseURL: "https://traktorplace-1565009856384.firebaseio.com",
  projectId: "traktorplace-1565009856384",
  storageBucket: "traktorplace-1565009856384.appspot.com",
  messagingSenderId: "923969830123",
  appId: "1:923969830123:android:f6cf897bf5c804c4"
};

firebase.initializeApp(firebaseConfig);
// Initialize Firebase

import AppNavigator from './navigation/AppNavigator';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadFont: false,
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'TTCommons-DemiBold': require('./assets/fonts/TTCommons-DemiBold.ttf'),
      'TTCommons-Regular': require('./assets/fonts/TTCommons-Regular.ttf'),
      'TTCommons-Bold': require('./assets/fonts/TTCommons-Bold.ttf'),
      'TTCommons-Black': require('./assets/fonts/TTCommons-Black.ttf'),
      'TTCommons-Medium': require('./assets/fonts/TTCommons-Medium.ttf'),
    })
    .then(() => {
        this.setState({ loadFont: true });
    });
  }
  render() {
    if(this.state.loadFont == true) {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      )
    }
    else {
      return <View></View>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
