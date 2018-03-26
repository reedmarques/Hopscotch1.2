// @ flow weak
import React, { Component } from 'react';
import {AppRegistry, View, StyleSheet, ListView, Text} from 'react-native';
// const GridView = require('../components/GridView').default;
import GridView from '../components/GridView';

const styles = StyleSheet.create({
    listContainer: {flex: 1, backgroundColor: 'powderblue'},
    item: {backgroundColor: 'navajowhite', margin: 3, paddingVertical: 7, borderWidth: 4, borderColor: 'orange', alignItems: 'center', justifyContent: 'center'}
});

class Example extends Component {
    getInitialState = () => {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var data = Array.apply(null, {length: 40}).map(Number.call, Number);

        return {
            dataSource: ds.cloneWithRows(data)
        };
    };

    render() {
        return (
            <View style={styles.listContainer}>
                <GridView
                    dataSource={20}
                    renderRow={this._renderRow}
                    numberOfItemsPerRow={5}
                    removeClippedSubviews={false}
                    initialListSize={1}
                    pageSize={5}
                />
            </View>
        );
    };

    _renderRow = (rowData) => {
        return (
            <View style={styles.item}>
                <Text>{rowData}</Text>
            </View>
        );
    }
}

export default Example;
// AppRegistry.registerComponent('Example', () => Example);
