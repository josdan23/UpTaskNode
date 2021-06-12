const passport = require('passport');

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