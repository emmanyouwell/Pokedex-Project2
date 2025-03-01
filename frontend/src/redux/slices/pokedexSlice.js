import { createSlice } from '@reduxjs/toolkit';
import { getPokemons, getSinglePokemon } from '../actions/pokedexAction';
export const pokedexSlice = createSlice({
    name: 'donor',
    initialState: {
        pokemons: [],
        loading: false,
        error: null,
        count: 0,
        pokemonDetails: {},
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder

            .addCase(getPokemons.pending, (state, action) => {
                state.loading = true;
                
            })
            .addCase(getPokemons.fulfilled, (state, action) => {
                state.loading = false;
                state.pokemons = action.payload.pokemon;
                state.count = action.payload.count;
                
            })
            .addCase(getPokemons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getSinglePokemon.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getSinglePokemon.fulfilled, (state, action) => {
                state.loading = false;
                state.pokemonDetails = action.payload.pokemon
            })
            .addCase(getSinglePokemon.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    },
});
export const {clearError} = pokedexSlice.actions;
export default pokedexSlice.reducer;
