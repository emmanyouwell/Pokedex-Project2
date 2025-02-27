const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allow CORS
app.use(express.json()); // Parse JSON request bodies


const pokedex = require('./routes/PokedexRoute')
app.use('/api/v1', pokedex)
// Sample API route that calls an external API
app.get("/api/data", async (req, res) => {
    try {
        const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
