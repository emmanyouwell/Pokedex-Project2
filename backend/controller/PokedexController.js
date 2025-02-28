const axios = require('axios');
let nameDescPokemon = [];
let nameAscPokemon = [];

exports.getPokemon = async (req, res) => {
    try {
        const { offset, search, sort } = req.query;

        let url = `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${offset}`;

        if (search) {
            url = `https://pokeapi.co/api/v2/pokemon/${search}`;
        }
        if (sort) {
            if (sort === "nameDesc" || sort === "nameAsc") {
                url = `https://pokeapi.co/api/v2/pokemon/?limit=1025&offset=${offset}`;
            }

            else {
                url = `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${offset}`;
            }

        }
        const response = await axios.get(url);
        if (!response) {
            res.status(404).json({ error: 'Pokemon Not Found' });
        }
        let details;
        let next;
        let previous;
        
        if (search) {
            details = {
                id: response.data.id,
                name: response.data.name,
                type: response.data.types,
                count: response.data.length
            }
        }
        else if (sort) {
            if (sort === "idDesc") {
                const parsedURL = new URL(response.data.previous);
                previous = parsedURL.searchParams.get('offset');
                details = await Promise.all(
                    response.data.results.map(async (pokemon) => {
                        try {
                            const idAndType = await axios.get(pokemon.url);
                            return {
                                ...pokemon,
                                id: idAndType.data.id,
                                type: idAndType.data.types
                            }
                        } catch (error) {
                            console.error(`Error fetching details for ${pokemon.name}`, error);
                            return { ...pokemon, id: null, type: null }
                        }

                    })
                )
                details.sort((a, b) => b.id - a.id)
            }
            else if (sort === "idAsc") {
                const parsedURL = new URL(response.data.next);
                if (response.data.previous) {
                    const parsedURL2 = new URL(response.data.previous);
                    previous = parsedURL2.searchParams.get('offset');
                }
                next = parsedURL.searchParams.get('offset');

                details = await Promise.all(
                    response.data.results.map(async (pokemon) => {
                        try {
                            const idAndType = await axios.get(pokemon.url);
                            return {
                                ...pokemon,
                                id: idAndType.data.id,
                                type: idAndType.data.types
                            }
                        } catch (error) {
                            console.error(`Error fetching details for ${pokemon.name}`, error);
                            return { ...pokemon, id: null, type: null }
                        }

                    })
                )
            }
            else if (sort === "nameDesc") {
                if (nameDescPokemon.length > 0) {
                    const limit = 10;
                    const startIndex = (offset - 1) * limit;
                    const endIndex = offset * limit;
                    details = nameDescPokemon.slice(startIndex, endIndex);
                }
                else {
                    if (response.data.previous) {
                        const parsedURL = new URL(response.data.previous);
                        previous = parsedURL.searchParams.get('offset');
                    }
                    details = await Promise.all(
                        response.data.results.map(async (pokemon) => {
                            try {
                                const idAndType = await axios.get(pokemon.url);
                                return {
                                    ...pokemon,
                                    id: idAndType.data.id,
                                    type: idAndType.data.types
                                }
                            } catch (error) {
                                console.error(`Error fetching details for ${pokemon.name}`, error);
                                return { ...pokemon, id: null, type: null }
                            }

                        })
                    )
                    nameDescPokemon = [...details].sort((a, b) => b.name.localeCompare(a.name))
                    const limit = 10;
                    const startIndex = (offset - 1) * limit;
                    const endIndex = offset * limit;
                    details = details.sort((a, b) => b.name.localeCompare(a.name)).slice(startIndex, endIndex);
                    
                }

            }
            else if (sort === "nameAsc") {
                if (nameAscPokemon.length > 0) {
                    const limit = 10;
                    const startIndex = (offset - 1) * limit;
                    const endIndex = offset * limit;
                    details = nameAscPokemon.slice(startIndex, endIndex);
                }
                else {
                    if (response.data.previous) {
                        const parsedURL = new URL(response.data.previous);
                        previous = parsedURL.searchParams.get('offset');
                    }
                    details = await Promise.all(
                        response.data.results.map(async (pokemon) => {
                            try {
                                const idAndType = await axios.get(pokemon.url);
                                return {
                                    ...pokemon,
                                    id: idAndType.data.id,
                                    type: idAndType.data.types
                                }
                            } catch (error) {
                                console.error(`Error fetching details for ${pokemon.name}`, error);
                                return { ...pokemon, id: null, type: null }
                            }

                        })
                    )
                    nameAscPokemon = [...details].sort((a, b) => a.name.localeCompare(b.name));
                    const limit = 10;
                    const startIndex = (offset - 1) * limit;
                    const endIndex = offset * limit;
                    details = details.sort((a, b) => a.name.localeCompare(b.name)).slice(startIndex, endIndex);
                    
                }
            }
        }
        else {
            const parsedURL = new URL(response.data.next);
            if (response.data.previous) {
                const parsedURL2 = new URL(response.data.previous);
                previous = parsedURL2.searchParams.get('offset');
            }
            next = parsedURL.searchParams.get('offset');

            details = await Promise.all(
                response.data.results.map(async (pokemon) => {
                    try {
                        const idAndType = await axios.get(pokemon.url);
                        return {
                            ...pokemon,
                            id: idAndType.data.id,
                            type: idAndType.data.types
                        }
                    } catch (error) {
                        console.error(`Error fetching details for ${pokemon.name}`, error);
                        return { ...pokemon, id: null, type: null }
                    }

                })
            )
        }


        res.status(200).json({
            success: true,
            next,
            previous,
            count: response.data.count,
            pokemon: details,
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Pokemon not found' });
    }
}