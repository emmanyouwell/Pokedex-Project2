const express = require('express');
const router = express.Router();

const {getPokemon, getSinglePokemon} = require('../controller/PokedexController');

router.get('/pokemon', getPokemon);
router.get('/pokemon/:id', getSinglePokemon);
module.exports = router;