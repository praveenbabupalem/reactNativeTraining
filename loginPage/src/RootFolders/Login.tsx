import {Component} from 'react';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import Icon from 'react-native-vector-icons/AntDesign';
import CheckIcon from 'react-native-vector-icons/AntDesign';
import CloseIcon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import EyeIcon from 'react-native-vector-icons/Entypo';

const screenHeight = Dimensions.get('screen').height;
const screenWidth = Dimensions.get('screen').width;

interface State {
  mail: string;
  password: string;
  validMail: boolean;
  validPassword: boolean;
  showPassword: boolean;
  showIcon: boolean;
}
interface Props {}

class Login extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mail: 'eve.holt@reqres.in', //eve.holt@reqres.in
      password: 'pistol', //pistol
      validMail: true,
      validPassword: true,
      showPassword: false,
      showIcon: false,
    };
  }

  setMail = (text: string) => {
    this.setState({mail: text});
  };

  setPassword = (text: string) => {
    this.setState({password: text});
  };

  validateMail = () => {
    const {mail, password} = this.state;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail || !emailRegex.test(mail)) {
      this.setState({validMail: false});
      return false;
    } else {
      this.setState({validMail: true});
      return true;
    }
  };

  validatePassword = () => {
    const {password} = this.state;
    if (!password || password.length < 3) {
      this.setState({validPassword: false});
      return false;
    } else {
      this.setState({validPassword: true});
      return true;
    }
  };

  initiateLogin = async () => {
    const isValidMail = this.validateMail();
    const isValidPassword = this.validatePassword();
    if (!isValidMail || !isValidPassword) {
      return;
    }

    const {mail, password} = this.state;

    const url = 'https://reqres.in/api/login';

    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        email: mail,
        password: password,
        expiresInMins: 30,
      }),
      credentials: 'include',
    };
    const {validMail, validPassword} = this.state;
    if (validMail && validPassword) {
      const fetchData = async () => {
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          const {token} = data;
          try {
            await AsyncStorage.setItem('token', token);
            Alert.alert('Login Successfull');
            this.props.navigation.replace('HomePage');
          } catch (e) {
            Alert.alert('Setting Token Failed', JSON.stringify(e));
          }
        } else {
          Alert.alert('Login Failed');
  
        }
      };

      fetchData();
    }
  };

  render() {
    const {mail, password} = this.state;
    return (
      <SafeAreaView style={{backgroundColor: '#f1f1f1'}}>
        <ScrollView>
          <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
              <Icon
                name="left"
                size={20}
                onPress={() => this.props.navigation.navigate('Signup')}
              />
              <Text style={styles.heading}>Login </Text>
            </View>
            <View style={styles.loginBodyContainer}>
              <View
                style={
                  this.state.validMail ? styles.inputElCon : styles.inputElCon2
                }>
                <TextInput
                  style={styles.placeholder}
                  placeholder="Email"
                  value={mail}
                  autoCapitalize="none"
                  onChangeText={text => {
                    this.setMail(text);
                    this.validateMail();
                    this.setState({showIcon: true});
                  }}
                />

                {this.state.showIcon ? (
                  this.state.validMail ? (
                    <CheckIcon
                      name="check"
                      color={'green'}
                      size={20}
                      style={styles.inputIcon}
                    />
                  ) : (
                    <CloseIcon
                      name="close"
                      color={'red'}
                      size={20}
                      style={styles.inputIcon}
                    />
                  )
                ) : (
                  ''
                )}
              </View>
              {!this.state.validMail && (
                <Text style={styles.errorMsg}>
                  Not valid mail address. Should be your@gmail.com
                </Text>
              )}
              <View
                style={
                  this.state.validPassword
                    ? styles.inputElCon
                    : styles.inputElCon2
                }>
                <TextInput
                  style={styles.placeholder}
                  placeholder="Password"
                  value={password}
                  secureTextEntry={!this.state.showPassword}
                  onChangeText={text => {
                    this.setPassword(text);
                    this.validatePassword();
                  }}
                />
                <TouchableOpacity
                  onPress={() =>
                    this.setState({showPassword: !this.state.showPassword})
                  }>
                  {this.state.showPassword ? (
                    <EyeIcon
                      name="eye-with-line"
                      color={'black'}
                      size={20}
                      style={styles.inputIcon}
                    />
                  ) : (
                    <EyeIcon
                      name="eye"
                      color={'black'}
                      size={20}
                      style={styles.inputIcon}
                    />
                  )}
                </TouchableOpacity>
              </View>
              {!this.state.validPassword && (
                <Text style={styles.errorMsg}>Not a valid Password.</Text>
              )}
            </View>
            <View style={styles.forgotContainer}>
              <Text style={styles.forgotText}>Fogot your password?</Text>
              <Icon2 name="long-arrow-right" size={20} color={'#DB3022'} />
            </View>
            <TouchableOpacity
              style={styles.loginBtn}
              onPress={this.initiateLogin}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontFamily: 'Metropolis',
                }}>
                LOGIN
              </Text>
            </TouchableOpacity>

            <View style={styles.socialAccountContainer}>
              <Text style={styles.socialText}>
                Or login with social account
              </Text>
              <View style={styles.iconsContainer}>
                <View style={styles.iconContainer}>
                  <Image source={require('../assets/icons/google.png')} />
                </View>
                <View style={styles.iconContainer}>
                  <Image
                    height={24}
                    width={24}
                    source={require('../assets/icons/facebook.png')}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    height: screenHeight,
    backgroundColor: '#f1f1f1',
    padding: 15,
    flexDirection: 'column',
    position: 'relative',
  },
  heading: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 32,
    marginTop: 30,
    lineHeight: 34,
  },
  headerContainer: {height: 140, marginTop: 15},
  loginBodyContainer: {marginTop: 15},
  inputElCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: Platform.OS === 'ios' ? 18 : 10,
    borderRadius: 5,
    fontSize: 14,
  },
  inputElCon2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: Platform.OS === 'ios' ? 18 : 10,
    borderRadius: 5,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'red',
  },
  placeholder: {
    fontSize: 17,
    fontFamily: 'Metropolis',
    flex: 1,
  },

  errorMsg: {
    color: '#F01F0E',
    fontSize: 15,
    marginBottom: 7,
    fontFamily: 'Metropolis',
  },

  forgotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotText: {
    fontFamily: 'Metropolis',
    fontSize: 17,
    lineHeight: 20,
    marginRight: 8,
  },
  loginBtn: {
    backgroundColor: '#DB3022',
    borderRadius: 35,
    height: 48,
    justifyContent: 'center',
    marginTop: 30,
  },
  socialAccountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 150,
    left: (screenWidth - 190) / 2,
  },
  socialText: {
    marginBottom: 15,
    fontFamily: 'Metropolis',
    fontSize: 15,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: '#fff',
    height: 64,
    width: 92,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderRadius: 24,
  },
});
