import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';

import { ButtonGroup } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CartSubtotalView extends Component {

  constructor () {
    super()
    this.state = {
      selectedIndex: 2,
      buttons:['No Tip','15%','20%','30%','40%'],
    }
  }
  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
    // alert(selectedIndex)
    this.props.updateTipIndex(selectedIndex)
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.horizContainer}>
          <Text style={styles.subtotal}>
            Subtotal:
          </Text>
          <Text style={styles.price}>
            ${this.props.subtotal}
          </Text>
        </View>
        <ButtonGroup
          containerStyle={styles.buttonGroup}
          textStyle={styles.text}
          buttons={this.state.buttons}
          selectedIndex = {this.state.selectedIndex}
          // selectedBackgroundColor = {'#c0392b'}
          selectedBackgroundColor = {'gold'}
          onPress={this.updateIndex.bind(this)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:0.4,
    backgroundColor:'#bdc3c7',
    justifyContent:'center',
    marginBottom:8,
    // alignItems:'center'
  },
  horizContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:8,
    // backgroundColor:'red',

  },
  element:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    margin:8,
  },
  subtotal:{
    paddingLeft:8,
    color:'#3A3D42'
  },
  price:{
    paddingRight:8,
    color:'#3A3D42'
  },
  buttonGroup:{
    flex:1,
    backgroundColor:'#bdc3c7'
  },
  text:{
    color:'#3A3D42'
  }
})
