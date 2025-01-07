import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  TextInput,
  Platform,
  StyleSheet,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RootState} from '../redux/Store';
import {
  addToCart,
  decrementQuantity,
  fetchData,
  incrementQuantity,
} from '../redux/CartSlice';

import Icon from 'react-native-vector-icons/Feather';

import {ItemI} from '../Interface';
import ProductItem from '../components/ProductItem';

interface Props {
  fetchData: () => {};
  status: string;
  productList: ItemI[];
}

interface State {
  searchText: string;
}

class HomeScreen extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchText: '',
    };
  }

  componentDidMount(): void {
    this.props.fetchData();
  }

  render(): React.ReactNode {
    const filteredData = this.props.productList.filter(each =>
      each.title.toLowerCase().includes(this.state.searchText.toLowerCase()),
    );

    return (
      <>
        {this.props.status === 'succeeded' ? (
          <SafeAreaView>
            <View style={styles.mainContainer}>
              <View style={styles.searchBar}>
                <TextInput
                  onChangeText={text => this.setState({searchText: text})}
                  placeholder="Search Product"
                  value={this.state.searchText}
                  style={{flex: 1}}
                />
                <View>
                  <Icon name="search" size={20} color={'grey'} />
                </View>
              </View>
              {filteredData.length === 0 ? (
                <Text style={styles.noResults}> No Results Found !!</Text>
              ) : (
                <>
                  <FlatList
                    numColumns={2}
                    data={filteredData}
                    renderItem={({item}) => <ProductItem item={item} />}
                    keyExtractor={item => item.id.toString()}
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
}

const mapStateToProps = (state: RootState) => {
  return {
    status: state.cart.status,
    productList: state.cart.productList,
  };
};

const mapDispatchToProps = {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  fetchData,
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

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
