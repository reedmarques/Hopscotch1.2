// IMPLEMENT REFRESH BUTTON IN MENU HEADER. LOOK AT H2 CODE

import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableHighlight,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import { SideMenu, List, ListItem, Divider, Avatar } from 'react-native-elements';
import { users } from '../config/data';
import { SocialIcon } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import MenuHeader from '../components/Headers/MenuHeader';
import Login from './Login';
import QueueSubheader from '../components/Headers/QueueSubheader';
import LeftMenu from './LeftMenu';
import firebase from 'firebase';

import Communications from 'react-native-communications';

class Home extends Component {


  state = {
    isMounted: false,
    loading: false,
    isOpen: false,
    checkedIn: false,
    currentBar:{},
    currentBarName:'Check in to a bar!',
    hopQueue:[],
    hopQueueClearTime:0,
    regularQueue:[],
    regularQueueClearTime:0,
    yValue: new Animated.Value(0)
    //yValue: 5
   }
   componentDidMount(){
     this.setState({isMounted: true})
     this.handleSlider()
     //alert(this.state.yValue)

     
   }

  componentWillMount(){
    this.loadInitialQueue()
    this.updateRegularQueue()
    this.updateHopQueue()
  }

  loadInitialQueue(){
    var that = this;
    var currentBar = null;
    var tempRegQueue = [];
    var tempHopQueue = [];
    this.setState({loading:true})
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/'+user.uid+'/currentBar').once('value').then(function(snapshot){
          if (snapshot.val()){
            currentBar = snapshot.val().info.key
            var regQueueRef = firebase.database().ref('bars/'+currentBar+'/queues/regularQueue');
            regQueueRef.once('value', (snap)=> {
              snap.forEach(function(data) {
                let result = data.val();
                result["key"] = data.key;
                tempRegQueue.push(result);
                //console.log(data.key,"reg reg init")
              })
            }).then(function(){
              that.setState({regularQueue:tempRegQueue})
            })
            var hopQueueRef = firebase.database().ref('bars/'+currentBar+'/queues/hopQueue');
            hopQueueRef.once('value', (snap)=> {
              snap.forEach(function(data) {
                let result = data.val();
                result["key"] = data.key;
                tempHopQueue.push(result);
                //console.log(data.key,"hop hop init")
              })
            }).then(function(){
              that.setState({hopQueue:tempHopQueue})
            }).then(function(){
              //console.log(that.state.hopQueue, "hopQueue check avatar IDs");
              //that.printAvatarURIs()
              //Both called here because both states need to be filled to calculate either time
              that.calculateRegClearQueueTime()
              that.calculateHopClearQueueTime()
            }).then(function(){
              // that.setState({loading:false})
            })
          }
        }).then(function(){
          that.setState({loading:false})
        })
      } else {
        // alert("Log in and check in!")
        that.setState({loading:false})
        that.clearQueueOnLeaveBar()
      }
    })

  }

  printAvatarURIs(){
    this.state.hopQueue.map((order) => {
      console.log(order.info.avatar, "AVATAR");
    })
  }

  reloadHomePage(){
    this.loadInitialQueue()
    // this.updateRegularQueue()
    // this.updateHopQueue()
  }

  //These remove functions will be useful for when a bartender completes and deletes an order
  updateRegularQueue(){
    var that = this;
    var currentBar = null;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/'+user.uid+'/currentBar').once('value').then(function(snapshot){
          if (snapshot.val()){
            currentBar = snapshot.val().info.key
          }
        }).then(function(){
          var regQueueRef = firebase.database().ref('bars/'+currentBar+'/queues/regularQueue');
          regQueueRef.limitToLast(1).on('child_added', function(data) {
            let order = data.val();
            order['key'] = data.key;
            //console.log(data.key,"reg key")
            that.addRegularOrder(order);

          });
          regQueueRef.on('child_removed', function(data) {
            that.removeCompletedRegularOrder();
          });
        })
      } else {
      }
    })
  }

  updateHopQueue(){
    var that = this;
    var currentBar = null;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/'+user.uid+'/currentBar').once('value').then(function(snapshot){
          if (snapshot.val()){
            currentBar = snapshot.val().info.key
          }
        }).then(function(){
          var hopQueueRef = firebase.database().ref('bars/'+currentBar+'/queues/hopQueue');
          hopQueueRef.limitToLast(1).on('child_added', function(data) {
            let order = data.val();
            order['key'] = data.key;
            //console.log(data.key,"hop key")
            that.addHopOrder(order);
          });
          hopQueueRef.on('child_removed', function(data) {
            that.removeCompletedHopOrder();
          });
        })
      } else {
      }
    })
  }

  addRegularOrder(order){
    if(this.state.isMounted){
      var newStateArray = this.state.regularQueue.slice();
      //console.log(newStateArray, "NSA")
      newStateArray.push(order);
      this.setState({regularQueue: newStateArray});
    }
  }
  removeCompletedRegularOrder(){
    if(this.state.isMounted){
      var newStateArray = this.state.regularQueue.splice(1);
      this.setState({regularQueue: newStateArray});
    }
  }

  addHopOrder(order){
    if(this.state.isMounted){
      var newStateArray = this.state.hopQueue.slice();
      newStateArray.push(order);
      this.setState({hopQueue: newStateArray});
    }
  }
  removeCompletedHopOrder(){
    if(this.state.isMounted){
      var newStateArray = this.state.hopQueue.splice(1);
      this.setState({hopQueue: newStateArray});
    }
  }

  clearQueueOnLeaveBar(){
    this.setState({regularQueue:[], regularQueueClearTime:0})
    this.setState({hopQueue:[], hopQueueClearTime:0})
  }

  calculateRegClearQueueTime(){
    var RQL = this.state.regularQueue.length;
    var HQL = this.state.hopQueue.length;
    var time = 0;
    if (2*RQL >= HQL){
      //Dependent on RQL
      time = ((RQL+HQL)/2).toFixed(0);
    } else {
      //Max wait time
      time = (RQL*3/2).toFixed(0);

    }
    this.setState({regularQueueClearTime:time})
  }
  calculateHopClearQueueTime(){
    var RQL = this.state.regularQueue.length;
    var HQL = this.state.hopQueue.length;
    var time = 0;
    if (2*RQL > HQL){
      //Max wait time
      time = (HQL*3/4).toFixed(0);
    } else {
      //Dependent on RQL
      time = ((RQL+HQL)/2).toFixed(0);
    }
    this.setState({hopQueueClearTime:time})
  }


  onLearnMore = (user) => {
    this.props.navigation.navigate('Details', { ...user });
  };

  onSideMenuChange (isOpen: boolean) {
    this.setState({
      isOpen:isOpen
    })
  }

  toggleSideMenu () {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  renderCheckedIn(condition, content){
    if (condition) {
      return content;
    } else {
      return null;
    }
  }


  handleSlider(){
    //console.log(this.state.yValue._value, "yValueyValueyValue")
    Animated.sequence([
      Animated.timing(
        this.state.yValue,
        {
          toValue: 1,
          duration: 4500,
          delay: 500,
          easing: Easing.easeInSine,
          useNativeDriver: true
        }
      ),
      Animated.timing(
        this.state.yValue,
        {
          toValue: 0,
          duration: 2000,
          //delay: 100,
          easing: Easing.easeOutSine,
          useNativeDriver: true
        }
      ),
    ]).start(()=> this.handleSlider());
  }

  sendSMS(number, text){
    Communications.text(number, text)
  }



  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true}
        />
        <View style={styles.colorContainer}>
          <SideMenu
            menu={<LeftMenu navigation={this.props.navigation}
                            toggleSideMenu={this.toggleSideMenu.bind(this)}/>}
            isOpen={this.state.isOpen}
            onChange={this.onSideMenuChange.bind(this)}
            edgeHitWidth={80}
            >
            <MenuHeader
              leftIconName="md-menu"
              rightIconName="ios-refresh"
              toggleSideMenu={this.toggleSideMenu.bind(this)}
              loadInitialQueue={this.loadInitialQueue.bind(this)}
              clearQueueOnLeaveBar={this.clearQueueOnLeaveBar.bind(this)}
              reloadHomePage={this.reloadHomePage.bind(this)}
              navigation={this.props.navigation}
            />
            <QueueSubheader
              regularQueueClearTime={this.state.regularQueueClearTime}
              hopQueueClearTime={this.state.hopQueueClearTime}
            />
            <View style={styles.horizContainer}
              automaticallyAdjustContentInsets={false}>

              <ScrollView
                // bounces={false}
                style={styles.scroll}
                decelerationRate={0}
                justifyContent='flex-start'
                >
                {this.state.loading && <ActivityIndicator
                  style={styles.activityIndicator} size='large' color='#f92222' />}
                {!this.state.loading && <List containerStyle={styles.list}>
                  {this.state.regularQueue.map((order) => (
                    <ListItem
                      containerStyle={order.info.name != 'Test Dude' ? styles.cell : styles.achievementCell}
                      key={order.key}
                      roundAvatar
                      hideChevron
                      avatar={{ uri: order.info.avatar }}
                      //avatar={<Icon name='ios-person' size={30} color='#c5eff7'/>}
                      title={`${order.info.name}`}
                      titleStyle={styles.orderTitle}
                      subtitle={order.drinkCount>1 ? `${order.drinkCount} drinks` : `${order.drinkCount} drink`}
                      subtitleStyle={styles.orderSubtitle}
                      onPress={() => this.onLearnMore(order)}
                    />
                  ))}
                </List>}
              </ScrollView>
              <Animated.View
                style={[styles.verticalDivider, {transform: [{
                  translateY: this.state.yValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Dimensions.get('window').height - 134]  // 0 : 150, 0.5 : 75, 1 : 0
                  }),
                }]}]}
              >
              </Animated.View>
              <ScrollView
                // bounces={false}
                style={styles.scroll}
                decelerationRate={0}
                >
                {this.state.loading && <ActivityIndicator
                  style={styles.activityIndicator} size='large' color='#f92222' />}
                {!this.state.loading && <List containerStyle={styles.list}>
                  {this.state.hopQueue.map((order) => (
                    <ListItem
                      containerStyle={order.info.name != 'Test Dude' ? styles.cell : styles.achievementCell}
                      key={order.key}
                      roundAvatar
                      hideChevron
                      // If profile pic use it, else use favorite drink
                      avatar={order.info.avatar ? {uri: order.info.avatar} : <Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/boozt-react-native.appspot.com/o/DrinkImages%2FBlue%20Moon.jpeg?alt=media&token=f6896e85-af71-4bab-8fbb-e65894bef84e' }} style={styles.avatarStyle}/>}
                      //avatar={<Icon name='ios-person' size={30} color='gold'/>}
                      //avatarStyle = {styles.avatarStyle}
                      //avatar={<Avatar small rounded title="RM"  />}
                      //avatar={<Image source={{ uri: order.info.avatar }} style={{borderRadius:15, height:30, width:30 }} />}
                      //avatar={<Image source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/boozt-react-native.appspot.com/o/DrinkImages%2FBlue%20Moon.jpeg?alt=media&token=f6896e85-af71-4bab-8fbb-e65894bef84e' }} style={styles.avatarStyle}/>}
                      title={`${order.info.name}`}
                      titleStyle={styles.orderTitle}
                      subtitle={`${order.drinkCount} drinks`}
                      subtitleStyle={styles.orderSubtitle}
                      onPress={() => this.onLearnMore(order)}
                    />
                  ))}
                </List>}
              </ScrollView>
            </View>
          </SideMenu>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#3A3D42'
  },
  colorContainer:{
    flex:1,
    backgroundColor:'#3A3D42'
  },
  horizContainer:{
    flex:1,
    flexDirection:'row'
  },
  scroll:{
    backgroundColor:'#3A3D42',
    flex:1,
    // backgroundColor:'blue',

  },
  verticalDivider:{
    backgroundColor:'#f92222',
    // backgroundColor:'black',
    alignSelf:'flex-start',
    height: '5%',
    flex:0.005
    //position:'absolute',


  },
  horizDivider:{
    backgroundColor:'black',
  },
  list:{
    flex:1,
    marginTop:0,
    backgroundColor:'#3A3D42',
    borderTopWidth:0,
    borderBottomWidth:0,
  },
  cell:{
    // borderColor:'red',
    borderTopWidth:0,
    borderBottomWidth:0,
  },
  achievementCell:{
    borderColor:'blue',
    borderBottomColor:'blue',
    borderTopWidth:1,
    borderBottomWidth:1,
  },
  orderTitle:{
    fontSize:14,
    color:'#cccccc',
  },
  orderSubtitle:{
    fontSize:12,
    fontStyle:'italic',
    // fontWeight:"200",
    color:'#f92222',
  },
  activityIndicator:{
    paddingTop:150,
    // flex:1
  },
  avatarStyle:{
    height: 30,
    width:30,
    borderRadius:15
    //backgroundColor:'blue'
  }

})

export default Home;
