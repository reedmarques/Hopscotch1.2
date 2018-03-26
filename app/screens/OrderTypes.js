import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';
import { drinkTypes } from '../config/data';
import { SocialIcon } from 'react-native-elements';
import Header from '../components/Headers/Header';
import Login from './Login';
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';

class OrderTypes extends Component {


  drinkTypePressed = (drinkType) => {
    var that = this;
    var currentBar = null;
    var drinkList = [];

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let userRef = firebase.database().ref('users/'+user.uid+'/currentBar');
        userRef.once('value').then(function(snapshot){
          if (!snapshot.val()){
            alert("Check into a bar first!")
          }
          currentBar = snapshot.val().info.key
        }).then(function(){
          let drinkRef = firebase.database().ref('bars/'+currentBar+'/drinkList/'+drinkType.name);
          drinkRef.once('value', (snap)=> {
            snap.forEach(function(drink) {
              let result = drink.val();
              result["name"] = drink.key;
              drinkList.push(result);
            })
          }).then(function(){
            drinkType["drinkList"] = drinkList
            console.log(drinkType)
            that.props.navigation.navigate('Order', { ...drinkType });
          })
        })
      }else{
        alert("Log in and check in!")
      }
    })
  }

  render() {

    return (
      <View style={styles.container}>
        <Header
          leftIconName='md-close'
          title="Order"
          navigation={this.props.navigation}
        />
        <List containerStyle={styles.list}>
          {drinkTypes.map((drinkType) => (
            <ListItem
              containerStyle={styles.cell}
              title={`${drinkType.name}`}
              titleStyle={styles.title}
              chevronColor={drinkType.themeColor}
              underlayColor='#6c7a89'
              avatar={drinkType.icon}
              // avatarStyle={styles.avatar}
              navigation={this.props.navigation}
              drinkType={drinkType.name}
              onPress={() => this.drinkTypePressed(drinkType)}
            />
          ))}
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#3A3D42'
  },
  list:{
    // backgroundColor:'#3A3D42',
    backgroundColor:'white',
    borderTopWidth:0,
    borderBottomWidth:0,

  },
  cell:{
    alignItems:'center',
    justifyContent:'center',
    height:60,
    color:'red',
    borderTopWidth:0,
    borderBottomWidth:0,
    // activeOpacity:0.7,
    // flex:1,
    backgroundColor:'#3A3D42',
    // backgroundColor:'white'
  },
  title:{
    justifyContent:'center',
    color:'#cccccc',
    paddingLeft:10,
  },
  avatar:{
    backgroundColor:'#3A3D42'
  }
})

export default OrderTypes;
