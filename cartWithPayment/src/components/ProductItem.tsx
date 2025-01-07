import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {Component} from 'react';
import {ItemI} from '../Interface';

const screenWidth = Dimensions.get('screen').width;

import Icon from 'react-native-vector-icons/Feather';
import {RootState} from '../redux/Store';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from '../redux/CartSlice';
import {connect} from 'react-redux';

interface Props {
  item: ItemI;
  cart: ItemI[];
  addToCart: (item: ItemI) => {};
  decrementQuantity: (id: number) => {};
  incrementQuantity: (id: number) => {};
}

class ProductItem extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const {item} = this.props;
    const slicedTitle = item.title.slice(0, 15);


    const getItemQuantity = (id: number) => {
      const item1 = this.props.cart.find(cartItem => cartItem.id === id);
      return item1 ? item1.quantity : 0;
    };
    const quantity = getItemQuantity(item.id);

    return (
      <View style={styles.productContainer}>
        <View style={styles.cartIconContainer}>
          <Icon name="shopping-bag" size={20} color="#fff" />
        </View>

        <View style={styles.imgContainer}>
          <Text style={styles.discount}>{item.discountPercentage}%</Text>
          <Image source={{uri: item.thumbnail}} style={styles.image} />
        </View>
        <View style={styles.productDetails}>
          <Text style={styles.brand}>{item.brand ? item.brand : 'Other'}</Text>
          <Text style={styles.title}>
            {item.title.length > 15 ? slicedTitle + '..' : item.title}
          </Text>
          <Text style={styles.stock}>Stock: ({item.stock})</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.oldPrice}>{item.price}$</Text>
            <Text style={styles.price}>
              {(
                item.price -
                (item.price * item.discountPercentage) / 100
              ).toFixed(2)}
              $
            </Text>
          </View>

          <View style={styles.addContainer}>
            {quantity === 0 ? (
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => this.props.addToCart(item)}>
                <Text style={styles.addBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            ) : (
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TouchableOpacity
                  style={styles.countButtons}
                  onPress={() => this.props.decrementQuantity(item.id)}>
                  <Text style={styles.countText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{alignSelf: 'center'}}>
                  <Text style={[styles.countText, {marginLeft: 8}]}>
                    {quantity}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.countButtons}
                  onPress={() => this.props.incrementQuantity(item.id)}>
                  <Text style={styles.countText}>+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    status: state.cart.status,
    productList: state.cart.productList,
    cart: state.cart.cart,
  };
};

const mapDispatchToProps = {
  addToCart,
  incrementQuantity,
  decrementQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductItem);

const styles = StyleSheet.create({
  productContainer: {
    paddingBottom: 10,
    width: (screenWidth - 38) / 2,
    borderWidth: 0.1,
    margin: 8,
    borderRadius: 15,
    backgroundColor: 'white',
  },
  cartIconContainer: {
    position: 'absolute',
    backgroundColor: '#db3121',
    zIndex: 1000,
    top: '51%',
    left: '73%',
    padding: 13,
    borderRadius: 50,
    opacity: 0.9,
  },
  discount: {
    color: '#fff',
    padding: 6,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#900C3F', //#db3121
    borderRadius: 20,
    position: 'absolute',
    zIndex: 1000,
    top: 10,
    left: 10,
  },
  image: {
    marginTop: 10,
    height: 200,
  },
  imgContainer: {
    height: 220,
    backgroundColor: '#f1f1f1',
    borderRadius: 15,
  },
  productDetails: {
    padding: 10,
  },

  brand: {
    fontSize: 15,
    color: 'lightgrey',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 500,
  },
  stock: {
    fontSize: 15,
    color: 'grey',
    fontWeight: 'bold',
  },
  priceContainer: {
    flexDirection: 'row',
    gap: 5,
    width: 200,
  },
  oldPrice: {
    fontSize: 17,
    fontWeight: 500,
    textDecorationLine: 'line-through',
  },
  price: {
    fontSize: 17,
    fontWeight: 500,

    color: '#db3121',
  },

  addContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    alignItems: 'center',
  },
  addBtn: {
    backgroundColor: '#db3121',
    padding: 7,
    borderRadius: 15,
    width: 100,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
  countButtons: {
    backgroundColor: '#fff',
    height: 35,
    width: 35,
    borderRadius: 80,
    margin: 8,
    marginRight: 0,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: 'center',
  },
  countText: {
    color: 'grey',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});
