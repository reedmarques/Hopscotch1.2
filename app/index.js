import React, { Component } from 'react';
import { Root, Tabs } from './config/router';
import { SideMenu, List, ListItem } from 'react-native-elements';
import Login from './screens/Login';
import Header from './components/Headers/Header';
import firebase from 'firebase';
import { Platform } from 'react-native';
// import stripe from 'stripe';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import firebaseClient from  "./FirebaseClient";


var config = {
    apiKey: "AIzaSyCyTbo7kJFigp5dWE20L255X0gezy5PUbw",
    authDomain: "boozt-react-native.firebaseapp.com",
    databaseURL: "https://boozt-react-native.firebaseio.com",
    projectId: "boozt-react-native",
    storageBucket: "boozt-react-native.appspot.com",
    messagingSenderId: "973451860124",
  };
  firebase.initializeApp(config);

// RNF Implementation:
// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
    // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    if(notif.local_notification){
      //this is a local notification
    }
    if(notif.opened_from_tray){
      //iOS: app is open/resumed because user clicked banner
      //Android: app is open/resumed because user clicked banner or tapped app icon
    }
    // await someAsyncCall();

    if(Platform.OS ==='ios'){
      //optional
      //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application.
      //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
      //notif._notificationType is available for iOS platfrom
      switch(notif._notificationType){
        case NotificationType.Remote:
          notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
          break;
        case NotificationType.NotificationResponse:
          notif.finish();
          break;
        case NotificationType.WillPresent:
          notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
          break;
      }
    }
});
FCM.on(FCMEvent.RefreshToken, (token) => {
    console.log(token)
    // fcm token may not be available on first load, catch it here
});




class App extends Component {
  constructor () {
    super()
    this.state = { isOpen: false }
    this.toggleSideMenu = this.toggleSideMenu.bind(this)
  }

  // RNF Implementation
  componentDidMount() {
    var that = this;
    // If Platform == IOS: else do Androids: etc etc...
    FCM.requestPermissions();
    FCM.getFCMToken().then(token => {
        console.log(token)
        that.sendRemoteNotification(token)
        console.log("sent");
        // store fcm token in your server
    });

    //this.showLocalNotification();
    //console.log("Local");


    // this.notificationUnsubscribe = FCMEvent.on('notification', (notif) => {
    //   // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    // });
    // this.refreshUnsubscribe = FCMEvent.on('refreshToken', (token) => {
    //   console.log(token)
    //   // fcm token may not be available on first load, catch it here
    // });
    //
    // FCMEvent.subscribeToTopic('/topics/foo-bar');
    // FCMEvent.unsubscribeFromTopic('/topics/foo-bar');
  }
  componentWillUnmount() {
    // prevent leaking
    // this.refreshUnsubscribe();
    // this.notificationUnsubscribe();
  }

  showLocalNotification() {
    FCM.presentLocalNotification({
      vibrate: 500,
      title: 'Hello',
      body: 'Test Notification',
      big_text: 'i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large, i am large',
      priority: "high",
      sound: "bell.mp3",
      large_icon: "https://image.freepik.com/free-icon/small-boy-cartoon_318-38077.jpg",
      show_in_foreground: true,
      number: 10
    });
  }



  // Remote notification not working even though firebaseclient is set up
  sendRemoteNotification(token) {
    let body;

    if(Platform.OS === 'android'){
      body = {
        "to": token,
      	"data":{
					"custom_notification": {
						"title": "Simple FCM Client",
						"body": "This is a notification with only NOTIFICATION.",
						"sound": "default",
						"priority": "high",
						"show_in_foreground": true
        	}
    		},
    		"priority": 10
      }
    } else {
			body = {
				"to": token,
				"notification":{
					"title": "Simple FCM Client",
					"body": "This is a notification with only NOTIFICATION.",
					"sound": "default"
				},
				"priority": 10
			}
		}
    console.log(JSON.stringify(body));
    firebaseClient.send(JSON.stringify(body), "notification");
  }











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

  render() {
    return (
      <Root/>
    );
  }
}

export default App;
console.disableYellowBox = true;
