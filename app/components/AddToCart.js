import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

export default class AddToCart extends Component {
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.horizContainer}>
          <TouchableOpacity style={styles.cancel}
            onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.title}>Wait nvm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.add}
            onPress={this.props.addItemToDB}>
            <Text style={styles.title}>{this.props.addLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:0.25,
    alignSelf:'stretch',
    justifyContent:'center',
    padding:8
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
    borderWidth:3,
    justifyContent:'center',
    alignItems:'center',
    height:34,
    margin:4
  },
  add:{
    flex:1,
    backgroundColor:'#3A3D42',
    borderColor:'red',
    borderWidth:3,
    justifyContent:'center',
    alignItems:'center',
    height:34,
    margin:4
  },
})
