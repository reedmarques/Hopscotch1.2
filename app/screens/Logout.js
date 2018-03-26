import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import { SocialIcon, Divider } from 'react-native-elements';
import LogoutHeader from '../components/Headers/LogoutHeader';
import Register from './Register';
import firebase from 'firebase';
// import FBSDK, {LoginManager} from 'react-native-fbsdk';


export default class Logout extends Component {
  // userId = firebase.auth().currentUser.uid;
  //Log out with FB

  state={
    currentUserInfo:{},
  }

  logoutPressed = () => {
    this.logout()
    this.props.navigation.dispatch(NavigationActions.back({}));
    this.props.navigation.navigate('Login');
  }

  logout = () => {
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
    }).catch(function(error) {
      // An error happened.
    });
  }

  render() {
    const { name } = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <LogoutHeader
          // {this.state.currentUserInfo && first={this.state.currentUserInfo.firstName}
          //   last={this.state.currentUserInfo.lastName}
          // }
          name={name}

        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.loginContainer}
            onPress={() => this.logoutPressed()}>
            <Text style={styles.loginText}>
              Logout
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelContainer}
            onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
            >
            <Text style={styles.loginText}>
              Cancel logout (better decision)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#2d2c2c',
  },
  buttonContainer:{
    flex:1,
    paddingHorizontal:30,
    alignSelf:'stretch',
    justifyContent:'flex-end',
    paddingBottom:16,
  },
  loginContainer:{
    // flex:1,
    backgroundColor:'#2d2c2c',
    borderColor:'red',
    borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    height:34,
  },
  loginText:{
    textAlign:'center',
    color:'white',
    // fontWeight:'600',
  },
  logoContainer:{
    alignItems:'center',
    flexGrow:1,
    justifyContent:'center',
  },
  cancelContainer:{
    backgroundColor:'#2d2c2c',
    borderColor:'#c5eff7',
    borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    height:34,
    marginTop:8,
  },
});
