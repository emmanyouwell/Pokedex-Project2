const axios = require('axios');

let basicList = []; // Stores { id, name, url }
let detailsCache = {}; // Stores details by pokemon id
let lastCount = 0;
let lastRefreshTime = 0;

// Set TTL to 24 hours (in milliseconds)
const CACHE_TTL = 24 * 60 * 60 * 1000;

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
        lastRefreshTime = Date.now();
        console.log(`Basic list loaded successfully! ✅ Count: ${lastCount}`);
    } catch (err) {
        console.error("Error fetching basic list", err);
    }
}

const checkForUpdatesInBackground = () => {
    setInterval(async () => {
        try {
            const timeSinceLastRefresh = Date.now() - lastRefreshTime;
            const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=1");

            // Refresh if count changed, OR if 24 hours have passed since last refresh
            if (response.data.count > lastCount || timeSinceLastRefresh >= CACHE_TTL) {
                console.log(`Pokémon basic list update triggered. Count changed or TTL expired. Refreshing...`);
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
        detailsCache[id] = {
            data: data,
            timestamp: Date.now()
        };
    },
    getPokemonDetails: (id) => {
        const cached = detailsCache[id];
        if (!cached) return null;

        const isExpired = Date.now() - cached.timestamp >= CACHE_TTL;
        if (isExpired) {
            // Delete expired cache to guarantee fresh fetch
            delete detailsCache[id];
            return null;
        }

        return cached.data;
    },
};