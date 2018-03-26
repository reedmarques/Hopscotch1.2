import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { SideMenu, List, ListItem, SearchBar } from 'react-native-elements';

import { SocialIcon } from 'react-native-elements';
import Header from '../components/Headers/Header';
import Login from './Login';
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderItem from '../components/OrderItem';
import AddToCart from '../components/AddToCart';

class Order extends Component {
  state = {
    text:'',
    chosenDrink:{}
  }
  search(text) {
    this.setState({text : text})
  }

  render() {

    const { name, themeColor, drinkList } = this.props.navigation.state.params;
    console.log(name,themeColor,drinkList)
    //Filters search
    let filteredDrinks = drinkList.filter(
      (drink) => {
        return drink.name.toLowerCase().indexOf(this.state.text.toLowerCase()) !== -1;
      }
    );
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          leftIconName='ios-arrow-back'
          title={name}
        />
        <SearchBar
          // clearIcon={"search"}
          placeholder = 'Find that special drink'
          inputStyle={styles.input}
          onChangeText={(text) => this.search(text)}
          value={this.state.text}
        />
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.itemContainer}>
            {filteredDrinks.map((drink) => (
              <OrderItem
                drink={drink}
                drinkName={drink.name}
                drinkPrice={drink.price}
                themeColor={themeColor}
                navigation={this.props.navigation}
              />
            ))}

            {/* {this.itemList.map((item) => (
              item
            ))} */}

          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#3A3D42' //Lighter gray
  },
  scrollContainer:{
    flex:1,
    // backgroundColor:'#022761',
  },
  itemContainer:{
    flex:1,
    flexDirection:'row',
    flexWrap:'wrap',
    padding:2,

  },
  item:{
    borderColor:'red',
    borderWidth:3,
  },
  input:{
    fontFamily:'Helvetica Neue',
    fontSize:14,
    fontWeight:"300",
  }

})

export default Order;
