import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
const VITE_APP_URL = import.meta.env.VITE_APP_URL;

export const getPokemons = createAsyncThunk(
    'pokedex/getPokemons',
    async ({offset=0, search="", sort=""}, thunkAPI) => {
        try {
            console.log("inside the action")
            const response = await axios.get(`${VITE_APP_URL}/api/v1/pokemon/?offset=${offset}&search=${search}&sort=${sort}`);
            console.log("response: ", response.data)
            return response.data;
        } catch (error) {
            toast.error(error.response.data.error, {position: "bottom-right"});
            return thunkAPI.rejectWithValue(error.response.data.error);
        }
    }
);



