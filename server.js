'use strict';

//import the express framework
const express = require('express');
const server = express();

//import the cors
const cors = require('cors');

//server open for all clients requests
server.use(cors());

//Port number
const PORT = 3000;

//Create a constructor function to ensure the data follow the same format
function Movies(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


//Routes (Endpoints)

//Home route
server.get('/', (req, res) => {
    const movieData = require('./Movie Data/data.json');
    const data = new Movies(movieData.title, movieData.poster_path, movieData.overview);
    if (data != null) {
        res.send(data);
    } else {
        res.status(500).send('Sorry, something went wrong');
    }
})

//Favorite route
server.get('/favorite', (req, res) => {
    // if (data != null) {
        res.send('Welcome to Favorite Page');
    // } else {
    //     res.status(500).send('Sorry, something went wrong');
    // }
})

// function error(route){
// if (route)
// }

//Handle errors default route 
server.get('*', (req, res) => {
    res.status(404).send('page not found error');
})

// server.get('/',(req,res)=>{
//     res.status(500).send('Sorry, something went wrong');
// })

//Tell the server about its port number (http://localhost:3000 => (Ip = localhost) (port = 3000))
server.listen(PORT, () => {

})