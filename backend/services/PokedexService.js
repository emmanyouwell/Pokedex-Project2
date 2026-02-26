const pokemonCache = require('../pokemonCache');
const weaknesses = require('../data/weaknesses.json');
const axios = require('axios');
const AppError = require('../utils/AppError');

exports.getPokemonList = async (queryParams) => {
    const { offset, search, sort, min, max } = queryParams;

    let results = [...pokemonCache.getBasicList()];

    //pagination
    const limit = 10;
    const startIndex = (offset - 1) * limit;
    const endIndex = offset * limit;

    //search feature
    if (search) {
        results = results.filter(pokemon => {
            return (
                pokemon.name.toLowerCase().includes(search.toLowerCase()) ||
                pokemon.id.toString().includes(search)
            );
        });
    }

    //filter feature
    if (min !== undefined || max !== undefined) {
        //convert min and max to number or string
        const from = isNaN(min) ? min : Number(min);
        const to = isNaN(max) ? max : Number(max);


        if ((typeof from === "number" && !isNaN(from)) && (typeof to === "number" && !isNaN(to))) { //filter by id
            results = results.filter(pokemon => {
                return (
                    (from === null || pokemon.id >= from) &&
                    (to === null || pokemon.id <= to) &&
                    pokemon.id !== null
                );
            }).sort((a, b) => a.id - b.id);
        }
        else if (typeof from === "string" && typeof to === "string") { //filter by name
            results = results.filter(pokemon => {
                const firstLetter = pokemon.name.charAt(0).toUpperCase();
                return firstLetter >= from && firstLetter <= to && pokemon.id !== null;
            }).sort((a, b) => a.name.localeCompare(b.name));
        }
    }
    //sort feature
    if (sort) {
        switch (sort) {
            case 'idDesc':
                results = results.filter(pokemon => (pokemon.id !== null)).sort((a, b) => b.id - a.id);
                break;
            case 'idAsc':
                results = results.filter(pokemon => (pokemon.id !== null)).sort((a, b) => a.id - b.id);
                break;
            case 'nameDesc':
                results = results.filter(pokemon => (pokemon.id !== null)).sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'nameAsc':
                results = results.filter(pokemon => (pokemon.id !== null)).sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                break;
        }
    }

    const count = results.length;
    results = results.slice(startIndex, endIndex); //returns 10 pokemons per page

    if (results.length === 0) {
        throw new AppError('Pokemon Not Found', 404);
    }

    // Now we fetch details for the paginated slice
    const details = await Promise.all(
        results.map(async (pokemon) => {
            const cachedDetail = pokemonCache.getPokemonDetails(pokemon.id);
            if (cachedDetail) {
                return cachedDetail;
            }

            try {
                const idAndType = await axios.get(pokemon.url);
                const pokeData = {
                    ...pokemon,
                    type: idAndType.data.types
                };
                pokemonCache.setPokemonDetails(pokemon.id, pokeData);
                return pokeData;
            } catch (error) {
                console.error(`Error fetching details for ${pokemon.name}`, error);
                return { ...pokemon, type: null };
            }
        })
    );

    return { count, pokemon: details };
};

exports.getSinglePokemon = async (id) => {
    const basicList = pokemonCache.getBasicList();
    const pokemon = basicList.find(pokemon => pokemon.id === parseInt(id));

    if (!pokemon) {
        throw new AppError('Pokemon Not Found', 404);
    }

    let response;
    try {
        response = await axios.get(pokemon.url);
    } catch (error) {
        throw new AppError('Error fetching pokemon details', 500);
    }

    if (!response) {
        throw new AppError('Url Not Found', 404);
    }

    const weakness = response.data.types.flatMap(type => {
        const formattedType = type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1).toLowerCase(); // Normalize input
        return weaknesses[formattedType] || []; // Return array directly
    });

    // Remove duplicates
    const uniqueWeaknesses = [...new Set(weakness)];

    let info = {
        id: response.data.id,
        name: response.data.name,
        height: response.data.height / 10,
        weight: response.data.weight / 10,
        types: response.data.types,
        stats: response.data.stats,
        weakness: uniqueWeaknesses
    };

    return info;
};
