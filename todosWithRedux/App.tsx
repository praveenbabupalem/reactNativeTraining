import './gesture-handler';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import RequestScreen from './src/screens/RequestScreen';
import TodosScreen from './src/screens/TodosScreen';
import {Provider} from 'react-redux';
import {store} from './src/Store';

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Request">
          <Stack.Screen name="Request" component={RequestScreen} />
          <Stack.Screen name="Todos" component={TodosScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
