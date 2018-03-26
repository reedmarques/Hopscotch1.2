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
import { SocialIcon, Divider } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Loginform from '../components/LoginForm';
import Register from './Register';
import firebase from 'firebase';
import FBSDK, {LoginManager, AccessToken} from 'react-native-fbsdk';


export default class Login extends Component {

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
          name:user.providerData[0].displayName,
          email:user.providerData[0].email,
          avatar:user.providerData[0].photoURL,
          uid:user.providerData[0].uid
        }).then(function(){
          console.log(user.photoURL, "FBSDK USER INFO!!!!!!!!");
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
          <Image
            style={styles.logo}
            source={require('../../images/rocket.png')} />
          <Text style={styles.title}>
            boozt
          </Text>
        </View>
        {this.state.loading && <ActivityIndicator
          size='large' color='#f92222'/>}
        <View style={styles.formContainer}>
          <Loginform
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
  },
  formContainer:{
    // paddingVertical:200
  },
  logoContainer:{
    alignItems:'center',
    flexGrow:1,
    justifyContent:'center',
  },
  logo:{
    width:150,
    height:150,
  },
  title: {
    // flex:1,
    color:'white',
    marginTop:10,
    justifyContent:'center',
    opacity:1
  },
  divider:{
    backgroundColor:'red',
    alignSelf:'center',
    width: '80%',
  }

});
