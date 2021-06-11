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
        req.flash('error', error.errors.map(error => error.message));

        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear cuenta en Uptask'
        });
    }
    
}