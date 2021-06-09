const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('../models/Proyectos');
const bcrypt = require('bcrypt-nodejs');

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
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido'
            },
            notEmpty: {
                msg: 'El email no puede ir vacio'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacio'
            }
        }
    }
},
{
    hooks: {
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) );
        }
    }
});

//los password siempre se hashean a 60

//los usuarios pueden crear varios proyectos. 
//hacemos que las tablas se asocione, creando los foreing key
Usuarios.hasMany(Proyectos);

module.exports = Usuarios;