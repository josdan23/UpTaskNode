const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');

//el primero parrametro es el nombre del modelo, 
//el segundo son los atributos
const Usuarios = db.define('usuario', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false
    }
});

//los password siempre se hashean a 60

//los usuarios pueden crear varios proyectos. 
//hacemos que las tablas se asocione, creando los foreing key
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;