import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {v4 as uuidv4} from 'uuid';
import axios from 'axios';

export interface TodoItem {
  id: string;
  todo: string;
  completed: boolean;
  isEditing: boolean;
}

export interface TodosState {
  todoList: TodoItem[];
  status: string;
  error: string | undefined;
  editingId: number;
}

const initialState: TodosState = {
  todoList: [],
  status: '',
  error: '',
  editingId: 0,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await axios.get('https://dummyjson.com/todos?limit=5');
  return response.data.todos;
});

export const TodosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo = {
        id: uuidv4(),
        todo: action.payload,
        completed: false,
        isEditing: false,
      };
      if (action.payload.trim() !== '') {
        state.todoList.push(newTodo);
      }
    },

    deleteTodo: (state, action: PayloadAction<string>) => {
      state.todoList = state.todoList.filter(
        todo => todo.id !== action.payload,
      );
    },

    updateTodo: (state, action: PayloadAction<{id: string; todo: string}>) => {
      const {id, todo} = action.payload;
      const existingTodo = state.todoList.find(todo => todo.id === id);
      if (existingTodo) {
        existingTodo.todo = todo;
        existingTodo.isEditing = false;
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.todoList = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const {addTodo, deleteTodo, updateTodo} = TodosSlice.actions;

export default TodosSlice.reducer;
