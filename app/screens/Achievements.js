import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SideMenu, List, ListItem, SearchBar } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';
// import moment from 'moment';

import Header from '../components/Headers/Header';
import Login from './Login';
import LeaveBarButton from '../components/LeaveBarButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import firebase from 'firebase';


export default class Achievements extends Component {

  state = {
    previousOrders:[]
  }

  componentWillMount(){
    // this.loadPreviousOrders()

  }

  loadPreviousOrders(){
    var temp = [];
    var that = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        let db = firebase.database().ref('users/'+user.uid+'/previousOrders');
        db.once('value', (snap)=> {
          snap.forEach(function(order) {
            let result = order.val();
            result["key"] = order.key;
            temp.push(result);
          })
        }).then(function(){
          that.setState({previousOrders:temp})
        })
      } else {
        alert("no user!")
      }
    });
  }

  orderPressed(order){

  }

  render() {


    return (
      <View style={styles.container}>
        <Header
          leftIconName='md-close'
          rightIconName='ios-checkbox'
          title="Achievements"
          navigation={this.props.navigation}
        />
        <ScrollView style={styles.scrollContainer}>
          <List containerStyle={styles.list}>
            {this.state.previousOrders.map((order) => (
              <ListItem
                key={order.key}
                containerStyle={order.isHopOrder ? styles.hopCell : styles.cell}
                title={`${order.date} - ${order.bar.name}`}
                subtitle={`${order.bar.streetAddress}, ${order.bar.state} - $${order.price}`}
                titleStyle={styles.title}
                subtitleStyle={styles.subtitle}
                underlayColor='#6c7a89'
                hideChevron
                onPress={() => this.orderPressed(order)}
              />
            ))}
          </List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#3A3D42'
  },
  scrollContainer:{

  },
  list:{
    borderTopWidth:0,
    borderBottomWidth:0,
    marginTop:0,
    backgroundColor:'#3A3D42',
  },
  cell:{
    alignItems:'center',
    justifyContent:'center',
    margin:12,
    color:'red',
    borderColor:'#f92222',
    borderWidth:2,
    borderLeftWidth:1,
    borderLeftColor:'#cccccc',
    borderBottomColor:'#cccccc',
    borderRadius:10,
    backgroundColor:'#3A3D42',
  },
  hopCell:{
    alignItems:'center',
    justifyContent:'center',
    margin:12,
    color:'red',
    borderColor:'gold',
    borderWidth:2,
    borderLeftWidth:1,
    borderLeftColor:'#cccccc',
    borderBottomColor:'#cccccc',
    borderRadius:10,
    backgroundColor:'#3A3D42',
  },
  title:{
    color:'#cccccc',
    fontWeight:"100",
    fontSize:12,
  },
  subtitle:{
    color:'#cccccc',
    fontWeight:"100",
    fontSize:12,
  },
})
