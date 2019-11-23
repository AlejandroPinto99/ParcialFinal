var Personaje = require('../models/personajes');
var debug = require('debug')('HarryPotterRestful:personaje_controller');

//Buscar a un personaje por su nombre

module.exports.getOne = (req, res, next) => {
    debug("Search Character", req.params);
    Personaje.findOne({
            nombre: req.params.nombre
        })
        .then((foundCharacter) => {
            if (foundCharacter)
                return res.status(200).json(foundCharacter);
            else
                return res.status(400).json(null)
        })
        .catch(err => {
            next(err);
        });
}

//Listar personajes (TODOS)

module.exports.getAll = (req, res, next) => {
    var perPage = Number(req.query.size) || 15,
        page = req.query.page > 0 ? req.query.page : 0;

    var sortProperty = req.query.sortby || "createdAt",
        sort = req.query.sort || "desc";

    debug("Character List",{size:perPage,page, sortby:sortProperty,sort});

    Personaje.find({})
        .limit(perPage)
        .skip(perPage * page)
        .sort({ [sortProperty]: sort})
        .then((personaje) => {
           return res.status(200).json(personaje)
        }).catch(err => {
            next(err);
        })
}

//Ingresando personajes a la base de datos 

module.exports.register = (req, res, next) => {
    debug("New Character", {
        body: req.body
    });
    Personaje.findOne({
            nombre: req.body.nombre
        })
        .then((foundCharacter) => {
            if (foundCharacter) {
                debug("Personaje duplicado");
                throw new Error(`Personaje duplicado ${req.body.nombre}`);
            } else {
                 
                let newCharacter = new Personaje({
                    nombre: req.body.nombre,
                    apellido: req.body.apellido,
                    asiste: req.body.asiste,
                    muggle: req.body.muggle
                });
                return newCharacter.save(); 
            }
        }).then(character => { // Con el usario almacenado retornamos que ha sido creado con exito
            return res
                .header('Location', '/personajes/' + character._nombre)
                .status(201)
                .json({
                    nombre: character.nombre
                });
        }).catch(err => {
            next(err);
        });
}

//Actualizando un personaje 

module.exports.update = (req, res, next) => {
    debug("Update character", {
        nombre: req.params.nombre,
        ...req.body
    });

    let update = {
        ...req.body
    };

    Character.findOneAndUpdate({
            nombre: req.params.nombre
        }, update, {
            new: true
        })
        .then((updated) => {
            if (updated)
                return res.status(200).json(updated);
            else
                return res.status(400).json(null);
        }).catch(err => {
            next(err);
        });
}

//Borrando personaje de la base de datos 



module.exports.delete = (req, res, next) => {

    debug("Delete character", {
        nombre: req.params.nombre,
    });

    Character.findOneAndDelete({nombre: req.params.nombre})
    .then((data) =>{
        if (data) res.status(200).json(data);
        else res.status(404).send();
    }).catch( err => {
        next(err);
    })
}