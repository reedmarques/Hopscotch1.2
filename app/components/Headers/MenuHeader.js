import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar
} from 'react-native';
import firebase from 'firebase';
// import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';


export default class MenuHeader extends Component {


  state = {
    currentBar:{},
    currentBarName:'Check in to a bar!',
  }


  componentWillMount(){
    var that = this;
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.database().ref('users/'+user.uid).once('value').then(function(snapshot) {
          var curBar = snapshot.val().currentBar.info;
          that.setState({currentBar:curBar}),
          that.setState({currentBarName:curBar.name})
        })

      } else {
        that.setState({currentBar:{}})
        that.setState({currentBarName:'Check in to a bar!'})
      }
    });
  }

  updateCheckedIn(bar){
    this.setState({
      currentBar: bar
    })
    this.setState({
      currentBarName: bar.name
    })
  }

  leaveBar(){
    alert("Hope this means you're bar hopping")
    this.setState({
      currentBar: {}
    })
    this.setState({
      currentBarName: 'Check in to a bar!'
    })
  }

  reloadPage(){
    this.props.reloadHomePage()
  }

  checkInPressed = () => {
    this.props.navigation.navigate('CheckIn',
    {updateCheckedIn: this.updateCheckedIn.bind(this),
      leaveBar:this.leaveBar.bind(this),
      loadInitialQueue:this.props.loadInitialQueue.bind(this),
      clearQueueOnLeaveBar:this.props.clearQueueOnLeaveBar.bind(this)
    });
  };

  render() {
    // const { bar } = this.props.navigation.state.params;
    // this.updateBar(name)
    return(
      <View>
        <View style={styles.container}>
          <TouchableOpacity onPress={() => this.props.toggleSideMenu()}>
            <Icon
              style={styles.menuBtn}
              name={`${this.props.leftIconName}`}
              size={30}
              color="#f92222"
            />
          </TouchableOpacity>
          {/* Change to image eventually */}
          <TouchableOpacity style={styles.titleContainer}
            onPress={this.checkInPressed}>
            <Text style={styles.title}>h o p scotch</Text>
            {/* Sets menu subtitle based on logged in or not */}
            <Text style={styles.subtitle}>
              {this.state.currentBarName == 'Check in to a bar!' ? 'Check in to a bar!' :
              `${this.state.currentBarName} - ${this.state.currentBar.city}, ${this.state.currentBar.state}`}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>this.reloadPage()}>
            <Icon
              style={styles.menuBtn}
              name={`${this.props.rightIconName}`}
              size={30}
              color="#f92222"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection:'row',
    height: 60,
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#3A3D42',
  },
  titleContainer: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingTop:2
  },
  title: {
    color:'#cccccc',
    fontSize:24,
    paddingTop:8,
    fontStyle:'italic'
  },
  subtitle: {
    color:'#f92222',
    fontStyle:'italic',
    fontSize:12,
  },
  menuBtn:{
    paddingHorizontal:8,
    paddingTop:8
  },
})
