import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {fetchTodos} from '../TodosSlice';
import {RootState, useAppDispatch} from '../Store';

interface IProps {
  navigation: NavigationProp<ParamListBase>;
}

export default function RequestScreen({navigation}: IProps) {
  //const navigation = useNavigation();
  const dispatch = useAppDispatch();

  const {status, todoList} = useSelector(
    (state: RootState) => state.todosReducer,
  );

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      {status === 'loading' ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : status === 'succeeded' ? (
        <TouchableOpacity onPress={() => navigation.navigate('Todos')}>
          <Text style={styles.heading}>Go to Todos</Text>
        </TouchableOpacity>
      ) : status === 'failed' ? (
        <Text style={styles.heading}>Fetching failed, can't go to todos</Text>
      ) : (
        <Text style={styles.heading}>Something went wrong!</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  heading: {
    fontWeight: 'bold',
    fontSize: 20,
  },
});
