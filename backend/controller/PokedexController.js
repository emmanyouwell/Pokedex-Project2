const axios = require('axios');

exports.getPokemon = async (req, res) => {
    try {
        const {offset} = req.query;
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/?limit=10&offset=${offset}`);
        if (!response) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
        const parsedURL = new URL(response.data.next);
        const next = parsedURL.searchParams.get('offset');
        const details = await Promise.all(
            response.data.results.map(async (pokemon) => {
                try{
                    const idAndType = await axios.get(pokemon.url);
                    return {
                        ...pokemon,
                        id: idAndType.data.id,
                        type: idAndType.data.types
                    }
                }catch (error) {
                    console.error(`Error fetching details for ${pokemon.name}`, error);
                    return {...pokemon, id: null, type: null}
                }
                
            })
        )
        res.status(200).json({
            success: true,
            next,
            count: response.data.count,
            pokemon: details
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}