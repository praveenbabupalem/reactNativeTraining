import {StyleSheet, Text} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';

export default function Rating({rating}) {
  return (
    <>
      {/* {rating.map(() => (
        <Icon name="star" color={'#ffba4a'} size={15} />
      ))} */}

      <Text style={styles.rating}>{'* '.repeat(Math.round(rating))}</Text>
    </>
  );
}
const styles = StyleSheet.create({
  rating: {
    fontWeight: 'bold',
    color: '#ffba4a',
    fontSize: 20,
  },
});
