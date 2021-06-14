const express = require('express');
//import express from 'express';

const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParse = require('cookie-parser');
const passport = require('./config/passport');

// extraer valores de variables.env
require('dotenv').config({path: 'variables.env'});


const helpers = require('./helpers');

const db = require('./config/db');


require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al Servidor'))
    .catch((error) => console.log(error));

//crea una app express
const app = express();

//donde carga los archivos estaticos
app.use(express.static('public'));

//establecer pug como template engine
app.set('view engine', 'pug');

app.use(express.urlencoded({extended: true}));
//app.use(bodyParser.urlencoded({extended: true}));

//añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// agregar flash messages
app.use(flash());


app.use(cookieParse());

//las sesiones nos permiten navegar entre distintas pagians sin volvernos a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    console.log('yo soy un middleware')
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null; //spread operator: crea una copia
    next();
});

app.use((req, res, next) => {
    console.log('yo soy otro middleware')
    const fecha = new Date();
    res.locals.year = fecha.getFullYear();
    next();
});




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


// Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


app.listen( port, host, () => {
    console.log('El servidor esta funcionado');
});
