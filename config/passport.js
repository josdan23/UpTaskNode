const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

//local strategy - Login con credenciales propias (usuarios y password)
passport.use(
    new LocalStrategy(
        //por defecto passport espera un usuario y password
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuarios.findOne({
                    where: {
                        email,
                        activo: 1 
                    }
                })

                if(!usuario.verificarPassword(password)) {
                    
                    return done(null, false, {
                        message: 'El password incorrecto'
                    })

                }
                
                //El email existe, y el password correcto
                return done( null, usuario );

            } catch (error) {
                // ese usuario no existe
                return done(null, false, {
                    message: 'Esa cuenta no existe'
                })
            }
        }
    )
);

// Serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback( null, usuario);
});


// Deserializar el usuario
passport.deserializeUser(( usuario, callback ) => {
    callback( null, usuario );
})

// Exportar 
module.exports = passport;