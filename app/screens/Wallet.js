// IMPLEMENT DELETING A CARD FROM DB ->TRIGGERS STRIPE CALL

import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';
import { drinks, drinkTypes } from '../config/data';
import { SocialIcon, CheckBox } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import Header from '../components/Headers/Header';
import Login from './Login';
import Icon from 'react-native-vector-icons/Ionicons';
import CartSubtotalView from '../components/CartSubtotalView';
import Icons from '../../node_modules/react-native-credit-card-input/src/Icons';
import firebase from 'firebase';

export default class Wallet extends Component {

  constructor(){
    super()
    this.state={
      cards:[],
      rowID:null,
      sectionID:null,
    }
  }

  componentWillMount(){
    var that = this;
    if (user = firebase.auth().currentUser){
      this.loadCards(user)
    } else {

      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          that.loadCards(user)
        } else {
          alert("Log In First!")
        }
      });
    }
  }

  loadCards(user){
    var that = this;
    var temp = [];
    var userId = user.uid;
    let db = firebase.database().ref('users/'+userId+'/payments');
    db.once('value', (snap)=> {
      snap.forEach(function(item) {
        let result = item.val();
        result['key'] = item.key;
        temp.push(result);
        if (result.default){
        } else {
        }
      })
    }).then(function(){
      that.setState({cards:temp})
    })
  }


  // Implement deleting card
  deleteCard(){
    Alert.alert(
                            'Are You Sure',
                            // [ { text: 'OK', onPress: () => this.deleteRow(secId, rowId, rowMap) },
                            //   { text: 'Cancel', } ]
                          )
    var that = this;

    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     let db = firebase.database().ref(`stripe_customers/${user.uid}/payments`);
    //   } else {
    //   }
    // });
  }

  updateDefaultCard(currentKey){
    var updates = {};
    var user = firebase.auth().currentUser;
    var userId = user.uid;
    var temp = [];
    var that = this;
    let db = firebase.database().ref('users/'+userId+'/payments');
    db.once('value', (snap)=> {
      snap.forEach(function(item) {
        let result = item.val();
        // result['key'] = item.key;
        // temp.push(result);
        if (item.key != currentKey){
          updates['users/'+userId+'/payments/'+item.key+'/default'] = false
        } else {
          updates['users/'+userId+'/payments/'+item.key+'/default'] = true
        }
      })
    }).then(function(){
      firebase.database().ref().update(updates).then(function(){
        that.loadCards(user)
      });
    })
  }

  addCardPressed(){
    this.props.navigation.navigate('AddCreditCard', {loadCards:this.loadCards.bind(this), updateDefaultCard:this.updateDefaultCard.bind(this)});
  }

  swipeoutBtns = [ {text:'Delete', onPress:()=>this.deleteCard()}];
  render() {
    return (
      <View style={styles.container}>
        <Header
          leftIconName='md-close'
          title="Wallet"
          navigation={this.props.navigation}
        />
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.paymentMethods}>
            PAYMENT METHODS
          </Text>
          <List containerStyle={styles.list}>
            {this.state.cards.map((item) => (
              <Swipeout right={this.swipeoutBtns}
                autoClose={true}
                // backgroundColor='#f92222'
                onOpen={(sectionID,rowID)=>{this.setState({
                  openKey:item.key,
                  sectionID:sectionID,
                  rowID:rowID,
                })}}

                >
                <ListItem
                  key={item.key}
                  containerStyle={styles.cell}
                  title={item.number.length>4 ? `•••• •••• •••• ${item.number.substr(15)}`:`•••• •••• •••• ${item.number}` }
                  titleStyle={styles.title}
                  rightTitle={item.expiry}
                  rightTitleStyle={styles.rightTitle}
                  rightIcon={item.default && <Icon style={styles.rightIcon} name='ios-card-outline' size={30} color='#2ecc71'/> ||
                            !item.default && <Icon style={styles.rightIcon} name='ios-card-outline' size={30} color='transparent'/>
                  }
                  underlayColor='#6c7a89'
                  // card icon pulled from card input Icons package
                  avatar={Icons[item.type.toLowerCase()]}
                  avatarStyle={styles.avatar}
                  navigation={this.props.navigation}
                  onPress={() => this.updateDefaultCard(item.key)}
                />
              </Swipeout>
            ))}
          </List>
          <List containerStyle={styles.list}>
            <ListItem
              containerStyle={styles.addCell}
              title='Add a new card'
              titleStyle={styles.addTitle}
              chevronColor='#19b5fe'
              onPress={() => this.addCardPressed()}
            />
          </List>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#3A3D42'
  },
  scrollContainer:{
    // backgroundColor:'grey',
    // flex:0.4,
    height:200,
    backgroundColor:'#3A3D42',
  },

  paymentMethods:{
    color:'#bdc3c7',
    paddingLeft:8,
    paddingBottom:4,
    fontWeight:'600',
    fontSize:12,
  },

//Card List
  list:{
    // flex:1,
    marginTop:0,
    backgroundColor:'#3A3D42',
    borderTopWidth:0,
    borderBottomWidth:0,

  },
  cell:{
    paddingHorizontal:8,
    // borderTopWidth:0,
    height:50,
    // borderBottomWidth:1,
    // backgroundColor:'#606368',
    justifyContent:"center",
    borderBottomColor:'#f92222',
    // borderColor:'#f92222',
    // borderWidth:1,
    // margin:2,
    // borderRadius:10,
  },
  title:{
    color:'#bdc3c7',
    paddingLeft:8,
    fontWeight:"300",
    width:200,
    justifyContent:"center",
  },
  rightTitle:{
    color:'#bdc3c7',
    paddingRight:24,
    justifyContent:"center",
  },
  rightIcon:{
    paddingRight:4,
    justifyContent:'center',
    alignItems:'center'
  },
  subtitle:{
    color:'#3A3D42',
    paddingLeft:8,
    fontWeight:"100",
    fontStyle:'italic',
  },
  total:{
    // paddingLeft:8,
    fontWeight:"700",
    color:'#3A3D42',
  },
  avatar:{
    backgroundColor:'#3A3D42',
  },

//Add Cell
  addCell:{
    paddingHorizontal:8,
    height:50,
    borderBottomWidth:0,
    // backgroundColor:'#606368',
    justifyContent:"center",
    borderBottomColor:'#f92222'
  },
  addTitle:{
    color:'#19b5fe'
  }
})
