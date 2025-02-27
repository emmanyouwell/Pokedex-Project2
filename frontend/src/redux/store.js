// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import pokedexReducer from './slices/pokedexSlice'
const store = configureStore({
  reducer: {
    pokedex: pokedexReducer,
  },
});

export default store;
