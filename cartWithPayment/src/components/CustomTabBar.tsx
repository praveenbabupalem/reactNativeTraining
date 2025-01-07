import {View, StyleSheet} from 'react-native';
import {useLinkBuilder} from '@react-navigation/native';
import {Text, PlatformPressable} from '@react-navigation/elements';

import MaterilIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useContext, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/Store';

export default function CustomTabBar({state, descriptors, navigation}) {
  const {buildHref} = useLinkBuilder();

  const {cart} = useSelector((state: RootState) => {
    return {
      cart: state.cart,
    };
  });
  const cartLength = cart.cart.length;

  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;
        let iconName;

        if (route.name === 'Home') {
          iconName = isFocused ? 'home' : 'home-outline';
        } else if (route.name === 'Cart') {
          iconName = isFocused ? 'cart' : 'cart-outline';
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <PlatformPressable
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={index}
            style={styles.iconContainer}>
            <MaterilIcons
              name={iconName}
              color={isFocused ? '#DB3022' : 'grey'}
              size={30}
            />

            <Text
              style={{
                color: isFocused ? '#DB3022' : 'grey',
              }}>
              {label}
            </Text>
            {route.name === 'Cart' && (
              <Text style={styles.cartQuantity}>{cartLength}</Text>
            )}
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'whitesmoke',
    paddingBottom: 30,
    paddingTop: 12,
    padding: 20,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
  },
  iconContainer: {
    textAlign: 'center',
    alignItems: 'center',
  },
  cartQuantity: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
    position: 'absolute',
    left: 20,
    bottom: 30,
    backgroundColor: '#fff',

    borderRadius: 40,
  },
});
