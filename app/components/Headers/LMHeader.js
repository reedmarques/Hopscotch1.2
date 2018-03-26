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
import firebase from 'firebase';
// import { NavigationActions } from 'react-navigation';

export default class LMHeader extends Component {
  // user = firebase.auth().currentUser;
  state = {
    first:'',
    last:''
  }

  // componentWillMount(){
  //   this.setState({first:this.props.first,last:this.props.last})
  // }
  goToLogout = (name) => {
    // alert(this.user.uid)
    if (this.props.loggedIn){
      // this.props.navigation.dispatch(NavigationActions.back());
      this.props.navigation.navigate('Logout', {name})
    } else {
      // this.props.navigation.dispatch(NavigationActions.back());
      this.props.navigation.navigate('Login')
    }
    this.props.toggleSideMenu()
  }

  render() {
    return(
      <View>
        <View style={styles.container}
          >
          {this.props.loggedIn && <Text style={styles.title}
            onPress={() => this.goToLogout(this.props.name)}>
            The {this.props.name}!
          </Text>}
          {!this.props.loggedIn && <Text style={styles.title}
            onPress={() => this.goToLogout(this.props.name)}
            navigation={this.props.navigation}>
            Log In
          </Text>}
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
    justifyContent:'flex-start',
    backgroundColor:'#2d2c2c',
    paddingLeft:15,
  },
  title: {
    color:'#cccccc',
    fontSize:18,
    fontStyle:'italic',
    paddingTop:8,
  },
  menuBtn:{
    paddingHorizontal:8,
    paddingTop:8,
  },
})
