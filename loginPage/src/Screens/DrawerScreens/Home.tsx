import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {Component} from 'react';
import {
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import CustomTabBar from '../../components/CustomTabBar';
import ShopScreen from '../BottomTabScreens/ShopScreen';
import BagScreen from '../BottomTabScreens/BagScreen';
import FavoritesScreen from '../BottomTabScreens/FavoritesScreen';
import ProfilesScreen from '../BottomTabScreens/ProfilesScreen';
import HomeScreen from '../BottomTabScreens/HomeScreen';

const Tab = createBottomTabNavigator();

export default class Home extends Component {
  handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged Out');
    this.props.navigation.replace('Signup');
  };

  render() {
    return (
      <Tab.Navigator
        screenOptions={{headerShown: false}} 
        tabBar={props => <CustomTabBar {...props} />}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Shop" component={ShopScreen} />
        <Tab.Screen name="Bag" component={BagScreen} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
        <Tab.Screen name="Profile" component={ProfilesScreen} />
      </Tab.Navigator>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  backGroundImage: {
    height: 536,
    justifyContent: 'flex-end',
  },
  backGroundImageTextContainer: {
    margin: 20,
  },
  fashionText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 48,
    fontWeight: 700,
    marginBottom: 0,
  },
  saleText: {
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 48,
    fontWeight: 700,
    marginTop: 0,
  },
  checkButton: {
    backgroundColor: 'rgba(219, 48, 34, 1)',
    width: 170,
    borderRadius: 30,
    marginTop: 20,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    padding: 12,
  },
  logoutBtn: {
    marginLeft: 15,
  },
});
