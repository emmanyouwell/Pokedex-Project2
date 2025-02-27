import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const VITE_APP_URL = import.meta.env.VITE_APP_URL;

export const getPokemons = createAsyncThunk(
    'pokedex/getPokemons',
    async ({offset=0}, thunkAPI) => {
        try {
            
            const response = await axios.get(`${VITE_APP_URL}/api/v1/pokemon/?offset=${offset}`)

            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);



