import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LeftMenuData1,LeftMenuData2 } from '../config/data';
import LMHeader from '../components/Headers/LMHeader';
import { List, ListItem, Divider } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { NavigationActions } from 'react-navigation';
import firebase from 'firebase';



class LeftMenu extends Component {

  state={
    currentUserInfo:{},
    loggedIn:false
  }

  componentWillMount(){
    var that = this;

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        var userId = user.uid;
        that.setState({loggedIn:true})
        firebase.database().ref('/users/' + userId + '/info').once('value').then(function(snapshot) {
          var data = snapshot.val();
          that.setState({currentUserInfo:data})
        });
      } else {
        that.setState({loggedIn:false})
      }
    });
  }

  goTo = (next) => {
    this.props.navigation.navigate(next.replace(" ",""));
    this.props.toggleSideMenu()
  }

  render() {
    return (
      <View style={styles.container}>
        {/* <LMHeader
          name={this.state.currentUserInfo.name}
          // last={this.state.currentUserInfo.lastName}
          toggleSideMenu={this.props.toggleSideMenu}
          loggedIn={this.state.loggedIn}
          navigation={this.props.navigation}
        /> */}
        {this.state.loggedIn && <LMHeader
          name={this.state.currentUserInfo.name}
          // last={this.state.currentUserInfo.lastName}
          toggleSideMenu={this.props.toggleSideMenu}
          loggedIn={this.state.loggedIn}
          navigation={this.props.navigation}
        />}
        {!this.state.loggedIn && <LMHeader
          first='Log In'
          loggedIn={this.state.loggedIn}
          toggleSideMenu={this.props.toggleSideMenu}
          navigation={this.props.navigation}
        />}
        <List containerStyle={styles.list1}>
          {LeftMenuData1.map((item) => (
            <ListItem
              containerStyle={styles.cell}
              title={`${item.title}`}
              titleStyle={styles.title}
              hideChevron
              // chevronColor={drinkType.themeColor}
              underlayColor='#6c7a89'
              leftIcon={<Icon name={item.icon} style={styles.icon} size={30}/>}
              navigation={this.props.navigation}
              onPress={() => this.goTo(item.title)}
            />
          ))}
        </List>
        <List containerStyle={styles.list2}>
          {LeftMenuData2.map((item) => (
            <ListItem
              containerStyle={styles.cell}
              title={`${item.title}`}
              titleStyle={styles.title}
              hideChevron
              // chevronColor={drinkType.themeColor}
              underlayColor='#6c7a89'
              leftIcon={<Icon name={item.icon} style={styles.icon} size={30}/>}
              navigation={this.props.navigation}
              onPress={() => this.goTo(item.title)}
            />
          ))}
        </List>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'black'
  },
  list1:{
    flex:0.25,
    marginTop:0,
    // marginBottom:10,
    backgroundColor:'#2d2c2c',
    borderTopWidth:0,
    borderBottomWidth:0,
  },
  list2:{
    flex:1,
    marginTop:0,
    backgroundColor:'#2d2c2c',
    borderTopWidth:0,
    borderBottomWidth:0,
  },
  cell:{
    // alignItems:'center',
    justifyContent:'center',
    height:44,
    backgroundColor:'red',
    borderTopWidth:0,
    borderBottomWidth:0,
    backgroundColor:'#2d2c2c',
  },
  title:{
    justifyContent:'center',
    color:'#cccccc',
    paddingLeft:20,
    fontWeight:'300',
  },
  icon:{
    color:'#f92222',
    paddingLeft:8,
    // flex:1,
    justifyContent:'center',
    alignSelf:'center'
  }
})

export default LeftMenu;
