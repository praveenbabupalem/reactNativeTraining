import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import CartScreen from './src/screens/CartScreen';
import {Provider} from 'react-redux';
import {store} from './src/redux/Store';
import CustomTabBar from './src/components/CustomTabBar';
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{headerShown: false}}
          tabBar={props => <CustomTabBar {...props} />}
          >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
