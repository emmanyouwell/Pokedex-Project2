import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setCachedPokemons } from '../slices/pokedexSlice';
const VITE_APP_URL = import.meta.env.VITE_APP_URL;

// Cache Constants
const CACHE_PREFIX = "pokedex_";
const MAX_CACHE_ENTRIES = 50;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours

const enforceLRU = () => {
    try {
        const pokedexKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(CACHE_PREFIX)) {
                pokedexKeys.push(key);
            }
        }

        if (pokedexKeys.length > MAX_CACHE_ENTRIES) {
            // Retrieve metadata to sort by lastAccessed
            const cacheEntries = pokedexKeys.map(key => {
                try {
                    const item = JSON.parse(localStorage.getItem(key));
                    return { key, lastAccessed: item.lastAccessed || 0 };
                } catch (e) {
                    return { key, lastAccessed: 0 };
                }
            });

            // Sort ascending by last access time (oldest first)
            cacheEntries.sort((a, b) => a.lastAccessed - b.lastAccessed);

            // Evict items until we are at the max boundary
            const itemsToRemove = cacheEntries.length - MAX_CACHE_ENTRIES;
            for (let i = 0; i < itemsToRemove; i++) {
                localStorage.removeItem(cacheEntries[i].key);
            }
        }
    } catch (e) {
        console.error("Error enforcing LRU cache limits", e);
    }
}

export const getPokemons = createAsyncThunk(
    'pokedex/getPokemons',
    async ({ offset = 0, search = "", sort = "", min = "", max = "" }, thunkAPI) => {
        try {

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

            // SWR: Check cache first with TTL and LRU
            const cacheKey = `${CACHE_PREFIX}${url}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                try {
                    const parsedData = JSON.parse(cachedData);
                    const now = Date.now();

                    // Verify TTL
                    if (now - parsedData.timestamp > CACHE_TTL_MS) {
                        // Expired data, evict it
                        localStorage.removeItem(cacheKey);
                    } else {
                        // Update the last accessed time for LRU algorithm
                        parsedData.lastAccessed = now;
                        localStorage.setItem(cacheKey, JSON.stringify(parsedData));

                        thunkAPI.dispatch(setCachedPokemons(parsedData.data));
                    }
                } catch (e) {
                    console.error("Error parsing cache", e);
                    localStorage.removeItem(cacheKey);
                }
            }

            const response = await axios.get(url);
            console.log("response: ", response.data);

            // Save fresh data to cache wrapping in metadata
            const cachePayload = {
                data: response.data,
                timestamp: Date.now(),
                lastAccessed: Date.now()
            };

            localStorage.setItem(cacheKey, JSON.stringify(cachePayload));

            // Clean up old entries
            enforceLRU();

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
