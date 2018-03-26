import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';


class LeaveBarButton extends Component {

  state = {
    text:'',
    currentBar:{}
  }

  leaveBarPressed(){
    // console.log(bar)
    // this.props.navigation.state.params.updateCheckedIn();
    // this.props.navigation.dispatch(NavigationActions.back({}));
    this.props.leaveBar
  };
  render() {

    return (
      <View style={styles.leaveContainer}>
        <TouchableOpacity style={styles.leaveButton}
          onPress={this.leaveBarPressed}
          >
          <Text style={styles.leaveText}>
            Leave {this.props.barName} :(
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  leaveContainer:{
    flex:0.4,
  },
  leaveButton:{
    flex:1,
    // backgroundColor:'red',
    borderColor:'red',
    borderWidth:2,
    margin:12,
    justifyContent:'center',
    alignItems:'center',
  },
  leaveText:{
    color:'red',
    fontSize:16,
    // fontWeight:"600",
  },
})

export default LeaveBarButton;
