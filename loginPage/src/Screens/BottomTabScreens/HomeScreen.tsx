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
import ShopScreen from './ShopScreen';
import BagScreen from './BagScreen';
import FavoritesScreen from './FavoritesScreen';
import ProfilesScreen from './ProfilesScreen';
const Tab = createBottomTabNavigator();

export default class HomeScreen extends Component {
  handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    Alert.alert('Logged Out');
    this.props.navigation.replace('Signup');
  };

  render() {
    return (
      <View style={styles.mainContainer}>
        <ImageBackground
          style={styles.backGroundImage}
          resizeMode="cover"
          source={require('../../assets/icons/BigBanner.png')}>
          <View style={styles.backGroundImageTextContainer}>
            <Text style={styles.fashionText}>Fashion</Text>
            <Text style={styles.saleText}>sale</Text>
            <TouchableOpacity style={styles.checkButton}>
              <Text style={styles.checkButtonText}>Check</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
        <TouchableOpacity
          onPress={() => this.handleLogout()}
          style={[styles.checkButton, styles.logoutBtn]}>
          <Text style={styles.checkButtonText}>Log out</Text>
        </TouchableOpacity>
      </View>
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
