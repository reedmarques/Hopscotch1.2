import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';
import { drinks, drinkTypes } from '../config/data';
import { SocialIcon, CheckBox } from 'react-native-elements';
import CartHeader from '../components/Headers/CartHeader';
import Login from './Login';
import Icon from 'react-native-vector-icons/FontAwesome';
import CartSubtotalView from '../components/CartSubtotalView';

export default class ConfirmCart extends Component {

  drinkTypePressed = (drinkType) => {
    // this.setState({chosenDrinkType: drinkType.name})
    this.props.navigation.navigate('ItemDetails', { ...drinkType });
  };
  constructor(){
    super()
    this.state={
      chosenDrinkType:'',
      checked: false
    }
  }


  checkBoxPressed(){
    this.setState({checked: !this.state.checked})
  }

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
            {drinkTypes.map((drinkType) => (
              <ListItem
                containerStyle={styles.cell}
                title={`${drinkType.name}`}
                titleStyle={styles.title}
                subtitle={'x1'}
                subtitleStyle={styles.subtitle}
                rightTitle={'$12'}
                rightTitleStyle={styles.price}
                hideChevron
                underlayColor='#6c7a89'
                avatar={drinkType.icon}
                avatarStyle={styles.avatar}
                navigation={this.props.navigation}
                drinkType={drinkType.name}
                // Send to item details not ordertypes
                onPress={() => this.drinkTypePressed(drinkType)}
              />
            ))}
          </List>
        </ScrollView>
        <CartSubtotalView
        subtotal = {13}/>
        <View style={styles.boost}>
          <CheckBox
            containerStyle={styles.checkbox}
            center
            iconRight
            title='boozt order for $3.5?'
            textStyle={styles.checkText}
            iconType='ionicon'
            checked = {this.state.checked}
            uncheckedIcon='ios-square-outline'
            checkedIcon='ios-checkbox'
            checkedColor='#c0392b'
            onPress={this.checkBoxPressed.bind(this)}
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
            $99
          </Text>
        </View>
        <View style={styles.checkoutContainer}>
          <TouchableOpacity style={styles.selectPayment}>
            {/* // onPress={() => this.props.navigation.goBack()}> */}
            <Text style={styles.selectPaymentText}>Select Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.checkoutButton}>
            {/* // onPress={() => this.props.navigation.goBack()}> */}
            <Text style={styles.checkoutText}>Checkout</Text>
          </TouchableOpacity>
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
  selectPayment:{
    flex:0.75,
    backgroundColor:'#4183d7',
    justifyContent:'center',
    alignItems:'center',
  },
  selectPaymentText:{
    color:'#3A3D42',
    fontWeight:'500'
  },
  checkoutButton:{
    flex:1,
    backgroundColor:'#c0392b',
    margin:4,
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
})
