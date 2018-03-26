import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class OrderItem extends Component {

  drinkPressed = (drink) => {
    this.props.navigation.navigate('ItemDetails', { ...drink });
  };

  render() {
    // let drink = {drink}
    return (
      <TouchableHighlight
        style={[styles.container,{borderColor:this.props.themeColor}]}
        onPress={() => this.drinkPressed(this.props.drink)}
        >
        <View style={styles.container1}>
          {/* <View style={styles.nameView}> */}
            <Text style={styles.name}>
              {this.props.drinkName}
            </Text>
          {/* </View> */}
          <View style={styles.priceView}>
            <Text style={styles.price}>
              {this.props.drinkPrice}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    margin:6,
    width: Dimensions.get('window').width/3 - 14,
    height: Dimensions.get('window').width/3 - 14,
    // backgroundColor:'#95a5a6',
    // borderColor:'#1bbc9b',
    borderWidth:3,
    // borderRadius:40,

  },
  container1:{
    flex:1,
    justifyContent:'space-between',
    alignItems:'stretch',

    // backgroundColor:'red'
  },
  name:{
    color:'#cccccc',
    // backgroundColor:'red',
    padding:4,
    fontSize:15,
    fontWeight:"500",
  },
  nameView:{
    flex:1
  },
  price:{
    color:'#cccccc',
    padding:8,
    fontWeight:"200",
  },
  priceView:{
    alignItems:'flex-end',
    // backgroundColor:'green'

  },
})

export default OrderItem;
