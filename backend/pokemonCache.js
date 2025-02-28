let pokemonData = []; // Global variable to store data

module.exports = {
    setData: (data) => {
        pokemonData = data; 
    },
    getData: () => pokemonData, 
};