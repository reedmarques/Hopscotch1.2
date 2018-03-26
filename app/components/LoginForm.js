import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/FontAwesome';


export default class Loginform extends Component {

  state={
    email:'',
    password:'',
    currentUserInfo:{}
  }

  createAccountPressed = () => {
    this.props.navigation.navigate('Register');
  };

  loginPressed(){
    var that = this;
    if (this.state.email == '' || this.state.password == ''){
      alert('Please fill out all fields! Please!')
    } else {
      firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then(function(user){
      firebase.database().ref('/users/' + user.uid + '/info').once('value').then(function(snapshot) {
        var data = snapshot.val();
        that.setState({currentUserInfo:data})
      });
        //Load user data from database if necessary
      }).catch(function(e){
        alert(e)
      })
      this.resetToHome()
    }
  }

  forgotPassword = () => {
    if (this.state.email == ''){
      alert('Please enter your email!')
    } else {
      firebase.auth().sendPasswordResetEmail(this.state.email).then(function(user){
        alert('Password reset email sent!');
      }).catch(function(e){
        alert(e)
      })
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
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
          <View style={styles.mainContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#7f8c8d"
              clearButtonMode="while-editing"
              returnKeyType="next"
              onSubmitEditing={() => this.passwordInput.focus()}
              keyboardType='email-address'
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={(email) => this.setState({email:email})}
              value={this.state.email}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#7f8c8d"
              secureTextEntry
              returnKeyType="done"
              ref={(input) => this.passwordInput = input}
              onChangeText={(password) => this.setState({password})}
            />
            <TouchableOpacity style={styles.loginContainer}
              navigation={this.props.navigation}
              onPress={() => this.loginPressed()}>
              <Text style={styles.loginText}>
                Login
              </Text>
            </TouchableOpacity>
            <View style={styles.optionsContainer}>
              <TouchableOpacity onPress={this.forgotPassword}>
                <Text style={styles.fpText}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.createAccountPressed}>
                <Text style={styles.fpText}>
                  Create an Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    paddingHorizontal:30,
    alignSelf:'stretch',
    justifyContent:'center',

  },
  mainContainer:{
    paddingBottom:150,
    marginBottom:10

  },
  inputContainer:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'stretch'
  },
  input:{
    height:34,
    backgroundColor:'#34495e',
    marginBottom:20,
    color:'white', //input text color
    fontFamily:'Helvetica Neue',
    fontSize:14,
    fontWeight:"300",
    opacity:1,
    paddingHorizontal:10,
    // borderRadius:10,
    borderColor:'#ef4836',
    borderWidth:1,
    marginBottom:10,

  },
  loginContainer:{
    backgroundColor:'#ef4836',
    paddingVertical:10,
    paddingHorizontal:10,
    borderColor:'black',
    marginTop:10

  },
  loginText:{
    textAlign:'center',
    color:'white',
    fontWeight:'600',
  },
  fpText:{
    paddingVertical:10,
    paddingHorizontal:10,
    color:'white',
    fontWeight:'100',
    opacity:0.6,
    textAlign:'center'
  },
  fbText:{
    color:'white',
    fontWeight:'700',
  },
  optionsContainer:{
    // flex:1,
    flexDirection:'row',
    justifyContent:'center',

  }





})
