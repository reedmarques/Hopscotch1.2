//MAJOR PROBLEM:
//Only push last 4 digits to DB to save current card
//Save user card info in stripes backend


import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SocialIcon, Divider } from 'react-native-elements';
import { CreditCardInput, LiteCreditCardInput } from 'react-native-credit-card-input';
import { NavigationActions } from 'react-navigation';

import Loginform from '../components/LoginForm';
import Header from '../components/Headers/Header';
import AddCard from '../components/AddCard';
import Register from './Register';
import firebase from 'firebase';
// import FBSDK, {LoginManager} from 'react-native-fbsdk';



export default class AddCreditCard extends Component {
  // user = firebase.auth().currentUser;
  state={
    cardNumber:null,
    expiry:null,
    cvc:null,
    name:'Reed',
    isValid:false,
    cardData:{},
    validatingCard:false,
  }

  onFocus = field => {
    console.log(field)
  }

  onChange = formData => {
    console.log(JSON.stringify(formData, null, " "));
    if (formData.valid){
      formData.test='yes'
      this.setState({isValid:true})
      this.setState({cardData:formData})
    } else {
      this.setState({isValid:false})
    }
    // this.addCardToDB(formData)
  };

  addCardToDB(){
    //1) Need to do a zero dollar auth to make sure card is active
    //1.1) Maybe make a stripe access token for a $1 order but cancel transaction
    //1.3) Use Stripe Checkout to validate card
    //2) Add Card to DB under user/cards
    var that = this;
    var user = firebase.auth().currentUser;
    var updateLoadCards = this.props.navigation.state.params.loadCards;
    var updateDefaultCard = this.props.navigation.state.params.updateDefaultCard;
    var db = firebase.database();
    if (user){
      var userId = user.uid;
      var data = this.state.cardData.values
      data['default']=false
      var pushKey = db.ref('users/'+userId+'/payments').push(data).key
      // VALIDATES CARD, DELETES IF INVALID
      that.setState({validatingCard:true})
      setTimeout(function() {
        db.ref('users/'+user.uid+'/payments').once('value').then(function(snapshot){
          var payments = snapshot.val();
          if (payments['error']){
            that.setState({validatingCard:false})
            alert(payments['error'])
            db.ref(`users/${user.uid}/payments/error`).remove()
            db.ref(`users/${user.uid}/payments/${pushKey}`).remove()
          } else {
            that.setState({validatingCard:false})
            alert("Successfully Added Card!")
            var newData = {};
            newData['number'] = payments[pushKey]['number'].substr(15);
            newData['expiry'] = payments[pushKey]['expiry'];
            newData['default'] = payments[pushKey]['default'];
            newData['type'] = payments[pushKey]['type'];
            db.ref(`users/${user.uid}/payments/${pushKey}`).update(newData);
            updateDefaultCard(pushKey)
            updateLoadCards(user);
            that.props.navigation.dispatch(NavigationActions.back({}));
          }
        })
      }, 6000);

    }else{
      // this.props.navigation.dispatch(NavigationActions.back({}));
      alert("Log in first")
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Header
            title="Add a Card"
            leftIconName='ios-arrow-back'
            navigation={this.props.navigation}
          />
          <CreditCardInput
            autoFocus
            validColor="#2ecc71"
            labelStyle={styles.inputLabel}
            inputStyle={styles.inputText}
            // requiresName
            requiresPostalCode
            // name={props.name}
            onChange={this.onChange}
            onFocus={this.onFocus}
          />
          {this.state.validatingCard && <ActivityIndicator
            size='large' color='#f92222'/>}
          {!this.state.validatingCard && <View style={styles.addContainer}>
            <View style={styles.horizContainer}>
              <TouchableOpacity style={styles.cancel}
                onPress={() => this.props.navigation.dispatch(NavigationActions.back())}
                >
                <Text style={styles.title}>Wait nvm</Text>
              </TouchableOpacity>
                {this.state.isValid && <TouchableOpacity style={styles.add}
                onPress={() => this.addCardToDB()}>
                <Text style={styles.title}>Add Card</Text>
              </TouchableOpacity>}
            </View>
          </View>}
        </ScrollView>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#3A3D42',
  },
  inputLabel:{
    color:'white', //input text color
    fontFamily:'Helvetica Neue',
    fontSize:14,
  },
  inputText:{
    color:'white', //input text color
    fontFamily:'Helvetica Neue',
    fontSize:18,
    // fontWeight:'100'
  },
  addContainer: {
    flex:0.25,
    alignSelf:'stretch',
    justifyContent:'flex-start',
    padding:8,
  },
  horizContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    alignSelf:'stretch',
    padding:8
  },
  title:{
    color:'#cccccc'
  },
  cancel:{
    flex:1,
    backgroundColor:'#3A3D42',
    borderColor:'#c5eff7',
    borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    height:34,
    margin:4
  },
  add:{
    flex:1,
    backgroundColor:'#3A3D42',
    borderColor:'red',
    borderWidth:2,
    justifyContent:'center',
    alignItems:'center',
    height:34,
    margin:4
  },

});
