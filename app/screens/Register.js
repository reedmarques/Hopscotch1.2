import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SocialIcon } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import RegisterForm from '../components/RegisterForm';
import firebase from 'firebase';
import FBSDK, {LoginManager, AccessToken} from 'react-native-fbsdk';

export default class Register extends Component {

  state={
    loading:false,
  }

  fbAuth = async () => {
    try {
      this.setState({loading:true});
      var result = await LoginManager.logInWithReadPermissions(['public_profile','email','user_friends']);
      if (!result.isCancelled){
        var tokenData = await AccessToken.getCurrentAccessToken();
        var token = tokenData.accessToken.toString();
        var credential = firebase.auth.FacebookAuthProvider.credential(token);
        var user = await firebase.auth().signInWithCredential(credential);
        firebase.database().ref('users/'+user.uid+'/info').set({
          name:user.displayName,
          email:user.email,
          avatar:user.photoURL
        });
        this.resetToHome()
      }
      this.setState({loading:false});
    } catch (error) {
      this.setState({loading:false});
      alert(error)
    }
  }

  resetToHome(){
    return this.props
               .navigation
               .dispatch(NavigationActions.reset(
                 {
                    index: 0,
                    actions: [
                      NavigationActions.navigate({ routeName: 'Home'})
                    ]
                  }));
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <StatusBar barStyle="light-content"
        /> */}
        <View style={styles.logoContainer}>
          <Text style={styles.title}>
            Register
          </Text>
        </View>
        {this.state.loading && <ActivityIndicator
          size='large' color='#f92222'/>}
        <View style={styles.formContainer}>
          <RegisterForm
            navigation={this.props.navigation}
          />
        </View>
        <SocialIcon
          title='Continue with Facebook'
          type='facebook'
          light
          button
          onPress={() => this.fbAuth()}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#2c3e50',
    justifyContent:'center'
    // padding:20
  },
  formContainer:{
    // paddingVertical:200,
    alignItems:'center'
  },
  logoContainer:{
    alignItems:'center',
    flexGrow:1,
    justifyContent:'center',
    paddingVertical:20,
  },
  logo:{
    width:140,
    height:140,
  },
  title: {
    // flex:1,
    color:'white',
    marginTop:10,
    justifyContent:'center',
    opacity:1
  },
  fbContainer:{
    // backgroundColor:'#2980b9',
    // marginBottom:10,
    // borderRadius:20,
    // width:200,
    marginBottom:10,
    // alignItems:'center',
    // height:200
  },
  title:{
    fontSize:30,
    color:'#ef4836',
  }

});
