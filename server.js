'use strict';
//(http://localhost:3000 => (Ip = localhost) (port = 3000))
//..............................................................................
//imports
//import the express framework 
const express = require('express');
const server = express();

//import the cors 
const cors = require('cors');

//import tha axios (To send a req from our server to anther one or anther API (3rd party))
const axios = require('axios');

//import the dotenv
require('dotenv').config();

//..............................................................................
//server open for all clients requests
server.use(cors());

//..............................................................................
//Create a variables
//const movieData = require('./Movie Data/data.json');

//Port number
const PORT = 3000;
const APIKey = process.env.APIKey;

//..............................................................................
//Create a constructor function to ensure the data follow the same format
function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

//..............................................................................
//Routes (Endpoints)
//Home route
server.get('/', homeHandler)
//Favorite route
server.get('/favorite', favoriteHandler)
//Default route 
server.get('*', defaultHandler)

//..............................................................................
//Functions Handlers
//Home Handler
function homeHandler(req, res) {
    // /genre
    const url4 = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKey}&language=en-US`;
    try {
        axios.get(url4).then((axiosResult) => {
            let mapRes = axiosResult.data.genres.map((item) => {
                const data = new Movies(item.id, item.name);
                return data;
            })
            res.send(mapRes);
        })
            .catch((err) => {
                console.log("Sorry, something went wrong", err);
                res.status(500).send(err);
            })
    }

    catch (error) {
        errorHandler(error, req, res);
    }
}

//Favorite route Handler
function favoriteHandler(req, res) {
    // /trending
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`;
    // /search
    const url2 = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`;
    // /discover
    const url3 = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKey}&language=en-US`;
    try {
        axios.get(url).then((axiosResult) => {
            let mapRes = axiosResult.data.results.map((item) => {
                const data = new Movies(item.id, item.title, item.release_date, item.poster_path, item.overview);
                return data;
            })
            res.send(mapRes);
        })
            .catch((err) => {
                console.log("Sorry, something went wrong", err);
                res.status(500).send(err);
            })
    }

    catch (error) {
        errorHandler(error, req, res);
    }
}

//middleware function
function errorHandler(erorr, req, res) {
    const err = {
        status: 500,
        massage: erorr
    }
    res.status(500).send(err);
}

//Default Handler
function defaultHandler(req, res) {
    res.status(404).send('page not found error');
}
//..............................................................................
//Functions
function movies(url) {

}

//..............................................................................
//Tell the server about its port number (port = 3000)
server.listen(PORT, () => {
    console.log(`listening on ${PORT} : I am ready`);
})