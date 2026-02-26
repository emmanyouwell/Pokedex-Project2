import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setCachedPokemons } from '../slices/pokedexSlice';
const VITE_APP_URL = import.meta.env.VITE_APP_URL;

export const getPokemons = createAsyncThunk(
    'pokedex/getPokemons',
    async ({ offset = 0, search = "", sort = "", min = "", max = "" }, thunkAPI) => {
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

            // SWR: Check cache first
            const cacheKey = `pokedex_${url}`;
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const parsedData = JSON.parse(cachedData);
                    thunkAPI.dispatch(setCachedPokemons(parsedData));
                } catch (e) {
                    console.error("Error parsing cache", e);
                }
            }

            const response = await axios.get(url);
            console.log("response: ", response.data);

            // Save fresh data to cache
            localStorage.setItem(cacheKey, JSON.stringify(response.data));

            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || "Error fetching pokemons", { position: "bottom-right" });
            return thunkAPI.rejectWithValue(error.response?.data?.error || "Error");
        }
    }
);

export const getSinglePokemon = createAsyncThunk(
    'pokedex/getSinglePokemon',
    async (id, thunkAPI) => {
        try {
            const response = await axios.get(`${VITE_APP_URL}/api/v1/pokemon/${id}`);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.error || "Error", { position: "bottom-right" });
            return thunkAPI.rejectWithValue(error.response?.data?.error || "Error");
        }
    }
);
