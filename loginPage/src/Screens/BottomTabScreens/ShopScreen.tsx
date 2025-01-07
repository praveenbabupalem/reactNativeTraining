import {Text, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CustomTopTabBar from '../../components/CustomTopTabBar';
import {ThemeContext} from '../../Context';
const TopTab = createMaterialTopTabNavigator();

function GadgetsScreen() {
  return (
    <ThemeContext.Consumer>
      {({theme}) => {
        return (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: theme == 'light' ? 'black' : 'whitesmoke'}}>
              Gadgets Screen
            </Text>
          </View>
        );
      }}
    </ThemeContext.Consumer>
  );
}

function FashionScreen() {
  return (
    <ThemeContext.Consumer>
      {({theme}) => {
        return (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: theme == 'light' ? 'black' : 'whitesmoke'}}>
              Fashion Screen
            </Text>
          </View>
        );
      }}
    </ThemeContext.Consumer>
  );
}

function FurnitureScreen() {
  return (
    <ThemeContext.Consumer>
      {({theme}) => {
        return (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text style={{color: theme == 'light' ? 'black' : 'whitesmoke'}}>
              Furniture Screen
            </Text>
          </View>
        );
      }}
    </ThemeContext.Consumer>
  );
}

export default function ShopScreen() {
  return (
    <TopTab.Navigator tabBar={props => <CustomTopTabBar {...props} />}>
      <TopTab.Screen name="Gadgets" component={GadgetsScreen} />
      <TopTab.Screen name="Fashion" component={FashionScreen} />
      <TopTab.Screen name="Furniture" component={FurnitureScreen} />
    </TopTab.Navigator>
  );
}
