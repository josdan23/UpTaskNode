const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const { Op } = require("sequelize");
const bcrypt = require('bcrypt-nodejs');

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

exports.validarToken = async ( req, res ) => {
    const usuario = await Usuarios.findOne( { 
        where: {
            token: req.params.token
        }
    })

    // si no encuentra el usuario
    if(!usuario){
        req.flash('error', 'No válido');
        res.redirect('/reestablecer');
    }

    // formulario para generar password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

// cambia el password por uno nuevo
exports.actualizarPassword = async ( req, res ) => {
    
    //verifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne( {
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte]: Date.now()
            }
        }
    });
  
    //verficamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No válido');
        req.redirect('/reestablecer');
    }

    // hashear el nuevo password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
  
    //guardamos el nuevo password
    await usuario.save()

    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}   