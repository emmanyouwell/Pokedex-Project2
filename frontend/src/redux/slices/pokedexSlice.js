import { createSlice } from '@reduxjs/toolkit';
import { getPokemons } from '../actions/pokedexAction';
export const pokedexSlice = createSlice({
    name: 'donor',
    initialState: {
        pokemons: [],
        loading: false,
        error: null,
        offset: 0,
        next: 0,
        count: 0,
        pokemonDetails: {},
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder

            .addCase(getPokemons.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getPokemons.fulfilled, (state, action) => {
                state.loading = false;
                state.pokemons = action.payload.pokemon;
                state.next = action.payload.next;
                state.count = action.payload.count;
            })
            .addCase(getPokemons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })



    },
});

export default pokedexSlice.reducer;
