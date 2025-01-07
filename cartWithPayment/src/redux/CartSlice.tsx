import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ItemI} from '../Interface';
import axios from 'axios';

export const fetchData = createAsyncThunk('products/fetchProduct', async () => {
  const response = await axios.get('https://dummyjson.com/products');
  return response.data.products;
});

interface InitialStateI {
  cart: ItemI[];
  status: string;
  productList: ItemI[];
}

const initialState: InitialStateI = {
  cart: [],
  status: 'initial',
  productList: [],
};

export const CartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItemI>) => {
      state.cart = [...state.cart, {...action.payload, quantity: 1}];
    },
    decrementQuantity: (state, action: PayloadAction<number>) => {
      state.cart = state.cart
        .map(eachItem =>
          eachItem.id === action.payload && eachItem.quantity > 0
            ? {...eachItem, quantity: eachItem.quantity - 1}
            : eachItem,
        )
        .filter(eachItem => eachItem.quantity > 0);
    },
    incrementQuantity: (state, action: PayloadAction<number>) => {
      state.cart = state.cart.map(eachItem =>
        eachItem.id === action.payload
          ? {...eachItem, quantity: eachItem.quantity + 1}
          : eachItem,
      );
    },
    clearCart: state => {
      state.cart = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchData.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productList = action.payload;
      })
      .addCase(fetchData.rejected, state => {
        state.status = 'failed';
      });
  },
});

export const {addToCart, decrementQuantity, incrementQuantity, clearCart} =
  CartSlice.actions;
export default CartSlice.reducer;
