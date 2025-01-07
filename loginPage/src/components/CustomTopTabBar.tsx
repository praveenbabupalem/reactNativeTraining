import {View, StyleSheet} from 'react-native';
import {useLinkBuilder} from '@react-navigation/native';
import {Text, PlatformPressable} from '@react-navigation/elements';

import {ThemeContext} from '../Context';

export default function CustomTopTabBar({state, descriptors, navigation}) {
  const {buildHref} = useLinkBuilder();

  return (
    <ThemeContext.Consumer>
      {({theme}) => {
        return (
          <View style={theme == 'light' ? styles.tabBar : [styles.tabBar,{backgroundColor:"dark"}]}>
            {state.routes.map((route, index) => {
              const {options} = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const isFocused = state.index === index;

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
                  style={
                    isFocused
                      ? [styles.itemContainer, styles.focusedItemContainer]
                      : styles.itemContainer
                  }>
                  <Text
                    style={{
                      color: theme=='light'?"black":"whitesmoke",
                      textAlign: 'center',
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
  },
  itemContainer: {
    flex: 1,
    paddingBottom: 15,
    paddingTop: 15,
  },
  focusedItemContainer: {
    borderBottomColor: '#DB3022',
    borderBottomWidth: 3,
  },
});
