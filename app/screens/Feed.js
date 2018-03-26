import React, { Component } from 'react';
import {
  Text,
  View,
  ScrollView,
  StyleSheet,
  TouchableHighlight
} from 'react-native';
import { SideMenu, List, ListItem } from 'react-native-elements';
import { users } from '../config/data';
import { SocialIcon } from 'react-native-elements';
import MenuHeader from '../components/Headers/MenuHeader';
import Login from './Login';

class Feed extends Component {

  constructor () {
    super()
    this.state = { isOpen: false }
    this.toggleSideMenu = this.toggleSideMenu.bind(this)
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

  render() {

    return (

        <View style={styles.container}>
          <SideMenu
            menu={<Login/>}
            isOpen={this.state.isOpen}
            // MenuPosition={'right'}
            onChange={this.onSideMenuChange.bind(this)}
            >
            <MenuHeader
              leftIconName="md-menu"
              toggleSideMenu={this.toggleSideMenu.bind(this)}/>
            <ScrollView>

              {/* <SocialIcon
                title="Sign in with Facebook"
                dark
                button
                not raised
                type='google-plus'
              /> */}
              <List>
                {users.map((user) => (
                  <ListItem
                    key={user.login.username}
                    roundAvatar
                    avatar={{ uri: user.picture.thumbnail }}
                    title={`${user.name.first.toUpperCase()} ${user.name.last.toUpperCase()}`}
                    subtitle={user.email}
                    onPress={() => this.onLearnMore(user)}
                  />
                ))}
              </List>
            </ScrollView>
          </SideMenu>
        </View>

    );
  }
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#3A3D42'
  }
})

export default Feed;
