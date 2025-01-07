import './gesture-handler.js';

import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {Component} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {ActivityIndicator, Text, View} from 'react-native';
import Login from './src/RootFolders/Login.tsx';
import HomePage from './src/RootFolders/HomePage.tsx';
import Signup from './src/RootFolders/Signup.tsx';
const Stack = createNativeStackNavigator();

interface Props {}
interface State {
  isTokenAvailable: boolean;
  isLoading: boolean;
}

import {ThemeContext, ThemeProvider} from './src/Context.tsx';
class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isTokenAvailable: false,
      isLoading: true,
    };
  }
  getToken = async () => {
    const token = await AsyncStorage.getItem('token');
    return token;
  };

  async componentDidMount() {
    const token = await this.getToken();
    if (token) {
      this.setState({isTokenAvailable: true});
    }
    this.setState({isLoading: false});
  }

  render() {
    const {isLoading, isTokenAvailable} = this.state;
    if (isLoading) {
      return (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator size="large" color="red" />
        </View>
      );
    }

    return (
      <ThemeProvider>
        <ThemeContext.Consumer>
          {({theme}) => {
            return (
              <NavigationContainer theme={theme=="light"? DefaultTheme:DarkTheme}>
                <Stack.Navigator
                  initialRouteName={isTokenAvailable ? 'HomePage' : 'Signup'}
                  screenOptions={{headerShown: false}}>
                  <Stack.Screen name="Login" component={Login} />
                  <Stack.Screen name="Signup" component={Signup} />
                  <Stack.Screen name="HomePage" component={HomePage} />
                </Stack.Navigator>
              </NavigationContainer>
            );
          }}
        </ThemeContext.Consumer>
      </ThemeProvider>
    );
  }
}

export default App;
