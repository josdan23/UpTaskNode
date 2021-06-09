const express = require ('express');
const { restart } = require('nodemon');
const routes = express.Router();

const {body} = require('express-validator');


const proyectoController = require('../controllers/proyectoController');
const tareasController = require('../controllers/tareaController');
const usuariosController = require('../controllers/usuariosController');


module.exports = function() {

    routes.get('/', proyectoController.proyectoHome);

    routes.get('/nuevo-proyecto', proyectoController.formularioProyecto);

    routes.post('/nuevo-proyecto', 
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.nuevoProyecto);

    routes.get('/nosotros', proyectoController.nosotros);

    routes.get('/proyectos/:url', proyectoController.proyectoPorUrl);

    //Actualizar proyecto
    routes.get('/proyectos/editar/:id', proyectoController.formularioEditar);

    routes.post('/nuevo-proyecto/:id', 
        body('nombre').not().isEmpty().trim().escape(),
        proyectoController.actualizarProyecto);

    routes.delete('/proyectos/:url', proyectoController.eliminarProyecto);

    //tareas
    routes.post('/proyectos/:url', tareasController.agregarTarea);

    // Actualizar tareas
    routes.patch('/tareas/:id', tareasController.cambiarEstadoTarea);

    // Eliminar tareas
    routes.delete('/tareas/:id', tareasController.eliminarTarea);

    //crear nueva cuenta
    routes.get('/crear-cuenta', usuariosController.formCrearCuenta );

    routes.post('/crear-cuenta', usuariosController.crearCuenta );

    return routes;
}