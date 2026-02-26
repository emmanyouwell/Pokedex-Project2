const PokedexService = require('../services/PokedexService');
const catchAsync = require('../utils/catchAsync');

exports.getPokemon = catchAsync(async (req, res, next) => {
    const { count, pokemon } = await PokedexService.getPokemonList(req.query);

    res.status(200).json({
        success: true,
        count,
        pokemon,
    });
});

exports.getSinglePokemon = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const info = await PokedexService.getSinglePokemon(id);

    res.status(200).json({
        success: true,
        pokemon: info
    });
});