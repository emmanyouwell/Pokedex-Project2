import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
const VITE_APP_URL = import.meta.env.VITE_APP_URL;

export const getPokemons = createAsyncThunk(
    'pokedex/getPokemons',
    async ({offset=0, search="", sort="", min="", max=""}, thunkAPI) => {
        try {
            console.log("inside the action")

            let url = `${VITE_APP_URL}/api/v1/pokemon/?offset=${offset}`;

            if (search) {
                url += `&search=${search}`;
            }
            if (sort) {
                url += `&sort=${sort}`;
            }
            if (min) {
                url += `&min=${min}`;
            }
            if (max) {
                url += `&max=${max}`;
            }

            const response = await axios.get(url);
            console.log("response: ", response.data)
            return response.data;
        } catch (error) {
            toast.error(error.response.data.error, {position: "bottom-right"});
            return thunkAPI.rejectWithValue(error.response.data.error);
        }
    }
);



