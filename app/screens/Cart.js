// 1. Fix: On order checkout, assign an order ID so
// the bar can display it and match to it on pickup.
// 2. Alert user of what the ID is so they know.
// 3. Ln 162 - Add active achievement to order so Home knows which border to use.


import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';
import { drinks, drinkTypes } from '../config/data';
import { SocialIcon, CheckBox } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';
import Swipeout from 'react-native-swipeout';
import CartHeader from '../components/Headers/CartHeader';
import Login from './Login';
import Icon from 'react-native-vector-icons/Ionicons';
import Icons from '../../node_modules/react-native-credit-card-input/src/Icons';
import CartSubtotalView from '../components/CartSubtotalView';
import randomWords from 'random-words';
import firebase from 'firebase';

export default class Cart extends Component {
  user = firebase.auth().currentUser;
  drinkTypePressed = (drink) => {
    this.props.navigation.navigate('ReviewItemDetails', { ...drink, loadDrinks:this.loadDrinks.bind(this) });
  };

  state={
    items:[],
    currentCard:null,
    currentBar:null,
    subtotal:0,
    total:0,
    hopCost:3.5,
    tipPercentage:[1,1.15,1.2,1.3,1.4],
    tipIndex:2,
    tipValue:0,
    checked:false,
    confirming:false,
    deleting:null,
    openKey: null,
    sectionID: null,
    rowID: null,
  }

