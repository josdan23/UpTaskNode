const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');

exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

//función para revisar si el usuario está logeado o no
exports.usuarioAutenticado = ( req, res, next ) => {

    // si el usuario está autenticado, adelante
    if(req.isAuthenticated() ){
        return next();
    }
    // si no está autenticado, redirigir el formulario
    return res.redirect('/iniciar-sesion');
}


//función para cerrar sesión
exports.cerrarSesion = ( req, res ) => {
    req.session.destroy( () => {
        res.redirect('/iniciar-sesion'); // al cerrar sesion nos lleva al login
    })
}

// genera un token si el usuario es valido
exports.enviarToken = async (req, res ) => {
    // verificar que el usuario existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: {email}});

    // si no existe el usuario
    if(!usuario) {
        console.log('usuario no existe');

        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    //guardar los datos en la base de datos
    await usuario.save();

    //url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;
    console.log(resetUrl);
}

exports.resetPassword = async ( req, res ) => {
    res.json( req.params.token);
}