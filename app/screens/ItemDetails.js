import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Header from '../components/Headers/Header';
import Icon from 'react-native-vector-icons/Ionicons';
import ItemDescriptionBox from '../components/ItemDescriptionBox';
import AddToCart from '../components/AddToCart';
import { NavigationActions } from 'react-navigation';
import firebase from 'firebase';


export default class ItemDetails extends Component {
  // userId = firebase.auth().currentUser.uid;
  imageRef = firebase.storage().ref('DrinkImages/');

  state={
    quantity:1,
    url:'',
    loading:'false',
  }

  componentWillMount(){
    var that = this;
    // alert(firebase.auth().currentUser.uid)
    this.setState({loading:true})
    this.imageRef.child(this.props.navigation.state.params.name+'.jpeg').getDownloadURL().then((url)=>{
      this.setState({url:url})
      console.log(url, "URLURLURLURL");
    }).then(function(){
      that.setState({loading:false})
    })
  }

  addItemToDB(name,price,description) {
    // alert(this.userId)
    var user = firebase.auth().currentUser;
    if (user){
      var userId = user.uid;
      var quantity = this.state.quantity
      var data = {
        name:name,
        price:price,
        quantity:quantity,
        description:description,
        completed:false,
      }
      firebase.database().ref('users/'+userId+'/currentBar').once('value').then(function(snapshot){
        if (snapshot.val()){
          firebase.database().ref('users/'+userId+'/currentBar/currentOrder/'+name).once('value').then(function(snapshot){
            if (snapshot.val()){
              firebase.database().ref('users/'+userId+'/currentBar/currentOrder/'+name).update({
                quantity:quantity
              })
            } else {
              firebase.database().ref('users/'+userId+'/currentBar/currentOrder/'+name).set(data)
            }
            // this.props.navigation.dispatch(NavigationActions.back({}));
          }).catch(function(e){
            alert(e)
          })
        } else{
          alert('Check into a bar first duuuh')
        }
        // this.props.navigation.dispatch(NavigationActions.back({}));
      }).catch(function(e){
        alert(e)
      })
    }else{
      // this.props.navigation.dispatch(NavigationActions.back({}));
      alert("Log in first")
    }
    this.props.navigation.dispatch(NavigationActions.back({}));
  }

  updateQuantity(quantity){
    if (quantity < 1){
      quantity = 1;
    }
    this.setState({quantity:quantity})
  }

  render() {
    const { name, price, description } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          leftIconName="ios-arrow-back"
          rightIconName="md-heart"
          title={`${name}`}
          />
        <View style={styles.horizContainer}>
          <View style={styles.leftSide}>
          </View>
          <View style={styles.imageView}>
            {this.state.loading && <ActivityIndicator
              size='large' color='#f92222'/>}
            {!this.state.loading && this.state.url!='' && <Image
              style={styles.image}
              source={{uri:this.state.url}}
              // source={{uri: this.imageRef.child(name+'.jpeg').getDownloadURL()}}
            />}
          </View>
          <View style={styles.rightSide}>
            <Text style={styles.price}>
              {`$${price}`}
            </Text>
          </View>
        </View>
        <ItemDescriptionBox
          style={styles.descBox}
          itemDescription = {description}
          updateQuantity={(quantity) => this.updateQuantity(quantity)}
        />
        <AddToCart style={styles.addContainer}
          addItemToDB={() => this.addItemToDB(name,price,description)}
          addLabel='Add to Cart'
          navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#3A3D42'
  },
  horizContainer:{
    flex:1,
    flexDirection:'row'
  },
  leftSide:{
    flex:1,
  },
  rightSide:{
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center',
    paddingBottom:8,
  },
  imageView:{
    flex:4,
    justifyContent:'center',
    alignItems:'center',
  },
  image:{
    flex:1,
    width:250,
    resizeMode: 'contain',
  },
  descBox:{
    flex:1
  },
  price:{
    color:'#f92222',
    fontSize:18
  },
  addContainer:{
    flex:1
  }
})
