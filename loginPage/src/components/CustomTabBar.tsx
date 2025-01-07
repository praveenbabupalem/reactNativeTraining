import {View, StyleSheet} from 'react-native';
import {useLinkBuilder} from '@react-navigation/native';
import {Text, PlatformPressable} from '@react-navigation/elements';

import MaterilIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {ThemeContext} from '../Context';

export default function CustomTabBar({state, descriptors, navigation}) {
  const {buildHref} = useLinkBuilder();

  return (
    <ThemeContext.Consumer>
      {({theme}) => {
        return (
          <View
            style={
              theme == 'light'
                ? styles.tabBar
                : [styles.tabBar, {backgroundColor: 'dark'}]
            }>
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
              } else if (route.name === 'Shop') {
                iconName = isFocused ? 'cart' : 'cart-outline';
              } else if (route.name === 'Bag') {
                iconName = isFocused ? 'bag-personal' : 'bag-personal-outline';
              } else if (route.name === 'Favorites') {
                iconName = isFocused ? 'heart' : 'heart-outline';
              } else if (route.name === 'Profile') {
                iconName = isFocused ? 'account' : 'account-outline';
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
                    color={
                      isFocused
                        ? '#DB3022'
                        : theme == 'light'
                        ? 'black'
                        : 'whitesmoke'
                    }
                    size={30}
                    style={{opacity: isFocused ? 1 : 0.3}}
                  />
                  <Text
                    style={{
                      color: isFocused
                        ? '#DB3022'
                        : theme == 'light'
                        ? 'black'
                        : 'whitesmoke',
                    }}>
                    {label}
                  </Text>
                </PlatformPressable>
              );
            })}
          </View>
        );
      }}
    </ThemeContext.Consumer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
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
});
