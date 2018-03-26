import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Tile, List, ListItem } from 'react-native-elements';
import Header from '../components/Headers/Header';

class UserDetail extends Component {
  render() {
    const { picture, name, email, phone, login, dob, location } = this.props.navigation.state.params;

    return (
      <View style={styles.container}>
        <Header/>
        <ScrollView>
          <Tile
            imageSrc={{ uri: picture.large}}
            featured
            title={`${name.first.toUpperCase()} ${name.last.toUpperCase()}`}
            caption={email}
          />

          <List>
            <ListItem
              title="Email"
              rightTitle={email}
              hideChevron
            />
            <ListItem
              title="Phone"
              rightTitle={phone}
              hideChevron
            />
          </List>

          <List>
            <ListItem
              title="Username"
              rightTitle={login.username}
              hideChevron
            />
          </List>

          <List>
            <ListItem
              title="Birthday"
              rightTitle={dob}
              hideChevron
            />
            <ListItem
              title="City"
              rightTitle={location.city}
              hideChevron
            />
          </List>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
  }
})

export default UserDetail;
