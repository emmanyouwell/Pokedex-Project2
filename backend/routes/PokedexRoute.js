const express = require('express');
const router = express.Router();

const {getPokemon} = require('../controller/PokedexController');

router.get('/pokemon', getPokemon);

module.exports = router;