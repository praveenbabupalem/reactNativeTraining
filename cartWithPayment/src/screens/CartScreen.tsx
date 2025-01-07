import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {RootState} from '../redux/Store';
import {ItemI} from '../Interface';
import CartRenderItem from '../components/CartRenderItem';

import RazorpayCheckout, {ErrorResponse} from 'react-native-razorpay';
import {CheckoutOptions} from 'react-native-razorpay';
import {clearCart} from '../redux/CartSlice';

interface Props {
  cart: ItemI[];
  clearCart: () => {};
}

class CartScreen extends Component<Props> {
  render() {
    const cart = this.props.cart;
    let total = 0;
    cart.forEach(each => (total += each.price));

    return (
      <SafeAreaView style={{flex: 1}}>
        <Text style={styles.heading}>My Bag</Text>
        {cart.length > 0 ? (
          <>
            <FlatList
              data={this.props.cart}
              renderItem={({item}) => <CartRenderItem item={item} />}
              keyExtractor={item => item.id.toString()}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={async () => {
                let totalPaisa = total * 84 * 100;

                var options: CheckoutOptions = {
                  description: 'Credits towards ShoppyApp',
                  image: 'https://i.imgur.com/3g7nmJC.png',
                  currency: 'INR',
                  key: 'rzp_test_68uMD0pCytYXta',
                  amount: Math.round(totalPaisa),
                  name: 'Praveen',
                  prefill: {
                    email: 'praveen@razorpay.com',
                    contact: '8886660000',
                    name: 'Razorpay Software',
                  },
                  theme: {color: 'orange'},
                };
                try {
                  const response = await RazorpayCheckout.open(options);

                  if (response.razorpay_payment_id) {
                    Alert.alert(
                      `Order Succes with Payment ID: ${response.razorpay_payment_id}`,
                    );
                    this.props.clearCart();
                  }
                } catch (error: any) {
                  Alert.alert(`${error.description}`);
                }
              }}>
              <Text style={styles.buyNow}>Total Price: {total.toFixed()}$</Text>
              <Text style={styles.btnText}>Buy Now</Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.noResults}>
            The bag is Empty, Go to the home and Shop now
          </Text>
        )}
      </SafeAreaView>
    );
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    cart: state.cart.cart,
  };
};

const mapDispatchToProps = {
  clearCart,
};

export default connect(mapStateToProps, mapDispatchToProps)(CartScreen);

const styles = StyleSheet.create({
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    margin: 20,
  },
  button: {
    backgroundColor: 'orange',
    margin: 20,
    padding: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 20,
    margin: 30,
  },
  buyNow: {
    fontSize: 17,
    marginTop: 3,
  },
});
