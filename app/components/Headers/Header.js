import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
// import { NavigationActions } from 'react-navigation';

export default class Header extends Component {

  render() {
    // const backAction = NavigationActions.back({
    //   key: 'OrderTypes'
    // })
    return(
      <View>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
            >
            <Icon
              style={styles.menuBtn}
              name={`${this.props.leftIconName}`}
              size={30}
              color="#f92222"
            />
          </TouchableOpacity>
          {/* Change to image eventually */}
          <Text style={styles.title}>{this.props.title}</Text>
          <TouchableOpacity>
            <Icon
              style={styles.menuBtn}
              name={`${this.props.rightIconName}`}
              // source={require('../../images/menu2.png')}
              size={30}
              color={this.props.rightIconName=='md-heart' ? '#f92222' : "transparent"}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    height: 64,
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#3A3D42',
    paddingHorizontal:8,
  },
  title: {
    color:'#cccccc',
    fontSize:20,
    // paddingTop:8,
    justifyContent:'center',
    alignItems:'center',
    // backgroundColor:'red'
  },
  menuBtn:{
    paddingHorizontal:8,
    paddingTop:8,
    justifyContent:'center',
    alignItems:'center',
  },
})
