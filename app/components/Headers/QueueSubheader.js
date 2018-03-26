import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import { Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class QueueSubheader extends Component {
  render() {
    return(
      <View style={styles.container}>
        <View style={styles.horizContainer}>
          <View style={styles.regular}>
            <Text style={styles.regTitle}>Nice Guy Queue</Text>
            <Text style={styles.regSubtitle}>Est. clear time: {this.props.regularQueueClearTime} min</Text>
          </View>
          <Divider style={styles.verticalDivider}/>
          <View style={styles.boozt}>
            <Text style={styles.hopTitle}>Savage Hopper Queue</Text>
            <Text style={styles.hopSubtitle}>Est. clear time: {this.props.hopQueueClearTime} min</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:0.08,
    alignSelf:'stretch',
    justifyContent:'center',
    // padding:8
  },
  horizContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    alignSelf:'stretch',
    // padding:8
  },
  hopTitle:{
    flex:1,
    color:'gold',
    paddingTop:4,
    fontStyle:'italic',
  },
  regTitle:{
    flex:1,
    color:'#c5eff7',
    paddingTop:4,
    fontStyle:'italic',
  },
  hopSubtitle:{
    flex:1,
    color:'gold',
    fontStyle:'italic',
    fontSize:10,
  },
  regSubtitle:{
    flex:1,
    color:'#c5eff7',
    fontStyle:'italic',
    fontSize:10,
  },
  verticalDivider:{
    backgroundColor:'#f92222',
    alignSelf:'center',
    height: '100%',
    flex:0.005
  },
  regular:{
    flex:1,
    backgroundColor:'#3A3D42',
    borderBottomColor:'#c5eff7',
    borderBottomWidth:2,
    borderTopColor:'#f92222',
    borderTopWidth:1,
    // borderRightWidth:1,
    justifyContent:'center',
    alignItems:'center',
    height:45,
    // margin:4
  },
  boozt:{
    flex:1,
    backgroundColor:'#3A3D42',
    borderBottomColor:'gold',
    borderBottomWidth:2,
    borderTopColor:'#f92222',
    borderTopWidth:1,
    // borderLeftWidth:1,
    justifyContent:'center',
    alignItems:'center',
    height:45,
    // margin:4
  },
})
