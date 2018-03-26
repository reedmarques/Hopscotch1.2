import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';

import { CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CartBoostView extends Component {
  render() {
    return(
      <View style={styles.container}>
        <CheckBox
          containerStyle={styles.checkbox}
          center
          iconRight
          checked
          title='boozt for $3.5?'
          textStyle={styles.text}
          iconType='ionicon'
          uncheckedIcon='ios-square-outline'
          checkedIcon='ios-checkbox'
          checkedColor='#f92222'

        />
        {/* <View style={styles.horizContainer}>
          <Text style={styles.subtotal}>
            boozt for $3.5?
          </Text>
          <CheckBox
          />
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:0.5,
    backgroundColor:'#3A3D42',
    justifyContent:'center',
    marginBottom:8,
    // alignItems:'center'
  },
  horizContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:8,
    // backgroundColor:'red',

  },
  checkbox:{
    backgroundColor:'#3A3D42'
  },
  element:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    margin:8,
  },
  text:{
    color:'#cccccc'
  },
  price:{
    paddingRight:8,
    color:'#cccccc'
  },
  buttonGroup:{
    flex:1,
  }
})
