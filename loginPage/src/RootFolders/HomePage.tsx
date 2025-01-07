import React, {Component} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import HomeScreen from '../Screens/DrawerScreens/Home';
import ShopScreen from '../Screens/BottomTabScreens/ShopScreen';
import BagScreen from '../Screens/BottomTabScreens/BagScreen';
import FavoritesScreen from '../Screens/BottomTabScreens/FavoritesScreen';
import ProfilesScreen from '../Screens/BottomTabScreens/ProfilesScreen';
import CustomTabBar from '../components/CustomTabBar';
import {NavigationContainer} from '@react-navigation/native';

import {Alert, Text, View} from 'react-native';

import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import CustomDrawer from '../components/CustomDrawer';
import DetailsScreen from '../Screens/DrawerScreens/AboutScreen';
import Home from '../Screens/DrawerScreens/Home';
import AboutScreen from '../Screens/DrawerScreens/AboutScreen';
import SettingsScreen from '../Screens/DrawerScreens/SettingsScreen';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

export default class HomePage extends Component {
  render() {
    return (
      <>
        <Drawer.Navigator drawerContent={props => <CustomDrawer {...props} />}>
          <Drawer.Screen name="HomeCenter" component={Home} />
          <Drawer.Screen name="About" component={AboutScreen} />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
        </Drawer.Navigator>
      </>
    );
  }
}
