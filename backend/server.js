const express = require("express");
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

//start server after fetching basic list
pokemonCache.fetchBasicList().then(() => {
    pokemonCache.checkForUpdatesInBackground();
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
});
