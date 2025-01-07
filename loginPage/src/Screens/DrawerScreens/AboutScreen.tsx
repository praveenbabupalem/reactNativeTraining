import React, {Component} from 'react';
import {Text} from 'react-native';
import {View} from 'react-native';

export default class AboutScreen extends Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems:"center"}}>
        <Text >About</Text>
      </View>
    );
  }
}
