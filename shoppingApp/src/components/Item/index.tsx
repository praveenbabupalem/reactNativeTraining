import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import Rating from '../Rating';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

export default function Item(props) {
  const items = props.item;
  const slicedTitle = items.title.slice(0, 15);
  return (
    <View style={styles.productContainer}>
      <View style={styles.cartIconContainer}>
        <Icon name="shopping-bag" size={20} color="#fff" />
      </View>

      <View style={styles.imgContainer}>
        <Text style={styles.discount}>{items.discountPercentage}%</Text>
        <Image source={{uri: items.thumbnail}} style={styles.image} />
      </View>
      <View style={styles.productDetails}>
        <Rating rating={items.rating} />
        <Text style={styles.brand}>{items.brand ? items.brand : 'Other'}</Text>
        <Text style={styles.title}>
          {items.title.length > 15 ? slicedTitle + '..' : items.title}
        </Text>
        <Text style={styles.stock}>Stock: ({items.stock})</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.oldPrice}>{items.price}$</Text>
          <Text style={styles.price}>
            {(
              items.price -
              (items.price * items.discountPercentage) / 100
            ).toFixed(2)}
            $
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    paddingBottom: 10,
    width: (screenWidth - 30) / 2,
    borderWidth: 0.1,
    margin: 10,
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
});
