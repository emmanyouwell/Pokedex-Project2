const express = require("express");
const axios = require("axios");
const cors = require("cors");
const pokemonCache = require('./pokemonCache')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

//routes for pokedex
const pokedex = require('./routes/PokedexRoute')
app.use('/api/v1', pokedex) 

//fetch pokemons from pokeapi and store it in a global variable
async function fetchPokemons() {
    try {
        console.log("Fetching Pokémon data...");
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1025");

        
        const details = await Promise.all(
            response.data.results.map(async (pokemon) => {
                try {
                    const idAndType = await axios.get(pokemon.url);
                    return {
                        ...pokemon,
                        id: idAndType.data.id,
                        type: idAndType.data.types
                    };
                } catch (error) {
                    console.error(`Error fetching details for ${pokemon.name}`, error);
                    return { ...pokemon, id: null, type: null };
                }
            })
        );

        
        pokemonCache.setData(details);
        console.log("Pokémon data loaded successfully! ✅");

    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

//start server after fetching pokemons
fetchPokemons().then(()=>app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
}));
