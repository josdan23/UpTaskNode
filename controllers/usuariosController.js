const Usuarios = require('../models/Usuarios');

exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta', {
        nombrePagina: 'Crear cuenta en Uptask'
    });
}

exports.crearCuenta = async (req, res) => {

    const { email, password } = req.body;

    try {
        //crear usuario
        await Usuarios.create({
            email,
            password
        });

        res.redirect('/iniciar-sesion');
    } catch (error) {
        res.render('crearCuenta', {
            errores: error.errors,
            nombrePagina: 'Crear cuenta en Uptask'
        });
    }
    
}