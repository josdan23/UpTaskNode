const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectoHome = async ( req, res ) => {

    const proyectos = await Proyectos.findAll();

    res.render('index', {
        nombrePagina: 'Proyectos ' + res.locals.year,
        proyectos
    });
}

exports.nosotros = ( req, res ) => {
    res.render('nosotros');
}

exports.formularioProyecto = async (req, res) => {

    const proyectos = await Proyectos.findAll();


    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {

    const proyectos = await Proyectos.findAll();
    
    const { nombre } = req.body;

    let errores = []

    if(!nombre) {
        errores.push({
            texto: 'Agrega un nombre al proyecto'
        })
    }

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proycto',
            errores,
            proyectos
        })
    } else {

        const usuarioId = res.locals.usuario.id;

        const proyecto = await Proyectos.create({
            nombre,
            usuarioId
        });

        res.redirect('/');
    }
}


exports.proyectoPorUrl = async (req,res, next) => {
    
    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne( {
        where: {
            url: req.params.url
        }
    });

   

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    //consultar tareas del proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        //ME PERMITE TRAER EL PROYECTO RELACIONADO, ES COMO UN JOIN
        // include: [
        //     { model: Proyectos }
        // ]
    });

    if(!proyecto)
        return next();

    console.log(proyecto);

    res.render('tareas', {
        nombrePagina : 'Tareas del proyecto',
        proyecto,
        proyectos,
        tareas
    })

}

exports.formularioEditar = async (req, res) => {

    const proyectosPromise = Proyectos.findAll();

    const proyectoPromise = Proyectos.findOne( {
        where: {
            id: req.params.id
        }
    });

    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

    res.render('nuevoProyecto', {
        nombrePagina: 'Editar proyecto',
        proyectos,
        proyecto
    })

}

exports.actualizarProyecto = async (req, res) => {

    const proyectos = await Proyectos.findAll();
    
    const { nombre } = req.body;

    let errores = []

    if(!nombre) {
        errores.push({
            texto: 'Agrega un nombre al proyecto'
        })
    }

    if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proycto',
            errores,
            proyectos
        })
    } else {
        console.log(nombre);


        //actualizamos el proyecto en la base de datos a traves del modelo
        await Proyectos.update(
            { nombre: nombre }, //que vamos a actualizar del registro
            { where: { id: req.params.id } } //la condicion para encontrar el registro
        );

        res.redirect('/');
    }

}

exports.eliminarProyecto = async (req, res, next )=>{
    //console.log(req.query);

    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({
        where:{ url: urlProyecto }
    });

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto eliminado correctamente');

}