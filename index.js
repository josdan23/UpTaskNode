const express = require('express');
//import express from 'express';

const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

const app = express();

const helpers = require('./helpers');

const db = require('./config/db');


require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch((error) => console.log(error))


//establecer pug como template engine
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, './views'));

app.use(express.static('public'));


// agregar flash messages
app.use(flash());

app.use((req, res, next) => {
    console.log('yo soy un middleware')
    res.locals.vardump = helpers.vardump;
    next();
});

app.use((req, res, next) => {
    console.log('yo soy otro middleware')
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});


app.use(express.urlencoded({extended: true}));
//app.use(bodyParser.urlencoded({extended: true}));

/* 
const productos = [
    {
        nombre: 'computadora',
        precio: 3000
    },
    {
        nombre: 'libros',
        precio: 1000
    }
]; */


//MOVEMOS LAS RUTAS A UN ARCHIVO SEPARADO
/* 
app.use('/', (req, res) => {
    
    
    //res.send(prodcannabisuctos);
    //res.json(productos);
    //res.render('Hola');
    //res.send('Hola'); 

});
 */

app.use('/', routes() );

app.listen(4000);