import React, { Component } from 'react'
import { Text, View } from 'react-native'

import { ThemeContext } from '../../Context';

export default class BagScreen extends Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {({theme}) => {
          return (
            <View
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: theme == 'light' ? 'black' : 'whitesmoke'}}>
                Bag Screen
              </Text>
            </View>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
 