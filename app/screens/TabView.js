import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  StackNavigator,
} from 'react-native';

import ScrollableTabView from 'react-native-scrollable-tab-view';
import Login from './Login';
import Register from './Register';
// import { Actions } from 'react-native-router-flux';


export default class TabView extends Component {
  render() {
    return (
      <ScrollableTabView style={styles.container}>
        <Login/>
        <Register/>

      </ScrollableTabView>
    );
  }
}


const styles = StyleSheet.create({
  container: {
  }

});
