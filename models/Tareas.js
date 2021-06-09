const Sequelize = require('sequelize');
const db = require('../config/db');

const Proyectos = require('./Proyectos');

const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
        
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});

//crear llave foranea
//Cada tarea pertenece a un proyecto
Tareas.belongsTo(Proyectos);

//otra opción
//Un proyecto tiene muchas tareas
//Proyectos.hasMany(Tareas);


module.exports = Tareas;