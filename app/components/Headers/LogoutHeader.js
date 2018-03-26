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

export default class LogoutHeader extends Component {

  state = {
    first:'',
    last:''
  }

  // componentWillMount(){
  //   this.setState({first:this.props.first,last:this.props.last})
  // }


  render() {
    // const backAction = NavigationActions.back({
    //   key: 'OrderTypes'
    // })
    return(
      <View>
        <View style={styles.container}
          >
          <StatusBar barStyle="light-content"
          />
          {/* Change to image eventually */}
          <Text style={styles.title}>
            The {this.props.name}!
          </Text>
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
    justifyContent:'center',
    backgroundColor:'#2d2c2c',
    paddingLeft:15,
  },
  title: {
    color:'#cccccc',
    fontSize:20,
    fontStyle:'italic',
    paddingTop:8,
  },
  menuBtn:{
    paddingHorizontal:8,
    paddingTop:8,
  },
})
