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

export default class AddCard extends Component {
  render() {
    return(
      <View style={styles.addContainer}>
        <View style={styles.horizContainer}>
          <TouchableOpacity style={styles.cancel}
            >
            <Text style={styles.title}>Wait nvm</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.add}
            onPress={this.props.addItemToDB}>
            <Text style={styles.title}>Add Card</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
})
