const axios = require('axios');

let basicList = []; // Stores { id, name, url }
let detailsCache = {}; // Stores details by pokemon id
let lastCount = 0;

const fetchBasicList = async () => {
    try {
        console.log("Fetching basic list of Pokémon...");
        const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10000"); // fetch all
        const results = response.data.results;

        basicList = results.map(pokemon => {
            // Extract ID from url e.g. https://pokeapi.co/api/v2/pokemon/1/
            const urlParts = pokemon.url.split('/');
            const id = parseInt(urlParts[urlParts.length - 2]);
            return {
                ...pokemon,
                id: id
            };
        });
        lastCount = response.data.count;
        console.log(`Basic list loaded successfully! ✅ Count: ${lastCount}`);
    } catch (err) {
        console.error("Error fetching basic list", err);
    }
}

const checkForUpdatesInBackground = () => {
    setInterval(async () => {
        try {
            const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1");
            if (response.data.count > lastCount) {
                console.log(`New Pokémon detected! Previous count: ${lastCount}, New Count: ${response.data.count}. Refreshing list...`);
                await fetchBasicList();
            }
        } catch (error) {
            console.error("Error checking for updates in background", error);
        }
    }, 60 * 60 * 1000); // Check every hour
}

module.exports = {
    fetchBasicList,
    checkForUpdatesInBackground,
    getBasicList: () => basicList,
    setPokemonDetails: (id, data) => {
        detailsCache[id] = data;
    },
    getPokemonDetails: (id) => detailsCache[id],
};