import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {decrementQuantity, incrementQuantity} from '../redux/CartSlice';
import {connect} from 'react-redux';
import {RootState} from '../redux/Store';
import {ItemI} from '../Interface';
import {Component} from 'react';

interface Props {
  cart: ItemI[];
  item: ItemI;
  decrementQuantity: (id: number) => {};
  incrementQuantity: (id: number) => {};
}

class CartRendeItem extends Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  getItemQuantity = (id: number) => {
    const item = this.props.cart.find(cartItem => cartItem.id === id);
    return item ? item.quantity : 0;
  };

  render() {
    const {item} = this.props;
    const quantity = this.getItemQuantity(item.id);
    return (
      <View style={styles.productContainer}>
        <View style={styles.imgContainer}>
          <Image source={{uri: item.thumbnail}} style={styles.image} />
        </View>
        <View style={styles.descContainer}>
          <Text>{item.title}</Text>
          <Text>Price:{item.price}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row'}}>
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
            <Text>{quantity * item.price}$</Text>
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    cart: state.cart.cart,
  };
};

const mapDispatchToProps = {
  incrementQuantity,
  decrementQuantity,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartRendeItem);

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 20,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 15,
    flex: 1,
  },
  imgContainer: {
    backgroundColor: 'whitesmoke',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    overflow: 'hidden',
  },
  image: {
    marginTop: 10,
    height: 120,
    width: 120,
  },
  descContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 10,
    flex: 1,
  },
  countButtons: {
    backgroundColor: '#fff',
    height: 25,
    width: 25,
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
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    textAlignVertical: 'center',
  },
});
