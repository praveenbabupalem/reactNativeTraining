import {Alert, Switch, Text, View} from 'react-native';

import MaterilIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {StyleSheet} from 'react-native';

import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {DrawerItem} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ThemeContext} from '../Context';

class CustomDrawer extends Component {
  handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged Out');
    this.props.navigation.replace('Signup');
  };

  render() {
    const {state, descriptors, navigation} = this.props;
    return (
      <ThemeContext.Consumer>
        {({theme, toggleTheme}) => {
          return (
            <SafeAreaProvider>
              <SafeAreaView
                style={
                  theme == 'light'
                    ? styles.drawerContainer
                    : [styles.drawerContainer, styles.darkDrawerContainer]
                }>
                {state.routes.map((route, index) => {
                  const {options} = descriptors[route.key];
                  const label =
                    options.drawerLabel !== undefined
                      ? options.drawerLabel
                      : options.title !== undefined
                      ? options.title
                      : route.name;

                  const isFocused = state.index === index;

                  let iconName;

                  if (route.name === 'HomeCenter') {
                    iconName = isFocused ? 'home' : 'home-outline';
                  } else if (route.name === 'About') {
                    iconName = isFocused
                      ? 'alpha-a-circle'
                      : 'alpha-a-circle-outline';
                  } else if (route.name === 'Settings') {
                    iconName = isFocused
                      ? 'alert-rhombus'
                      : 'alert-rhombus-outline';
                  }
                  const onPress = () => {
                    const event = navigation.emit({
                      type: 'drawerItemPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      navigation.navigate(route.name, route.params);
                    }
                  };

                  const onLongPress = () => {
                    navigation.emit({
                      type: 'drawerItemLongPress',
                      target: route.key,
                    });
                  };

                  return (
                    <TouchableOpacity
                      accessibilityRole="button"
                      onPress={onPress}
                      onLongPress={onLongPress}
                      style={styles.iconContainer}
                      key={index}>
                      <MaterilIcons
                        name={iconName}
                        color={
                          isFocused
                            ? '#DB3022'
                            : theme == 'light'
                            ? 'black'
                            : '#fff'
                        }
                        size={34}
                        style={{opacity: isFocused ? 1 : 0.4}}
                      />
                      <Text
                        style={{
                          color: isFocused
                            ? '#DB3022'
                            : theme == 'light'
                            ? 'black'
                            : 'whitesmoke',
                          fontSize: 18,
                        }}>
                        {label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                <View style={styles.themeContainer}>
                  <Text
                    style={
                      theme == 'light'
                        ? styles.themeText
                        : [styles.themeText, {color: 'whitesmoke'}]
                    }>
                    Light
                  </Text>
                  <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    onValueChange={toggleTheme}
                    value={theme === 'light' ? false : true}
                  />
                  <Text
                    style={
                      theme == 'light'
                        ? styles.themeText
                        : [styles.themeText, {color: 'whitesmoke'}]
                    }>
                    Dark
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.footer}
                  onPress={this.handleLogout}>
                  <Text
                    style={{
                      color: theme == 'light' ? 'dark' : 'whitesmoke',
                      fontSize: 22,
                    }}>
                    Logout
                  </Text>
                  <MaterilIcons
                    name="logout"
                    color={theme == 'light' ? 'dark' : 'whitesmoke'}
                    size={22}
                  />
                </TouchableOpacity>
              </SafeAreaView>
            </SafeAreaProvider>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}

export default CustomDrawer;

const styles = StyleSheet.create({
  drawerContainer: {
    borderRadius: 20,
    flex: 1,
  },
  darkDrawerContainer: {
    backgroundColor: 'dark',
  },

  themeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    gap: 20,
  },
  themeText: {
    fontSize: 18,
  },
  iconContainer: {
    borderWidth: 0.1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 5,
    margin: 10,
  },
  footer: {
    height: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    left: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
});
