import React from 'react';
import {StyleSheet, Image} from 'react-native';
import { TabNavigator, StackNavigator, DrawerNavigator } from 'react-navigation';
import { Icon } from 'react-native-elements';

import Feed from '../screens/Feed';
import Settings from '../screens/Settings';
import UserDetail from '../screens/UserDetail';
import Me from '../screens/Me';
import Login from '../screens/Login';
import Logout from '../screens/Logout';
import Grid from '../screens/Grid';
import Register from '../screens/Register';
import OrderTypes from '../screens/OrderTypes';
import Order from '../screens/Order';
import ItemDetails from '../screens/ItemDetails';
import ReviewItemDetails from '../screens/ReviewItemDetails';
import ItemDescriptionBox from '../components/ItemDescriptionBox';
import AddToCart from '../components/AddToCart';
import DataContainer from '../components/DataContainer';
import Home from '../screens/Home';
import CheckIn from '../screens/CheckIn';
import LeftMenu from '../screens/LeftMenu';
import Cart from '../screens/Cart';
import ConfirmCart from '../screens/ConfirmCart';
import Wallet from '../screens/Wallet';
import SelectPayment from '../screens/SelectPayment';
import AddCreditCard from '../screens/AddCreditCard';
import PreviousOrders from '../screens/PreviousOrders';
import Achievements from '../screens/Achievements';

import CartBoostView from '../components/CartBoostView';



export const OrderStack = StackNavigator({
  OrderTypes: {
    screen: OrderTypes,
  },
  Order: {
    screen: Order,
  },
  ItemDetails: {
    screen:ItemDetails,
  },
  CheckIn:{
    screen: CheckIn
  }
}, {
  headerMode: 'none',
});

export const CartStack = StackNavigator({
  Cart: {
    screen: Cart,
  },
  ItemDetails: {
    screen: ItemDetails,
  },
  ReviewItemDetails: {
    screen: ReviewItemDetails,
  },
}, {
  headerMode: 'none',
});

export const WalletStack = StackNavigator({
  Wallet: {
    screen: Wallet,
  },
  AddCreditCard: {
    screen: AddCreditCard,
  },
}, {
  headerMode:'none',
});

export const AchievementsStack = DrawerNavigator({
  Achievements: {
    screen: Achievements,
  },
}, {
  headerMode: 'none',
  mode:'modal',
});

export const SelectPaymentStack = StackNavigator({
  SelectPayment: {
    screen: SelectPayment,
  },
  AddCreditCard: {
    screen: AddCreditCard,
  },
}, {
  headerMode:'none',
});

export const LoginRegisterStack = DrawerNavigator({
  Login: {
    screen: Login,
  },
  Register: {
    screen: Register,
  },
}, {
  headerMode: 'none',
  mode:'modal',
});

export const LogoutStack = DrawerNavigator({
  Logout:{
    screen: Logout,
  },
  Login:{
    screen: LoginRegisterStack,
  },
})

export const HomeStack = StackNavigator({
  Home: {
    screen: Home,
  },
  CheckIn: {
    screen: CheckIn,
  },
  Order: {
    screen: OrderStack,
  },
  Cart: {
    screen: CartStack,
  },
  Wallet: {
    screen: WalletStack,
  },
  Achievements: {
    screen: AchievementsStack,
  },
  SelectPayment: {
    screen: SelectPaymentStack,
  },
  PreviousOrders:{
    screen:PreviousOrders,
  },
  Logout: {
    screen: LogoutStack,
  },
  Login: {
    screen: LoginRegisterStack,
  },
}, {
  mode:'modal',
  headerMode:'none',
})



//Add side menu components here.
export const Root = StackNavigator({
  Home: {
    screen: HomeStack,
  },
  // Order: {
  //   screen: OrderStack,
  // },
}, {
  mode: 'modal',
  headerMode: 'none',
});
