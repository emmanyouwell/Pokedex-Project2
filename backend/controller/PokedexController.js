const axios = require('axios');

exports.getPokemon = async (req, res) => {
    try {
        const { offset, search, sort } = req.query;

        let url = `https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${offset}`;

        if (search) {
            url = `https://pokeapi.co/api/v2/pokemon/${search}`;
        }
        if (sort) {
            if (sort === "nameDesc"){
                url = `https://pokeapi.co/api/v2/pokemon/?limit=1010&offset=${offset}`;    
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
                details.sort((a, b) => b.name.localeCompare(a.name))
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
            pokemon: details
        });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: 'Pokemon not found' });
    }
}