  componentWillMount(){
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        that.loadDrinks()
        that.getCurrentPayment(user)
        that.setCurrentBar(user)
      }else{
        alert("Log in first!")
      }
    })
  }

  getCurrentPayment(user){
    var that = this;
    var temp = null;
    let db = firebase.database().ref('users/'+user.uid+'/payments');
    db.once('value', (snap)=> {
      if (snap.val()){
        snap.forEach(function(item) {
          let result = item.val();
          result['key'] = item.key;
          if (result.default){
            temp = result
          }
        })
      }
    }).then(function(){
      if (temp){
        that.setState({currentCard:temp})
      }
    })
  }

  setCurrentBar(user){
    var that = this;
    let userRef = firebase.database().ref('users/'+user.uid+'/currentBar');
    userRef.once('value').then(function(snapshot){
      currentBar = snapshot.val()
    }).then(function(){
      that.setState({currentBar:currentBar})
    })
  }


  //Try changing this to on child added!
  loadDrinks(){
    var temp=[];
    var tempSubtotal = 0;
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let db = firebase.database().ref('users/'+user.uid+'/currentBar/currentOrder');
        db.once('value', (snap)=> {
          snap.forEach(function(item) {
            let result = item.val();
            result['key'] = item.key;
            result['totalPrice'] = item.val().price*result.quantity;
            tempSubtotal += result['totalPrice'];
            temp.push(result);
          })
        }).then(function(){
          that.setState({items:temp})
          that.setState({subtotal:tempSubtotal})
          that.setState({total:tempSubtotal})
          that.updateTotal()
        })
      }else{
      }
    })
  }


  updateTipIndex = (index) => {
    this.setState({tipIndex:index}, this.updateTotal)
    console.log(!this.state.currentCard)
    if (index == 0){
      alert("Not nice :(")
    }
  }

  updateTotal = () => {
    var checked = this.state.checked;
    var tempTotal = (this.state.subtotal*this.state.tipPercentage[this.state.tipIndex])
    var tip = (tempTotal - this.state.subtotal).toFixed(2);
    if (checked){
      tempTotal += this.state.hopCost;
    } else {
      tempTotal = tempTotal;
    }
    tempTotal = tempTotal.toFixed(2)
    this.setState({total:tempTotal})
    this.setState({tipValue:tip})
  }

  //this.state.items not registering as none
  checkBoxPressed(){
    if (this.state.items == []){
      alert("Nothing to boozt")
    } else {
      this.setState({checked: !this.state.checked}, this.updateTotal)
    }
  }

  selectPaymentPressed(){
    this.props.navigation.navigate('SelectPayment', {getCurrentPayment:this.getCurrentPayment.bind(this)});
  }

  getActiveAchievement(){

  }

  //this.state.items not registering as none
  checkoutPressed(){
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (that.state.items == []){
          alert("You gotta have something to buy")
        }
        else if (!that.state.currentCard){
          alert("You gotta pay with something. Sad")
        } else {
          that.setState({confirming:true})
        }
      }else{
        alert("Log in first!")
      }
    })

  }

  cancelConfirm(){
    this.setState({confirming:false})
  }

  confirmCheckout(){
    var that = this;
    var userInfo = null;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        if (that.state.currentBar){
          firebase.database().ref('users/'+user.uid+'/info').once('value').then(function(snapshot){
            userInfo = snapshot.val()
          }).then(function(){
            var type = "";
            var queue = "";
            if (that.state.checked){
              queue = "hopQueue";
              type = "hop";
            } else {
              queue = "regularQueue";
              type = "regular";
            }
            //Note this will be dif from stripeOrder
            var drinkCount = 0;
            that.state.items.map(function(item) {
              drinkCount += item.quantity;
            })

            // FETCH ACTIVE ACHIEVEMENT AND ADD TO ORDER
            previousOrder = {
              items: that.state.items,
              info: userInfo,
              drinkCount: drinkCount,
              price: that.state.total,
              tip: that.state.tipValue,
              date: new Date().toLocaleString(),
              bar: that.state.currentBar.info,
              isHopOrder: that.state.checked,
              hopCost: that.state.hopCost,
              randomWordID: randomWords({exactly:2, join:' '}),
            }
            firebase.database().ref('users/'+user.uid+'/previousOrders/').push(previousOrder).then(function(){
              that.resetToHome()
            })
            // .then(function(){
            //   // CALL CHECK EARN ACHIEVEMENT
            // })
          })
        } else {
          alert("Check into a bar first!")
        }
      }else{
        alert("Log in first!")
      }
    })
  }

  deleteItem = (item) => {
    console.log(item, 'del item');
    if (this.state.deleting == item) {
      Alert.alert(
        `Remove ${item.key}`,
        '',
        [
          {text: 'Cancel', onPress: () => this.setState({deleting:null}), style: 'cancel'},
          {text: 'Delete', onPress: () => this.confirmDeleteItem(item), style:'destructive'},
        ],
        { cancelable: false }
      )
      // this.setState({deleting:null}, ()=>(console.log(this.state.deleting,'should be null')))
    } else {
      this.setState({deleting:item}, ()=>(console.log(this.state.deleting,'should NOT be null')))
    }
  }

  confirmDeleteItem = (item) => {
    var that = this;
    var user = firebase.auth().currentUser;
    if (user) {
      console.log('item');
      var db = firebase.database().ref(`users/${user.uid}/currentBar/currentOrder/${item.key}`);
      return db.remove().then(function(){
        that.loadDrinks();
      })
    }
  }

  resetToHome(){
    return this.props.navigation.dispatch(NavigationActions.reset({
      index: 0,
      key: null,
      actions: [
        NavigationActions.navigate({ routeName: 'Home'})
      ]
    }));
  }

  swipeoutBtns = [ {text:'Delete'}];
  render() {
    return (
      <View style={styles.container}>
        <CartHeader
          leftIconName='md-close'
          title="Cart"
          navigation={this.props.navigation}
        />
        <ScrollView style={styles.scrollContainer}>
          <List containerStyle={styles.list}>
            {this.state.items.map((item) => (
              <Swipeout right={this.swipeoutBtns}
                autoClose={true}
                backgroundColor='#bdc3c7'
                onOpen={(sectionID,rowID)=>{this.setState({
                  openKey:item.key,
                  sectionID:sectionID,
                  rowID:rowID,
                })}}
                // close={onPress}
                >
                <ListItem
                  key={item.key}
                  containerStyle={styles.cell}
                  title={`${item.key}`}
                  titleStyle={styles.title}
                  subtitle={`x${item.quantity}`}
                  subtitleStyle={styles.subtitle}
                  // price={item.price*item.quantity}
                  rightTitle={`$${item.totalPrice}`}
                  // rightTitle={item.totalPrice}
                  rightTitleStyle={styles.price}
                  rightIcon={this.state.deleting == item ?
                    <Icon style={styles.rightIcon} onPress={()=>this.deleteItem(item)} name='ios-trash' size={25} color='#f92222'/> :
                    <Icon style={styles.rightIcon} onPress={()=>this.deleteItem(item)} name='ios-trash-outline' size={25} color='#f92222'/>
                  }
                  // onPressRightIcon={() => this.deleteItem(item)}
                  underlayColor='#6c7a89'
                  navigation={this.props.navigation}
                  onPress={() => this.drinkTypePressed(item)}
                />
              </Swipeout>
            ))}
          </List>
        </ScrollView>
        <CartSubtotalView
        subtotal = {this.state.subtotal}
        updateTipIndex={(index) => this.updateTipIndex(index)}/>
        <View style={styles.boost}>
          <CheckBox
            containerStyle={styles.checkbox}
            center
            iconRight
            title={`Make your order hop for $${this.state.hopCost}?`}
            textStyle={styles.checkText}
            iconType='ionicon'
            checked = {this.state.checked}
            uncheckedIcon='ios-square-outline'
            checkedIcon='ios-checkbox'
            checkedColor='#c0392b'
            onPress={() => this.checkBoxPressed()}
          />
        <TouchableOpacity>
          <Text style={styles.info}>
            What's this?
          </Text>
        </TouchableOpacity>
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.total}>
            Total:
          </Text>
          <Text style={styles.total}>
            ${this.state.total}
          </Text>
        </View>
        <View style={styles.checkoutContainer}>
          {!this.state.currentCard && <TouchableOpacity style={styles.selectPaymentNull}
            onPress={() => this.selectPaymentPressed()}>
            <Text style={styles.selectPaymentTextNull}>Select Payment</Text>
          </TouchableOpacity>}
          {this.state.currentCard && <TouchableOpacity style={styles.selectPaymentActive}
            onPress={() => this.selectPaymentPressed()}>

            <Text style={styles.selectPaymentTextActive}>{`•••• •••• •••• ${this.state.currentCard.number}`}</Text>
          </TouchableOpacity>}
          {!this.state.confirming && <TouchableOpacity style={styles.checkoutButton}
            onPress={() => this.checkoutPressed()}>
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>}
          {this.state.confirming && <View style={styles.horizContainer}>
            <TouchableOpacity style={styles.confirmCancel}
              onPress={() => this.cancelConfirm()}>
              <Text style={styles.confirmTitle}>Wait nvm</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sendIt}
              onPress={() => this.confirmCheckout()}>
              <Text style={styles.confirmTitle}>Send It</Text>
            </TouchableOpacity>
          </View>}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#bdc3c7'
  },
  scrollContainer:{
    // backgroundColor:'grey',
    flex:0.4,
  },
  price:{
    color:'#3A3D42'
  },

  //Boozt checkbox
  boost:{
    flex:0.3,
    // backgroundColor:'green',
    justifyContent:'center'
  },
  checkbox:{
    backgroundColor:'#bdc3c7',
  },
  checkText:{
    color:'#3A3D42',

  },
  info:{
    fontSize:8,
    fontStyle:'italic',
    color:'#3A3D42',
    alignSelf:'flex-end',
    paddingRight:16,
  },

  //Total
  totalContainer:{
    flex:0.1,
    // backgroundColor:'blue',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:16,
  },

  //Checkout
  checkoutContainer:{
    flex:0.35,
    // backgroundColor:'white'
  },
  selectPaymentActive:{
    // flex:0.75,
    // flexDirection:'row',
    // backgroundColor:'#4183d7',
    borderTopWidth:3,
    borderBottomWidth:3,
    borderColor:'#2ecc71',
    justifyContent:'center',
    alignItems:'center',
    height:34,
  },
  selectPaymentNull:{
    // flex:0.75,
    borderTopWidth:3,
    borderBottomWidth:3,
    borderColor:'red',
    justifyContent:'center',
    alignItems:'center',
    height:34,
  },
  selectPaymentTextActive:{
    color:'#2ecc71',
    fontWeight:'500'
  },
  selectPaymentTextNull:{
    color:'red',
    fontWeight:'500'
  },
  cardImage:{
    flex:1,
    backgroundColor:'red',
  },
  checkoutButton:{
    flex:1,
    // backgroundColor:'#c0392b',
    backgroundColor:'gold',
    margin:8,
    justifyContent:'center',
    alignItems:'center',
  },
  checkoutText:{
    color:'black',
    fontWeight:'600',
    // fontSize:18
  },


  list:{
    // flex:1,
    marginTop:0,
    backgroundColor:'#bdc3c7',
    borderTopWidth:0,
    borderBottomWidth:0,
  },
  cell:{
    paddingHorizontal:8,
    borderTopWidth:0,
    borderBottomWidth:0,
  },
  title:{
    color:'#3A3D42',
    paddingLeft:8,
    fontWeight:"500",
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
  rightIcon:{
    paddingHorizontal:4,
    // justifyContent:'center',
    // alignItems:'center'
    alignSelf:'center',
  },

  //Confirming
  horizContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    alignSelf:'stretch',
    padding:8
  },
  confirmTitle:{
    color:'#3A3D42',
    fontWeight:"600",
  },
  confirmCancel:{
    flex:1,
    backgroundColor:'#c5eff7',
    // borderColor:'#c5eff7',
    // borderWidth:3,
    justifyContent:'center',
    alignItems:'center',
    height:40,
    margin:4
  },
  sendIt:{
    flex:1,
    backgroundColor:'gold',
    // borderColor:'red',
    // borderWidth:3,
    justifyContent:'center',
    alignItems:'center',
    height:40,
    margin:4
  },
})
