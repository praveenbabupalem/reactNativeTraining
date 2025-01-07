import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Platform,
} from 'react-native';
import {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Feather';

import Item from '../Item';

export default function Home() {
  const [searchText, setSerachText] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const respose = await fetch('https://dummyjson.com/products');
      if (respose.ok) {
        const data = await respose.json();
        setCartItems(data.products);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = cartItems.filter(each =>
    each.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <>
      {!isLoading ? (
        <SafeAreaView>
          <View style={styles.mainContainer}>
            <View style={styles.searchBar}>
              <TextInput
                onChangeText={setSerachText}
                placeholder="Search Product"
                value={searchText}
                style={{flex: 1}}
              />
              <View>
                <Icon name="search" size={20} color={'grey'} />
              </View>
            </View>
            {cartItems.length === 0 ? (
              <Text style={styles.noResults}> No Results Found !!</Text>
            ) : (
              <>
                <FlatList
                  numColumns={2}
                  data={filteredData}
                  renderItem={({item}) => <Item item={item} />}
                  keyExtractor={item => item.id.toString()}
                  refreshing={refresh}
                  onRefresh={() => setRefresh(true)}
                />
              </>
            )}
          </View>
        </SafeAreaView>
      ) : (
        <ActivityIndicator size="large" color="#0000ff" style={{flex: 1}} />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 0,
    backgroundColor: 'whitesmoke',
    justifyContent: 'center',
  },
  searchBar: {
    margin: 10,
    borderWidth: 1,
    borderColor: 'lightblue',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: Platform.OS == 'ios' ? 10 : 0,
    paddingTop: Platform.OS == 'ios' ? 10 : 0,
  },
  noResults: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 20,
    fontSize: 20,
    color: '#900C3F',
  },
});
