import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SideMenu, List, ListItem, SearchBar } from 'react-native-elements';
// import { bars, drinks, drinkTypes } from '../config/data';
import { SocialIcon } from 'react-native-elements';
import Header from '../components/Headers/Header';
import Login from './Login';
import LeaveBarButton from '../components/LeaveBarButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions } from 'react-navigation';
import firebase from 'firebase';


export default class CheckIn extends Component {
  userId = '';
  state = {
    text:'',
    currentBar:null,
    currentBarName:'',
    bars:[]
  }

  componentWillMount(){
    temp=[];
    var that = this;
    let db = firebase.database().ref('bars');
    db.once('value', (snap)=> {
      snap.forEach(function(bar) {
        let result = bar.val().info;
        result["key"] = bar.key;
        temp.push(result);
        // debugger
      })
    }).then(function(){
      that.setState({bars:temp})
    })
    // firebase.auth().onAuthStateChanged(function(user) {
    //   if (user) {
    //     this.userId = user.uid
    //   } else {
    //   }
    // });
  }

  barPressed(bar){
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        that.userId = user.uid;
        that.updateCheckedIn(bar);
        that.props.navigation.state.params.updateCheckedIn(bar);
      } else {
        alert("Log in first!")
      }
    });
    this.props.navigation.state.params.loadInitialQueue();
    this.props.navigation.dispatch(NavigationActions.back({}));
  };

  leaveBarPressed(){
    this.setState({
      currentBar: {}
    })
    this.setState({
      currentBarName: 'Check in to a bar!'
    })
    var user = firebase.auth().currentUser;
    if (user) {
      this.userId = user.uid
      firebase.database().ref('users/'+this.userId+'/currentBar').remove()
      this.props.navigation.state.params.leaveBar();
      this.props.navigation.state.params.clearQueueOnLeaveBar();
      this.props.navigation.dispatch(NavigationActions.back({}));
    }
  };

  updateCheckedIn(bar){
    this.setState({
      currentBar: bar
    })
    this.setState({
      currentBarName: bar.name
    })
    firebase.database().ref('users/'+this.userId+'/currentBar').update({
      info:bar,
    })
    // firebase.database().ref('users/'+this.userId).once('value').then(function(snapshot) {
    //   alert(snapshot.val().currentBar.info.key)
    // })
  }

  search(text) {
    this.setState({text : text})
  }

  render() {

    let filteredBars = this.state.bars.filter(
      (bar) => {
        return bar.name.toLowerCase().indexOf(this.state.text.toLowerCase()) !== -1||
          bar.streetAddress.toLowerCase().indexOf(this.state.text.toLowerCase()) !== -1 ||
          bar.city.toLowerCase().indexOf(this.state.text.toLowerCase()) !== -1 ||
          bar.state.toLowerCase().indexOf(this.state.text.toLowerCase()) !== -1;
      }
    );

    return (
      <View style={styles.container}>
        <Header
          leftIconName='md-close'
          rightIconName='ios-checkbox'
          title="Check In"
          navigation={this.props.navigation}
        />
        <SearchBar
          // clearIcon={"search"}
          placeholder = 'Find your special bar'
          inputStyle={styles.input}
          onChangeText={(text) => this.search(text)}
          value={this.state.text}
        />
        <ScrollView style={styles.scrollContainer}>
          <List containerStyle={styles.list}>
            {filteredBars.map((bar) => (
              <ListItem
                key={bar.key}
                containerStyle={styles.cell}
                title={bar.name}
                subtitle={`${bar.streetAddress} - ${bar.city}, ${bar.state}`}
                // subtitle="test"
                titleStyle={styles.title}
                subtitleStyle={styles.subtitle}
                underlayColor='#6c7a89'
                hideChevron
                // navigation={this.props.navigation}
                onPress={() => this.barPressed(bar)}
                // titleStyle={styles.title}
                // onPress={() => this.onLearnMore(user)}
              />
            ))}
          </List>
        </ScrollView>
        <TouchableOpacity style={styles.leaveButton}
          onPress={() => this.leaveBarPressed()}
          >
          <Text style={styles.leaveText}>
            Leave your bar :(
          </Text>
        </TouchableOpacity>
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
  cell:{
    alignItems:'center',
    justifyContent:'center',
    height:80,
    color:'red',
    borderBottomColor:'#f92222',

    // borderBottomWidth:0,
    // activeOpacity:0.7,
    // flex:1,
    backgroundColor:'#3A3D42',
  },
  title:{
    // justifyContent:'center',
    color:'#cccccc',
    // alignSelf:'center',
    fontWeight:"800"
  },
  subtitle:{
    // justifyContent:'center',
    color:'#cccccc',
    // alignSelf:'center',
    fontWeight:"100"
  },
  list:{
    borderTopWidth:0,
    borderBottomWidth:0,
    marginTop:0,
  },
  input:{
    fontFamily:'Helvetica Neue',
    fontSize:14,
    fontWeight:"300",
  },
  leaveButton:{
    // flex:1,
    // backgroundColor:'red',
    height:44,
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
