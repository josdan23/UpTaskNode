const express = require ('express');
const { restart } = require('nodemon');
const routes = express.Router();

const {body} = require('express-validator');


const proyectoController = require('../controllers/proyectoController');
const tareasController = require('../controllers/tareaController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {

    routes.get('/',
        authController.usuarioAutenticado, 
        proyectoController.proyectoHome);

    routes.get('/nuevo-proyecto',
        authController.usuarioAutenticado,
        proyectoController.formularioProyecto);

    routes.post('/nuevo-proyecto', 
        body('nombre').not().isEmpty().trim().escape(),
        authController.usuarioAutenticado,
        proyectoController.nuevoProyecto);

    routes.get('/nosotros', 
        authController.usuarioAutenticado,
        proyectoController.nosotros);

    routes.get('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectoController.proyectoPorUrl);

    //Actualizar proyecto
    routes.get('/proyectos/editar/:id', 
        authController.usuarioAutenticado,
        proyectoController.formularioEditar);

    routes.post('/nuevo-proyecto/:id', 
        body('nombre').not().isEmpty().trim().escape(),
        authController.usuarioAutenticado,
        proyectoController.actualizarProyecto);

    routes.delete('/proyectos/:url', 
        authController.usuarioAutenticado,
        proyectoController.eliminarProyecto);

    //tareas
    routes.post('/proyectos/:url', 
        authController.usuarioAutenticado,
        tareasController.agregarTarea);

    // Actualizar tareas
    routes.patch('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.cambiarEstadoTarea);

    // Eliminar tareas
    routes.delete('/tareas/:id', 
        authController.usuarioAutenticado,
        tareasController.eliminarTarea);

    //crear nueva cuenta
    routes.get('/crear-cuenta', usuariosController.formCrearCuenta );

    routes.post('/crear-cuenta', usuariosController.crearCuenta );

    //iniciar sesión
    routes.get('/iniciar-sesion', usuariosController.formIniciarSesion);

    routes.post('/iniciar-sesion', authController.autenticarUsuario);

    // cerrar sesión
    routes.get('/cerrar-sesion', authController.cerrarSesion);

    // reestablecer contraseña
    routes.get('/reestablecer', usuariosController.formRestablcerPassword);

    return routes;
}