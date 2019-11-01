/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet'); 
const logger = require('./logger');
const { NODE_ENV } = require('./config');
const POKEDEX = require('./store'); 

const app = express();

const morganSetting = NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello!');
});

/* Authentication handler */
app.use(function validateBearerToken(req, res, next) {
    //getting the value of API_TOKEN
    const apiToken = process.env.API_TOKEN;
    //check for the presence of the token header before we split it
    const authToken = req.get('Authorization') || '';

    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Unauthorized request to path: ${req.path}`);
        return res.status(400).send({ error: 'Unauthorized request' });
    }

    // move to the next middleware
    next();
});

//valid types
const validTypes = ['Bug', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'];

app.get('/types', function handleGetTypes(req, res) {
    res.json(validTypes);
});

app.get('/pokemon', function handleGetPokemon(req, res) {
    let response = POKEDEX.pokemon;

    // filter our pokemon by name if name query param is present
    if(req.query.name) {
        response = response.filter(pokemon => 
            // case insensitive searching
              pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
        );
    }
    // filter our pokemon by type if type query param is present
    if (req.query.type) {
        response = response.filter(pokemon => 
             pokemon.type.includes(req.query.type)
        );
    }

    res.json(response);
});

/* Error handler middleware */
app.use((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { error };
    }
    res.status(500).json(response);
});


module.exports = app;