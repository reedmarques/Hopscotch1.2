import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default class DataContainer extends Component {
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.element}>
          <Icon
            name='md-stopwatch'
            size={40}
            color='#cccccc'
          />
          <Text style={styles.text}>
            Calories: 60
          </Text>
        </View>
        <View style={styles.element}>
          <Icon
            name='md-trending-up'
            size={40}
            color='#cccccc'
          />
          <Text style={styles.text}>
            4.5 / 5.0
          </Text>
        </View>
        <View style={styles.element}>
          <Icon
            name='ios-stats'
            size={40}
            color='#cccccc'
          />
          <Text style={styles.text}>
            3
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:8,

  },
  element:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    margin:8,
  },
  text:{
    color:'#cccccc'
  }
})
