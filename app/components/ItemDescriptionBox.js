import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native';

import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import DataContainer from '../components/DataContainer';

class ItemDescriptionBox extends Component {

  state={
    quantity:1,
  }


  increase(){
    this.setState({ quantity:this.state.quantity+1 })
    this.props.updateQuantity(this.state.quantity+1)
  }

  decrease() {
    if (this.state.quantity > 1) {
      this.setState({ quantity:this.state.quantity-1 })
    } else {
      this.setState({ quantity:1 })
    }
    this.props.updateQuantity(this.state.quantity-1)
  }

  render() {
    return (
      <View style={{flex:1}}>
        <Divider style={{backgroundColor:'black'}}/>
        <View style={styles.container}>
          <View style={styles.largeBox}>
            <View style={styles.textBox}>
              <Text style={styles.description}>
                {this.props.itemDescription}
              </Text>
            </View>
            <Divider style={styles.middleDivider}/>
            <DataContainer/>
          </View>
          {/* <Divider style={{backgroundColor:'#f92222'}}/> */}
          <Divider style={styles.verticalDivider}/>
          {/* Up and down arrows and quantity */}
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => this.increase()}
              >
              <Icon
                name="angle-up"
                size={30}
                color='#cccccc'

              />
            </TouchableOpacity>
            <Text style={{color:'#cccccc'}}>
              {this.state.quantity}
            </Text>
            <TouchableOpacity
              onPress={() => this.decrease()}
              >
              {this.state.quantity > 1 && <Icon
                name="angle-down"
                size={30}
                color='#cccccc'
              />
              }
              {this.state.quantity < 2 && <Icon
                name="angle-down"
                size={30}
                color='transparent'
              />
              }
            </TouchableOpacity>
          </View>
        </View>
        <Divider style={{backgroundColor:'black'}}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'row',
    backgroundColor:'#3A3D42'
  },
  textBox:{
    flex:1,
    backgroundColor:'#3A3D42',
  },
  description:{
    padding:20,
    fontStyle:'italic',
    color:'#cccccc',
  },
  quantityContainer:{
    flex:1,
    backgroundColor:'#3A3D42',
    justifyContent:'center',
    alignItems:'center'
  },
  dataContainer:{
    flex:1,
    backgroundColor:'green',
  },
  largeBox:{
    flex:5
  },
  verticalDivider:{
    // backgroundColor:'#cccccc',
    backgroundColor:'black',
    alignSelf:'center',
    height: '95%',
    flex:0.02
    // flex:StyleSheet.hairlineWidth,
  },
  middleDivider:{
    // backgroundColor:'#cccccc',
    backgroundColor:'black',
    alignSelf:'center',
    width: '95%',
  }
})

export default ItemDescriptionBox;
