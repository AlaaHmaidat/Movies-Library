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

//import pg
const pg = require('pg');//1. importing the pg 

//..............................................................................
//server open for all clients requests
server.use(cors());
server.use(express.json());

//..............................................................................
//Create a variables
//const movieData = require('./Movie Data/data.json');

//Port number
const PORT = 3000;
const APIKey = process.env.APIKey;
//2. create obj from Client
const client = new pg.Client(process.env.DATABASE_URL);
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
//Genre route
server.get('/genre', genreHandler)
//Trending route
server.get('/trending', trendingHandler)
//Search route
server.get('/search', searchHandler)
//Discover route
server.get('/discover', discoverHandler)
//Git movie route
server.get('/getmovies', getMoviesHandler)
//Git specific movie route
server.get('/getmovie/:id', getSpecificMoviesHandler)
//Add movie route
server.post('/addmovie', addMovieHandler)
//Delete route
server.delete('/DELETE/:id', deleteMovieHandler)
//Update route
server.put('/UPDATE/:id', updateMovieHandler)
//Default route 
server.get('*', defaultHandler)

//..............................................................................
//Functions Handlers
//Home Handler
function homeHandler(req, res) {
    res.send('Welcome to Home Page');
}

//Favorite route Handler
function favoriteHandler(req, res) {
    res.send('Welcome to Favorite Page');
}

//Genre Handler
function genreHandler(req, res) {
    // http://localhost:3000/genre
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${APIKey}&language=en-US`;
    try {
        axios.get(url).then((axiosResult) => {
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

//Trending Handler
function trendingHandler(req, res) {
    // http://localhost:3000/trending
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${APIKey}&language=en-US`;

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

//Search Handler
function searchHandler(req, res) {
    // http://localhost:3000/search
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${APIKey}&language=en-US&query=The&page=2`;

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

//Discover Handler
function discoverHandler(req, res) {
    // http://localhost:3000/discover
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKey}&language=en-US`;
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

//Git Movie Handler
function getMoviesHandler(req, res) {
    //    return all movies (movie tabel content)
    //    http://localhost:3000/getmovies
    const sql = `SELECT * FROM movie`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

//Git SpecificMovie Handler
function getSpecificMoviesHandler(req, res) {
    //    return specific movies 
    //    http://localhost:3000/getmovie/id
    const id = req.params.id;
        const sql = `SELECT * FROM movie WHERE id=${id}`;
    client.query(sql)
        .then((data) => {
            res.send(data.rows);
        })
        .catch((err) => {
            errorHandler(err, req, res);
        })
}

//Add (post) Movie Handler
function addMovieHandler(req, res) {
    //    /addmovie
    const addMovie = req.body;
    const sql = `INSERT INTO movie (title,release_date,overview) VALUES ($1,$2,$3) RETURNING *`;
    const arrVal = [addMovie.title, addMovie.release_date, addMovie.overview];
    client.query(sql, arrVal)
        .then((data) => {
            res.send("your data was added !");
        })
        .catch(error => {
            // console.log(error);
            errorHandler(error, req, res);
        });
}

//Delete Movie Handler
function deleteMovieHandler(req, res) {
    //   /DELETE/:id

    const id = req.params.id; //to get the path prameters
    const sql = `DELETE FROM movie WHERE id=${id}`;
    client.query(sql)
        .then((resData) => {
            //this status(204) if id dosnt exist 
            res.status(204).json({});
        })
        .catch((error) => {
            errorHandler(error, req, res);
        })
}

//Update Movie Handler
function updateMovieHandler(req, res) {
    //  /UPDATE/:id
    const id = req.params.id; //to get the path prameters
    const updateReq = req.body;
    const sql = `UPDATE movie
    SET title =$1
    WHERE id=${id};`;
    const arrVal = [updateReq.title];
    client.query(sql, arrVal)
        .then((resData) => {
            //this status(200) mean everything is OK
            res.status(200).send(resData.rows);
        })
        .catch(error => {
            // console.log(error);
            errorHandler(error, req, res);
        });
}

//middleware function Handler
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
//3. connect the server with demo13 database
//Tell the server about its port number (port = 3000)
client.connect()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`listening on ${PORT} : I am ready`);
        });
    })